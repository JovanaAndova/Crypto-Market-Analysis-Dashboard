package com.example.demo.controller;

import com.example.demo.dto.CoinHistoryDto;
import com.example.demo.repository.CoinHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/history")
public class CoinHistoryController {

    private final CoinHistoryRepository historyRepo;

    public CoinHistoryController(CoinHistoryRepository historyRepo) {
        this.historyRepo = historyRepo;
    }

    @GetMapping("/symbol/{symbol}")
    public List<CoinHistoryDto> historyBySymbol(
            @PathVariable String symbol,
            @RequestParam(required = false) Integer days
    ) {
        var list = historyRepo
                .findTop500ByAsset_SymbolOrderByOpenTimeDesc(symbol.toLowerCase());

        if (days != null && days > 0 && days <= 365) {
            var cutoff = Instant.now().minus(Duration.ofDays(days));
            list = list.stream()
                    .filter(h -> h.getOpenTime().isAfter(cutoff))
                    .toList();
        }

        return list.stream()
                .map(h -> new CoinHistoryDto(
                        h.getOpenTime(),
                        h.getOpen(),
                        h.getHigh(),
                        h.getLow(),
                        h.getClose(),
                        h.getVolume()
                ))
                .toList();
    }
}
