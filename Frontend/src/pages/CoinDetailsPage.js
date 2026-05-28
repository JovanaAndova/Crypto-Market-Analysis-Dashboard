import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Brush,
    CartesianGrid,
} from "recharts";
import TaGauge from "../components/TaGauge";
import { API_BASE } from "../config/api";


const ranges = [
    { label: "30d", days: 30 },
    { label: "90d", days: 90 },
    { label: "1y", days: 365 },
    { label: "5y", days: 365 * 5 },
    { label: "MAX", days: null },
];

// --- Math Helpers for Indicators ---
function calculateEMA(arr, period) {
    if (!arr?.length) return [];
    const k = 2 / (period + 1);
    const ema = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        ema[i] = arr[i] * k + ema[i - 1] * (1 - k);
    }
    return ema;
}

function calculateMACD(closes) {
    if (closes.length < 26) return { macd: [], signal: [], hist: [] };
    const fastEMA = calculateEMA(closes, 12);
    const slowEMA = calculateEMA(closes, 26);
    const macdLine = fastEMA.map((f, i) => f - slowEMA[i]);
    const signalLine = calculateEMA(macdLine.slice(25), 9);
    const fullSignal = Array(25).fill(null).concat(signalLine);
    const hist = macdLine.map((m, i) =>
        fullSignal[i] !== null ? m - fullSignal[i] : null
    );
    return { macd: macdLine, signal: fullSignal, hist: hist };
}

function calculateRSI(closes, period = 14) {
    if (closes.length < period + 1) return Array(closes.length).fill(null);

    const rsi = Array(closes.length).fill(null);
    let g = 0,
        l = 0;

    for (let i = 1; i <= period; i++) {
        const d = closes[i] - closes[i - 1];
        if (d > 0) g += d;
        else l -= d;
    }

    let ag = g / period,
        al = l / period;
    rsi[period] = al === 0 ? 100 : 100 - 100 / (1 + ag / al);

    for (let i = period + 1; i < closes.length; i++) {
        const d = closes[i] - closes[i - 1];
        ag = (ag * (period - 1) + (d > 0 ? d : 0)) / period;
        al = (al * (period - 1) + (d < 0 ? -d : 0)) / period;
        rsi[i] = al === 0 ? 100 : 100 - 100 / (1 + ag / al);
    }
    return rsi;
}

function calculateStoch(rows, kPeriod = 14) {
    const stoch = Array(rows.length).fill(null);
    if (rows.length < kPeriod) return stoch;

    for (let i = kPeriod - 1; i < rows.length; i++) {
        const slice = rows.slice(i - kPeriod + 1, i + 1);
        const high = Math.max(...slice.map((r) => parseFloat(r.high)));
        const low = Math.min(...slice.map((r) => parseFloat(r.low)));
        const close = parseFloat(rows[i].close);
        const denom = high - low;
        stoch[i] = denom === 0 ? 0 : ((close - low) / denom) * 100;
    }
    return stoch;
}

