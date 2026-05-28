package com.example.demo.services;

import com.example.demo.model.CryptoAsset;
import com.example.demo.repository.CryptoAssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CryptoAssetServiceImplementation implements CryptoAssetService {

    private final CryptoAssetRepository cryptoAssetRepository;

    public CryptoAssetServiceImplementation(CryptoAssetRepository cryptoAssetRepository) {
        this.cryptoAssetRepository = cryptoAssetRepository;
    }

    @Override
    public List<CryptoAsset> getAll() {
        return cryptoAssetRepository.findAll();
    }

    @Override
    public CryptoAsset getById(Long id) {
        return cryptoAssetRepository.findById(id).orElse(null);
    }

    @Override
    public CryptoAsset save(CryptoAsset cryptoAsset) {
        return cryptoAssetRepository.save(cryptoAsset);
    }

    @Override
    public CryptoAsset update(Long id, CryptoAsset cryptoAsset) {
        return cryptoAssetRepository.findById(id)
                .map(existing -> {
                    existing.setName(cryptoAsset.getName());
                    existing.setSymbol(cryptoAsset.getSymbol());
                    existing.setCurrentPrice(cryptoAsset.getCurrentPrice());
                    // мора да вратиме CryptoAsset од ламбдата:
                    return cryptoAssetRepository.save(existing);
                })
                .orElse(null);
    }

    @Override
    public boolean delete(Long id) {
        if (cryptoAssetRepository.existsById(id)) {
            cryptoAssetRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
