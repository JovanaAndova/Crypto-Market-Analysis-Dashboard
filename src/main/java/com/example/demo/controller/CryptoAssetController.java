package com.example.demo.controller;

import com.example.demo.model.CryptoAsset;
import com.example.demo.services.CryptoAssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class CryptoAssetController {

    private final CryptoAssetService service;

    public CryptoAssetController(CryptoAssetService service) {
        this.service = service;
    }

    @GetMapping
    public List<CryptoAsset> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CryptoAsset> getById(@PathVariable Long id) {
        CryptoAsset asset = service.getById(id);
        return asset != null ? ResponseEntity.ok(asset) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CryptoAsset> create(@RequestBody CryptoAsset asset) {
        CryptoAsset saved = service.save(asset);
        return ResponseEntity.created(URI.create("/api/assets/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CryptoAsset> update(@PathVariable Long id, @RequestBody CryptoAsset asset) {
        CryptoAsset updated = service.update(id, asset);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
