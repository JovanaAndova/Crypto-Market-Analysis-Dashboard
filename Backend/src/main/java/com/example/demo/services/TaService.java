package com.example.demo.services;

import com.example.demo.model.TaSummary;
import com.example.demo.repository.TaSummaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaService {

    private final TaSummaryRepository repo;

    public TaService(TaSummaryRepository repo) {
        this.repo = repo;
    }

    public List<TaSummary> getAll() {
        return repo.findAll();
    }

    public Optional<TaSummary> getBySymbol(String symbol) {
        return repo.findBySymbolIgnoreCase(symbol);
    }
}
