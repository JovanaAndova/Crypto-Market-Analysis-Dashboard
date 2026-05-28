import time
import os
import requests
import pandas as pd
import numpy as np

from ta.momentum import RSIIndicator, StochasticOscillator
from ta.trend import MACD, ADXIndicator, CCIIndicator, SMAIndicator, EMAIndicator, WMAIndicator
from ta.volatility import BollingerBands



COINGECKO_BASE = "https://api.coingecko.com/api/v3"


COINGECKO_API_KEY = os.getenv("COINGECKO_API_KEY", "CG-mZA8hpvbXvy9MZw1qjX9aMPb")

TA_SUMMARY_FILE = "TA_top100_summary.csv"

TOP_COINS_CACHE = "top_coins_cache.csv"


#http helper

def cg_get(url: str, params: dict | None = None, timeout: int = 30, max_retries: int = 6):
    """
    Helper for CoinGecko GET requests with:
    - basic retry logic
    - handling HTTP 429 (rate limit)
    """
    wait = 1
    last_err = None

    headers = {
        "User-Agent": "technical-analysis/1.0 (student-project)"
    }

    if COINGECKO_API_KEY:
        # demo key header as required by CoinGecko
        headers["x-cg-demo-api-key"] = COINGECKO_API_KEY

    for attempt in range(1, max_retries + 1):
        try:
            r = requests.get(url, params=params, timeout=timeout, headers=headers)

            if r.status_code == 429:
                print(f"[429] Rate limit -> sleep {wait}s (attempt {attempt}/{max_retries}) :: {url}")
                time.sleep(wait)
                wait = min(wait * 2, 10)
                continue

            r.raise_for_status()
            return r.json()

        except Exception as e:
            last_err = e
            print(f"[ERR] {type(e).__name__} -> sleep {wait}s (attempt {attempt}/{max_retries}) :: {url}")
            time.sleep(wait)
            wait = min(wait * 2, 10)

    raise RuntimeError(f"CoinGecko request failed after retries: {url} ({last_err})")


#fetch top-n-coins

def fetch_top_n_coins(n: int = 100, vs_currency: str = "usd") -> list[dict]:
    """
    Fetch top N coins by market cap from CoinGecko.
    """
    out = []
    per_page = 250
    pages = (n + per_page - 1) // per_page

    for page in range(1, pages + 1):
        url = f"{COINGECKO_BASE}/coins/markets"
        data = cg_get(url, params={
            "vs_currency": vs_currency,
            "order": "market_cap_desc",
            "per_page": per_page,
            "page": page,
            "sparkline": "false"
        })
        out.extend(data)

    return out[:n]


def fetch_top_n_coins_cached(n: int = 100, vs_currency: str = "usd",
                             cache_file: str = TOP_COINS_CACHE) -> list[dict]:
    """
    Same as fetch_top_n_coins, but caches the result in a CSV so we
    don't hit CoinGecko every time.
    """
    try:
        df = pd.read_csv(cache_file)
        if len(df) >= n:
            return df.head(n).to_dict(orient="records")
    except Exception:
        pass

    coins = fetch_top_n_coins(n, vs_currency=vs_currency)
    pd.DataFrame(coins)[["id", "symbol", "name"]].to_csv(cache_file, index=False)
    return coins


#fetch ohlc volume

def fetch_ohlc(coin_id: str, vs_currency: str = "usd", days: int = 365) -> pd.DataFrame:
    """
    Fetch OHLC data for a coin for the last N days.
    """
    url = f"{COINGECKO_BASE}/coins/{coin_id}/ohlc"
    data = cg_get(url, params={"vs_currency": vs_currency, "days": days})

    df = pd.DataFrame(data, columns=["ts", "open", "high", "low", "close"])
    df["date"] = pd.to_datetime(df["ts"], unit="ms", utc=True).dt.tz_convert(None)
    df = df.drop(columns=["ts"]).sort_values("date").reset_index(drop=True)
    return df


def fetch_volume(coin_id: str, vs_currency: str = "usd", days: int = 365) -> pd.DataFrame:
    """
    Fetch volume data for a coin for the last N days.
    """
    url = f"{COINGECKO_BASE}/coins/{coin_id}/market_chart"
    data = cg_get(url, params={"vs_currency": vs_currency, "days": days})

    vols = data.get("total_volumes", [])
    df = pd.DataFrame(vols, columns=["ts", "volume"])
    df["date"] = pd.to_datetime(df["ts"], unit="ms", utc=True).dt.tz_convert(None)
    df = df.drop(columns=["ts"]).sort_values("date").reset_index(drop=True)
    return df


def merge_ohlc_volume(ohlc: pd.DataFrame, vol: pd.DataFrame) -> pd.DataFrame:
    """
    Merge OHLC and volume by nearest timestamp.
    """
    o = ohlc.copy().sort_values("date")
    v = vol.copy().sort_values("date")

    merged = pd.merge_asof(
        o, v, on="date",
        direction="nearest",
        tolerance=pd.Timedelta("2h")
    )
    merged["volume"] = merged["volume"].ffill().fillna(0.0)
    return merged


