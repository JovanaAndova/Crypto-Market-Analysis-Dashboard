package com.example.demo.controller;

import com.example.demo.repository.CoinHistoryRepository;
import com.example.demo.repository.CryptoAssetRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final CryptoAssetRepository assetRepo;
    private final CoinHistoryRepository historyRepo;

    public StatsController(CryptoAssetRepository assetRepo, CoinHistoryRepository historyRepo) {
        this.assetRepo = assetRepo;
        this.historyRepo = historyRepo;
    }

    @GetMapping("/counts")
    public Map<String, Long> counts() {
        return Map.of(
                "assets", assetRepo.count(),
                "history", historyRepo.count()
        );
    }
}
