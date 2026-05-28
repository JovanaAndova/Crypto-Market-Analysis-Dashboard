package com.example.demo.repository;

import com.example.demo.model.TaSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaSummaryRepository extends JpaRepository<TaSummary, String> {

    Optional<TaSummary> findBySymbolIgnoreCase(String symbol);
}