#timeframes

def resample_ohlcv(df: pd.DataFrame, rule: str) -> pd.DataFrame:
    """
    Resample OHLCV to a given rule:
    - D -> 1 day
    - W -> 1 week
    - M (internally ME) -> 1 month (month-end)
    """
    if rule == "M":
        # newer pandas prefers "ME" for month-end
        rule = "ME"

    x = df.copy().set_index("date")
    out = (
        x.resample(rule)
        .agg(
            open=("open", "first"),
            high=("high", "max"),
            low=("low", "min"),
            close=("close", "last"),
            volume=("volume", "sum"),
        )
        .dropna(subset=["open", "high", "low", "close"])
        .reset_index()
    )
    return out


#indicators and signals

def safe_window(n: int, length: int) -> int:
    """
    For very short series, shrink the indicator window so it doesn't blow up.
    """
    return max(2, min(n, max(2, length - 1)))


def cross_up(a: pd.Series, b: pd.Series) -> pd.Series:
    """
    True when a crosses *above* b.
    """
    return (a.shift(1) <= b.shift(1)) & (a > b)


def cross_down(a: pd.Series, b: pd.Series) -> pd.Series:
    """
    True when a crosses *below* b.
    """
    return (a.shift(1) >= b.shift(1)) & (a < b)


def compute_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute the 10 chosen technical indicators:

    Oscillators:
      - RSI
      - MACD (macd, macd_signal, macd_hist)
      - Stochastic (stoch_k, stoch_d)
      - ADX
      - CCI

    Moving averages:
      - SMA
      - EMA
      - WMA
      - Bollinger Bands (bb_high, bb_low)
      - Volume MA (vma)
    """
    x = df.copy()
    L = len(x)

    rsi_n = safe_window(14, L)
    cci_n = safe_window(20, L)
    adx_n = safe_window(14, L)
    stoch_n = safe_window(14, L)
    stoch_smooth = 3

    sma_n = safe_window(20, L)
    ema_n = safe_window(14, L)
    wma_n = safe_window(14, L)
    bb_n = safe_window(20, L)
    vma_n = safe_window(14, L)

    # ----- Oscillators -----
    x["rsi"] = RSIIndicator(close=x["close"], window=rsi_n).rsi()

    macd_obj = MACD(
        close=x["close"],
        window_slow=safe_window(26, L),
        window_fast=safe_window(12, L),
        window_sign=9
    )
    x["macd"] = macd_obj.macd()
    x["macd_signal"] = macd_obj.macd_signal()
    x["macd_hist"] = x["macd"] - x["macd_signal"]

    stoch_obj = StochasticOscillator(
        high=x["high"], low=x["low"], close=x["close"],
        window=stoch_n, smooth_window=stoch_smooth
    )
    x["stoch_k"] = stoch_obj.stoch()
    x["stoch_d"] = stoch_obj.stoch_signal()

    x["adx"] = ADXIndicator(high=x["high"], low=x["low"], close=x["close"], window=adx_n).adx()
    x["cci"] = CCIIndicator(high=x["high"], low=x["low"], close=x["close"], window=cci_n).cci()

    # ----- Moving averages / bands / volume MA -----
    x["sma"] = SMAIndicator(close=x["close"], window=sma_n).sma_indicator()
    x["ema"] = EMAIndicator(close=x["close"], window=ema_n).ema_indicator()
    x["wma"] = WMAIndicator(close=x["close"], window=wma_n).wma()

    bb = BollingerBands(close=x["close"], window=bb_n, window_dev=2)
    x["bb_high"] = bb.bollinger_hband()
    x["bb_low"] = bb.bollinger_lband()

    x["vma"] = x["volume"].rolling(vma_n).mean()

    return x


def add_signals(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generate BUY / SELL / HOLD signals from indicators.
    Each indicator contributes a signal in [-1, 0, 1].
    score = sum of all indicator signals.
    final_signal:
      - BUY  if score >= 3
      - SELL if score <= -3
      - HOLD otherwise
    """
    x = df.copy()

    # ----- Oscillator signals -----
    # RSI: oversold <30 => BUY, overbought >70 => SELL
    x["sig_rsi"] = np.where(x["rsi"] < 30, 1, np.where(x["rsi"] > 70, -1, 0))

    # MACD crossovers
    x["sig_macd"] = np.where(
        cross_up(x["macd"], x["macd_signal"]), 1,
        np.where(cross_down(x["macd"], x["macd_signal"]), -1, 0)
    )

    # Stochastic: oversold/overbought with crossovers
    x["sig_stoch"] = np.where(
        (x["stoch_k"] < 20) & cross_up(x["stoch_k"], x["stoch_d"]), 1,
        np.where((x["stoch_k"] > 80) & cross_down(x["stoch_k"], x["stoch_d"]), -1, 0)
    )

    # ADX: trend strength (not directional) – >25 => trending (1), else 0
    x["sig_adx"] = np.where(x["adx"] > 25, 1, 0)

    # CCI: oversold/overbought + turning points
    x["sig_cci"] = np.where(
        (x["cci"] < -100) & (x["cci"] > x["cci"].shift(1)), 1,
        np.where((x["cci"] > 100) & (x["cci"] < x["cci"].shift(1)), -1, 0)
    )

    # ----- Moving average / bands / volume signals -----
    # Price vs SMA
    x["sig_sma"] = np.where(x["close"] > x["sma"], 1, np.where(x["close"] < x["sma"], -1, 0))

    # Price crossing EMA
    x["sig_ema"] = np.where(
        cross_up(x["close"], x["ema"]), 1,
        np.where(cross_down(x["close"], x["ema"]), -1, 0)
    )

    # Price vs WMA
    x["sig_wma"] = np.where(x["close"] > x["wma"], 1, np.where(x["close"] < x["wma"], -1, 0))

    # Bollinger Bands: close below lower band => BUY, above upper band => SELL
    x["sig_bb"] = np.where(x["close"] < x["bb_low"], 1, np.where(x["close"] > x["bb_high"], -1, 0))

    # Volume > volume moving average => 1, else 0
    x["sig_vma"] = np.where(x["volume"] > x["vma"], 1, 0)

    sig_cols = [
        "sig_rsi", "sig_macd", "sig_stoch", "sig_adx", "sig_cci",
        "sig_sma", "sig_ema", "sig_wma", "sig_bb", "sig_vma"
    ]
    x["score"] = x[sig_cols].sum(axis=1, min_count=1)

    x["final_signal"] = np.where(
        x["score"] >= 3, "BUY",
        np.where(x["score"] <= -3, "SELL", "HOLD")
    )
    return x

