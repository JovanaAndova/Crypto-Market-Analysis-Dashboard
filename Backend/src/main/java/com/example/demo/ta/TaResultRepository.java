package com.example.demo.ta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaResultRepository extends JpaRepository<TaResult, String> {

    Optional<TaResult> findByCoinId(String coinId);

    // was Optional<TaResult> findBySymbolIgnoreCase(...)
    List<TaResult> findAllBySymbolIgnoreCase(String symbol);
}
