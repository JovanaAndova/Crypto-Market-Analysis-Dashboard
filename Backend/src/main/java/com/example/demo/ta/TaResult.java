package com.example.demo.ta;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ta_results")
public class TaResult {

    // We store by CoinGecko coin id (e.g. "bitcoin")
    @Id
    @Column(name = "coin_id", length = 100)
    private String coinId;

    @Column(length = 20)
    private String symbol;   // BTC

    @Column(length = 120)
    private String name;     // Bitcoin

    // ---- 1D ----
    @Column(name = "signal_1d")
    private String signal1D;

    @Column(name = "score_1d")
    private Double score1D;

    // ---- 1W ----
    @Column(name = "signal_1w")
    private String signal1W;

    @Column(name = "score_1w")
    private Double score1W;

    // ---- 1M ----
    @Column(name = "signal_1m")
    private String signal1M;

    @Column(name = "score_1m")
    private Double score1M;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TaResult() {}

    // ---------------- Getters + Setters ----------------

    public String getCoinId() {
        return coinId;
    }

    public void setCoinId(String coinId) {
        this.coinId = coinId;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol != null ? symbol.toUpperCase() : null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSignal1D() {
        return signal1D;
    }

    public void setSignal1D(String signal1D) {
        this.signal1D = signal1D;
    }

    public Double getScore1D() {
        return score1D;
    }

    public void setScore1D(Double score1D) {
        this.score1D = score1D;
    }

    public String getSignal1W() {
        return signal1W;
    }

    public void setSignal1W(String signal1W) {
        this.signal1W = signal1W;
    }

    public Double getScore1W() {
        return score1W;
    }

    public void setScore1W(Double score1W) {
        this.score1W = score1W;
    }

    public String getSignal1M() {
        return signal1M;
    }

    public void setSignal1M(String signal1M) {
        this.signal1M = signal1M;
    }

    public Double getScore1M() {
        return score1M;
    }

    public void setScore1M(Double score1M) {
        this.score1M = score1M;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
