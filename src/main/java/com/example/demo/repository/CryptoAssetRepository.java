package com.example.demo.repository;

import com.example.demo.model.CryptoAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CryptoAssetRepository extends JpaRepository<CryptoAsset, Long> {
    Optional<CryptoAsset> findByCoinId(String coinId);
    Optional<CryptoAsset> findBySymbol(String symbol);
}
