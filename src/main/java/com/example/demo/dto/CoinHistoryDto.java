package com.example.demo.dto;

import java.time.Instant;

public record CoinHistoryDto(
        Instant openTime,
        Double open,
        Double high,
        Double low,
        Double close,
        Double volume
) {}
