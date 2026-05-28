package com.example.demo.services;

import com.example.demo.model.CryptoAsset;
import java.util.List;

public interface CryptoAssetService {

    List<CryptoAsset> getAll();

    CryptoAsset getById(Long id);

    CryptoAsset save(CryptoAsset cryptoAsset);  // ➕ додадено

    CryptoAsset update(Long id, CryptoAsset cryptoAsset);  // ➕ додадено

    boolean delete(Long id);  // ➕ додадено
}
