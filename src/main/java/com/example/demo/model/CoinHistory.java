package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class CoinHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private CryptoAsset asset;

    private Instant openTime;

    private Double open;
    private Double high;
    private Double low;
    private Double close;
    private Double volume;

    // getters & setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CryptoAsset getAsset() { return asset; }
    public void setAsset(CryptoAsset asset) { this.asset = asset; }

    public Instant getOpenTime() { return openTime; }
    public void setOpenTime(Instant openTime) { this.openTime = openTime; }

    public Double getOpen() { return open; }
    public void setOpen(Double open) { this.open = open; }

    public Double getHigh() { return high; }
    public void setHigh(Double high) { this.high = high; }

    public Double getLow() { return low; }
    public void setLow(Double low) { this.low = low; }

    public Double getClose() { return close; }
    public void setClose(Double close) { this.close = close; }

    public Double getVolume() { return volume; }
    public void setVolume(Double volume) { this.volume = volume; }
}
