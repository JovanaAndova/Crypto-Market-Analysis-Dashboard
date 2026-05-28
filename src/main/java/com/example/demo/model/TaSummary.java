package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ta_summary")   // 👈 DB table name
public class TaSummary {

    @Id
    @Column(name = "coin_id")
    private String coinId;

    @Column(name = "symbol")
    private String symbol;

    @Column(name = "name")
    private String name;

    @Column(name = "signal_1D")
    private String signal1D;

    @Column(name = "score_1D")
    private Double score1D;

    @Column(name = "signal_1W")
    private String signal1W;

    @Column(name = "score_1W")
    private Double score1W;

    @Column(name = "signal_1M")
    private String signal1M;

    @Column(name = "score_1M")
    private Double score1M;

    // --- getters & setters ---

    public String getCoinId() { return coinId; }
    public void setCoinId(String coinId) { this.coinId = coinId; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSignal1D() { return signal1D; }
    public void setSignal1D(String signal1D) { this.signal1D = signal1D; }

    public Double getScore1D() { return score1D; }
    public void setScore1D(Double score1D) { this.score1D = score1D; }

    public String getSignal1W() { return signal1W; }
    public void setSignal1W(String signal1W) { this.signal1W = signal1W; }

    public Double getScore1W() { return score1W; }
    public void setScore1W(Double score1W) { this.score1W = score1W; }

    public String getSignal1M() { return signal1M; }
    public void setSignal1M(String signal1M) { this.signal1M = signal1M; }

    public Double getScore1M() { return score1M; }
    public void setScore1M(Double score1M) { this.score1M = score1M; }
}
