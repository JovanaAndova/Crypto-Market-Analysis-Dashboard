package com.example.demo.dto;

import java.time.LocalDateTime;

public record TaSummaryDto(
        String coinId,
        String symbol,
        String name,
        String signal1D,
        Double score1D,
        String signal1W,
        Double score1W,
        String signal1M,
        Double score1M,
        LocalDateTime updatedAt
) {}
