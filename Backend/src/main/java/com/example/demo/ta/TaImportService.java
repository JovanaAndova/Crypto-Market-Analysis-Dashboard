package com.example.demo.ta;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
public class TaImportService {

    private final TaResultRepository repo;

    public TaImportService(TaResultRepository repo) {
        this.repo = repo;
    }

    /**
     * Reads CSV like:
     * coin_id,signal_1D,score_1D,signal_1W,score_1W,signal_1M,score_1M,symbol,name
     */
    public void importFromClasspathCsv(String classpathFile) {
        try {
            var resource = new ClassPathResource(classpathFile);
            if (!resource.exists()) {
                throw new IllegalArgumentException("CSV not found on classpath: " + classpathFile);
            }

            try (var br = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

                String header = br.readLine(); // skip header
                if (header == null) return;

                LocalDateTime now = LocalDateTime.now();
                String line;

                while ((line = br.readLine()) != null) {
                    if (line.isBlank()) continue;

                    // fields don't contain commas, so this is safe
                    String[] p = line.split(",", -1);
                    if (p.length < 9) continue;

                    String coinId   = p[0].trim();
                    if (coinId.isEmpty()) continue;

                    String signal1D = p[1].trim();
                    double score1D  = parseDoubleSafe(p[2]);

                    String signal1W = p[3].trim();
                    double score1W  = parseDoubleSafe(p[4]);

                    String signal1M = p[5].trim();
                    double score1M  = parseDoubleSafe(p[6]);

                    String symbol   = p[7].trim();
                    String name     = p[8].trim();

                    TaResult e = repo.findByCoinId(coinId).orElseGet(TaResult::new);

                    e.setCoinId(coinId);
                    e.setSymbol(symbol);
                    e.setName(name);

                    e.setSignal1D(signal1D);
                    e.setScore1D(score1D);

                    e.setSignal1W(signal1W);
                    e.setScore1W(score1W);

                    e.setSignal1M(signal1M);
                    e.setScore1M(score1M);

                    e.setUpdatedAt(now);

                    repo.save(e);
                }
            }
        } catch (Exception ex) {
            throw new RuntimeException("CSV import failed: " + classpathFile + " -> " + ex.getMessage(), ex);
        }
    }

    private double parseDoubleSafe(String s) {
        if (s == null || s.isBlank()) return 0.0;
        try {
            return Double.parseDouble(s.trim());
        } catch (Exception e) {
            return 0.0;
        }
    }
}