#per-timeframe analysis

def analyze_timeframe(df_ohlcv: pd.DataFrame, timeframe: str) -> dict:
    """
    Analyze one timeframe (1D / 1W / 1M).
    Returns ONLY the final (most recent) signal & score.
    """
    # small guard for very short series
    min_len = {"1D": 25, "1W": 4, "1M": 3}.get(timeframe, 25)
    if df_ohlcv is None or len(df_ohlcv) < min_len:
        return {"timeframe": timeframe, "signal": "HOLD", "score": 0.0}

    try:
        x = add_signals(compute_indicators(df_ohlcv))
        last = x.tail(1)
        if last.empty:
            return {"timeframe": timeframe, "signal": "HOLD", "score": 0.0}

        score_val = float(last["score"].iloc[0]) if pd.notna(last["score"].iloc[0]) else 0.0
        signal_val = str(last["final_signal"].iloc[0])

        return {
            "timeframe": timeframe,
            "signal": signal_val,
            "score": score_val,
        }
    except Exception:
        # if any indicator fails, don't kill the whole coin
        return {"timeframe": timeframe, "signal": "HOLD", "score": 0.0}


def run_for_coin_id(coin_id: str, vs_currency: str = "usd", days: int = 365) -> dict:
    """
    Full pipeline for ONE coin:
    - fetch OHLC + volume
    - merge
    - resample to 1D, 1W, 1M
    - compute signals & scores for each timeframe
    """
    ohlc = fetch_ohlc(coin_id, vs_currency, days)
    vol = fetch_volume(coin_id, vs_currency, days)
    base = merge_ohlc_volume(ohlc, vol)

    df_1d = resample_ohlcv(base, "D")
    df_1w = resample_ohlcv(base, "W")
    df_1m = resample_ohlcv(base, "M")

    s1 = analyze_timeframe(df_1d, "1D")
    s2 = analyze_timeframe(df_1w, "1W")
    s3 = analyze_timeframe(df_1m, "1M")

    return {
        "coin_id": coin_id,
        "signal_1D": s1["signal"], "score_1D": s1["score"],
        "signal_1W": s2["signal"], "score_1W": s2["score"],
        "signal_1M": s3["signal"], "score_1M": s3["score"],
    }

#technical analysis main

if __name__ == "__main__":
    VS = "usd"
    DAYS = 365       # 1 year of history
    TOP_N = 1000      # analyze top 1000 coins

    # load top N coins with cache
    top = fetch_top_n_coins_cached(TOP_N, vs_currency=VS)

    rows = []

    # optionally skip stablecoins, since signals make little sense there
    skip_syms = {"USDT", "USDC", "DAI", "TUSD", "BUSD"}

    for i, c in enumerate(top, start=1):
        coin_id = c["id"]
        sym = str(c.get("symbol", "")).upper()
        name = str(c.get("name", ""))

        if sym in skip_syms:
            print(f"[SKIP] {sym} (stablecoin)")
            continue

        try:
            print(f"[{i}/{TOP_N}] {sym} ({coin_id}) ...")
            r = run_for_coin_id(coin_id, vs_currency=VS, days=DAYS)
            r["symbol"] = sym
            r["name"] = name
            rows.append(r)

            # be gentle with the API
            time.sleep(2.5)
        except Exception as e:
            print(f"[SKIP] {coin_id}: {e}")

    if rows:
        summary = pd.DataFrame(rows)
        summary.to_csv(TA_SUMMARY_FILE, index=False)
        print(f"Saved summary: {TA_SUMMARY_FILE}")
    else:
        print("No results saved (all failed).")