export default function CoinDetailsPage({ darkMode }) {
    const { symbol } = useParams();
    const [days, setDays] = useState(null);
    const [coins, setCoins] = useState([]); // assets list for compare
    const [compare, setCompare] = useState("");
    const [baseRows, setBaseRows] = useState([]);
    const [cmpRows, setCmpRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ta, setTa] = useState(null);

    // Dynamic Styles based on Dark Mode
    const theme = {
        bg: darkMode ? "#0f172a" : "#f8fafc",
        card: darkMode ? "#1e293b" : "#ffffff",
        text: darkMode ? "#f8fafc" : "#0f172a",
        subText: "#94a3b8",
        border: darkMode ? "#334155" : "#e2e8f0",
        tableRowEven: darkMode ? "#1a2233" : "#fcfcfd",
        inputBg: darkMode ? "#0f172a" : "#fff",
    };

    // Load assets
    useEffect(() => {
        fetch(`${API_BASE}/api/assets`)
            .then(async (r) => {
                if (!r.ok) throw new Error(`Assets fetch failed: ${r.status}`);
                return r.json();
            })
            .then((data) => setCoins(Array.isArray(data) ? data : []))
            .catch((e) => {
                console.log(e);
                setCoins([]);
            });
    }, []);

    // Load main asset history
    useEffect(() => {
        setLoading(true);
        const url = days
            ? `${API_BASE}/api/history/symbol/${symbol}?days=${days}`
            : `${API_BASE}/api/history/symbol/${symbol}`;

        fetch(url)
            .then(async (r) => {
                if (!r.ok) throw new Error(`History fetch failed: ${r.status}`);
                return r.json();
            })
            .then((data) => {
                const rows = Array.isArray(data) ? data : [];
                setBaseRows(
                    [...rows].sort((a, b) => new Date(a.openTime) - new Date(b.openTime))
                );
            })
            .catch((e) => {
                console.log(e);
                setBaseRows([]);
            })
            .finally(() => setLoading(false));
    }, [symbol, days]);

    // Load compare asset history (if selected)
    useEffect(() => {
        if (!compare) {
            setCmpRows([]);
            return;
        }

        const url = days
            ? `${API_BASE}/api/history/symbol/${compare}?days=${days}`
            : `${API_BASE}/api/history/symbol/${compare}`;

        fetch(url)
            .then(async (r) => {
                if (!r.ok) throw new Error(`Compare history fetch failed: ${r.status}`);
                return r.json();
            })
            .then((data) => {
                const rows = Array.isArray(data) ? data : [];
                setCmpRows(
                    [...rows].sort((a, b) => new Date(a.openTime) - new Date(b.openTime))
                );
            })
            .catch((e) => {
                console.log(e);
                setCmpRows([]);
            });
    }, [compare, days]);

    // Load TA summary
    useEffect(() => {
        fetch(`${API_BASE}/api/ta/symbol/${symbol.toUpperCase()}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(`TA fetch failed: ${r.status}`);
                return r.json();
            })
            .then(setTa)
            .catch(() => setTa(null));
    }, [symbol]);

    const safeCoins = Array.isArray(coins) ? coins : [];

    const chartData = useMemo(() => {
        const map = new Map();
        const closes = baseRows.map((r) => parseFloat(r.close));
        const rsiArr = calculateRSI(closes);
        const { macd, signal, hist } = calculateMACD(closes);
        const stochArr = calculateStoch(baseRows);

        baseRows.forEach((r, i) => {
            const d = r.openTime?.slice(0, 10);
            if (d)
                map.set(d, {
                    date: d,
                    close: closes[i],
                    open: r.open,
                    high: r.high,
                    low: r.low,
                    volume: r.volume,
                    rsi: rsiArr[i],
                    macd: macd[i],
                    macdSig: signal[i],
                    macdHist: hist[i],
                    stoch: stochArr[i],
                });
        });

        cmpRows.forEach((r) => {
            const d = r.openTime?.slice(0, 10);
            if (map.has(d))
                map.set(d, { ...map.get(d), cmpClose: parseFloat(r.close) });
        });

        return Array.from(map.values()).sort((a, b) =>
            a.date.localeCompare(b.date)
        );
    }, [baseRows, cmpRows]);

    if (loading)
        return (
            <div style={{ padding: "50px", textAlign: "center", color: theme.text }}>
                Вчитување...
            </div>
        );

    return (
        <div
            style={{
                padding: "24px",
                maxWidth: "1400px",
                margin: "0 auto",
                color: theme.text,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <div>
                    <Link
                        to="/dashboard"
                        style={{
                            textDecoration: "none",
                            color: theme.subText,
                            fontSize: "12px",
                            fontWeight: "bold",
                        }}
                    >
                        ← BACK
                    </Link>
                    <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>
                        {symbol.toUpperCase()}{" "}
                        <span style={{ color: theme.subText, fontWeight: "300" }}>
              PRO TERMINAL
            </span>
                    </h1>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <select
                        style={{
                            ...styles.select,
                            background: theme.card,
                            color: theme.text,
                            borderColor: theme.border,
                        }}
                        value={days ?? ""}
                        onChange={(e) => setDays(e.target.value ? Number(e.target.value) : null)}
                    >
                        {ranges.map((r) => (
                            <option key={r.label} value={r.days ?? ""}>
                                {r.label}
                            </option>
                        ))}
                    </select>

                    <select
                        style={{
                            ...styles.select,
                            background: theme.card,
                            color: theme.text,
                            borderColor: theme.border,
                        }}
                        value={compare}
                        onChange={(e) => setCompare(e.target.value)}
                    >
                        <option value="">Compare Asset...</option>

                        {safeCoins.length === 0 && (
                            <option disabled value="__none">
                                No assets loaded
                            </option>
                        )}

                        {safeCoins.slice(0, 50).map((c) => (
                            <option
                                key={c.id ?? c.symbol}
                                value={String(c.symbol || "").toLowerCase()}
                            >
                                {String(c.symbol || "").toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chart Section */}
            <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
                <div style={{ height: 400 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke={darkMode ? "#334155" : "#f1f5f9"}
                            />
                            <XAxis dataKey="date" hide />
                            <YAxis
                                domain={["auto", "auto"]}
                                orientation="right"
                                tick={{ fontSize: 11, fill: theme.subText }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: theme.card,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: "10px",
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="close"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fill="url(#colorPrice)"
                            />
                            {compare && (
                                <Area
                                    type="monotone"
                                    dataKey="cmpClose"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    fill="none"
                                    strokeDasharray="5 5"
                                />
                            )}

                            <Brush dataKey="date" height={30} stroke={theme.border} fill={theme.bg} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gauges */}
            <div style={styles.gaugeGrid}>
                <TaGauge title="DAILY" signal={ta?.signal1D} score={ta?.score1D} darkMode={darkMode} />
                <TaGauge title="WEEKLY" signal={ta?.signal1W} score={ta?.score1W} darkMode={darkMode} />
                <TaGauge title="MONTHLY" signal={ta?.signal1M} score={ta?.score1M} darkMode={darkMode} />
            </div>

            {/* Oscillators Table */}
            <div
                style={{
                    ...styles.card,
                    background: theme.card,
                    borderColor: theme.border,
                    padding: 0,
                    marginTop: "30px",
                    overflow: "hidden",
                }}
            >
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}` }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>
                        Technical Oscillators & Market Data
                    </h3>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                        <tr style={{ background: darkMode ? "#1e293b" : "#f8fafc" }}>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>DATE</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>OPEN</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>HIGH</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>LOW</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>CLOSE</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>VOLUME</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>RSI</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>MACD</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>SIGNAL</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>HIST</th>
                            <th style={{ ...styles.th, color: theme.subText, borderBottom: `1px solid ${theme.border}` }}>%K(STOCH)</th>
                        </tr>
                        </thead>

                        <tbody>
                        {chartData.slice(-20).reverse().map((row, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? theme.tableRowEven : "transparent" }}>
                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}` }}>{row.date}</td>
                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}` }}>{(Number(row.open) || 0).toFixed(2)}</td>
                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}` }}>{(Number(row.high) || 0).toFixed(2)}</td>
                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}` }}>{(Number(row.low) || 0).toFixed(2)}</td>
                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}`, fontWeight: "bold" }}>{(Number(row.close) || 0).toFixed(2)}</td>
                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}`, fontSize: "11px" }}>{Number(row.volume || 0).toLocaleString()}</td>

                                <td
                                    style={{
                                        ...styles.td,
                                        borderBottom: `1px solid ${theme.border}`,
                                        color: row.rsi > 70 ? "#ef4444" : row.rsi < 30 ? "#22c55e" : theme.text,
                                    }}
                                >
                                    {row.rsi ? row.rsi.toFixed(2) : "-"}
                                </td>

                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}` }}>
                                    {row.macd ? row.macd.toFixed(4) : "-"}
                                </td>

                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}` }}>
                                    {row.macdSig ? row.macdSig.toFixed(4) : "-"}
                                </td>

                                <td
                                    style={{
                                        ...styles.td,
                                        borderBottom: `1px solid ${theme.border}`,
                                        color: row.macdHist > 0 ? "#22c55e" : "#ef4444",
                                    }}
                                >
                                    {row.macdHist ? row.macdHist.toFixed(4) : "-"}
                                </td>

                                <td style={{ ...styles.td, borderBottom: `1px solid ${theme.border}` }}>
                                    {row.stoch ? row.stoch.toFixed(2) : "-"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: { borderRadius: "20px", border: "1px solid", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
    select: { padding: "8px 12px", borderRadius: "10px", border: "1px solid", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
    gaugeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginTop: "24px" },
    th: { padding: "12px 16px", fontSize: "10px", fontWeight: "800" },
    td: { padding: "12px 16px", fontSize: "13px" },
};
