package com.example.demo.importing;

import com.example.demo.model.CryptoAsset;
import com.example.demo.repository.CryptoAssetRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
@Order(1)
public class AssetsCsvImportStrategy implements CsvImportStrategy {

    private final CryptoAssetRepository assetRepo;

    @Value("${assets.csv.file:top_1000_coins.csv}")
    private String assetsCsvFile;

    private static final int MAX_ASSETS = 1000;

    public AssetsCsvImportStrategy(CryptoAssetRepository assetRepo) {
        this.assetRepo = assetRepo;
    }

    @Override
    public String name() {
        return "Assets CSV Import (" + assetsCsvFile + ")";
    }

    @Override
    public void importIfEmpty() {
        if (assetRepo.count() > 0) {
            System.out.println("[AssetsImport] Assets already exist, skipping.");
            return;
        }

        try {
            var res = new ClassPathResource(assetsCsvFile);
            try (var reader = new BufferedReader(new InputStreamReader(res.getInputStream(), StandardCharsets.UTF_8))) {

                CSVParser parser = CSVFormat.DEFAULT.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .setTrim(true)
                        .build()
                        .parse(reader);

                List<CryptoAsset> batch = new ArrayList<>(MAX_ASSETS);
                int count = 0;

                for (CSVRecord r : parser) {
                    if (count >= MAX_ASSETS) break;

                    String coinId = safe(r, "id");
                    if (coinId.isBlank()) continue;

                    CryptoAsset a = new CryptoAsset();
                    a.setCoinId(coinId);
                    a.setSymbol(safe(r, "symbol").toLowerCase(Locale.ROOT));
                    a.setName(safe(r, "name"));
                    a.setRank(parseIntOrNull(safe(r, "market_cap_rank")));
                    a.setCurrentPrice(parseBigDecimalOrZero(safe(r, "current_price")));

                    batch.add(a);
                    count++;
                }

                assetRepo.saveAll(batch);
                System.out.println("[AssetsImport] Imported assets: " + batch.size());
            }
        } catch (Exception e) {
            throw new RuntimeException("Assets CSV import failed: " + e.getMessage(), e);
        }
    }

    private static String safe(CSVRecord r, String col) {
        try {
            String v = r.get(col);
            return v == null ? "" : v.trim();
        } catch (Exception e) {
            return "";
        }
    }

    private static BigDecimal parseBigDecimalOrZero(String s) {
        if (s == null || s.isBlank()) return BigDecimal.ZERO;
        try { return new BigDecimal(s.trim()); }
        catch (Exception e) { return BigDecimal.ZERO; }
    }

    private static Integer parseIntOrNull(String s) {
        if (s == null || s.isBlank()) return null;
        try { return Integer.parseInt(s.trim()); }
        catch (Exception e) { return null; }
    }
}
