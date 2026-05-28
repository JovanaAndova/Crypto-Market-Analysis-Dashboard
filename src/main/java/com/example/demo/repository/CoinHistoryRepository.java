package com.example.demo.repository;

import com.example.demo.model.CoinHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface CoinHistoryRepository extends JpaRepository<CoinHistory, Long> {
    List<CoinHistory> findTop500ByAsset_CoinIdOrderByOpenTimeDesc(String coinId);
    List<CoinHistory> findTop500ByAsset_SymbolOrderByOpenTimeDesc(String symbol);
    List<CoinHistory> findByAsset_CoinIdAndOpenTimeBetweenOrderByOpenTimeAsc(String coinId, Instant from, Instant to);
}
