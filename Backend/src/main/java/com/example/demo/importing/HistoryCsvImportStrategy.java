package com.example.demo.importing;

import com.example.demo.model.CoinHistory;
import com.example.demo.model.CryptoAsset;
import com.example.demo.repository.CoinHistoryRepository;
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
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Component
@Order(2)
public class HistoryCsvImportStrategy implements CsvImportStrategy {

    private final CryptoAssetRepository assetRepo;
    private final CoinHistoryRepository historyRepo;

    @Value("${history.csv.file:coin_details.csv}")
    private String historyCsvFile;

    private static final int HISTORY_BATCH = 10_000;

    public HistoryCsvImportStrategy(CryptoAssetRepository assetRepo, CoinHistoryRepository historyRepo) {
        this.assetRepo = assetRepo;
        this.historyRepo = historyRepo;
    }

    @Override
    public String name() {
        return "History CSV Import (" + historyCsvFile + ")";
    }

    @Override
    public void importIfEmpty() {
        if (historyRepo.count() > 0) {
            System.out.println("[HistoryImport] History already exists, skipping.");
            return;
        }

        Map<String, CryptoAsset> assetsBySymbol = new HashMap<>();
        for (CryptoAsset a : assetRepo.findAll()) {
            if (a.getSymbol() != null) {
                assetsBySymbol.put(a.getSymbol().trim().toLowerCase(Locale.ROOT), a);
            }
        }

        try {
            var res = new ClassPathResource(historyCsvFile);
            try (var reader = new BufferedReader(new InputStreamReader(res.getInputStream(), StandardCharsets.UTF_8))) {

                CSVParser parser = CSVFormat.DEFAULT.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .setTrim(true)
                        .build()
                        .parse(reader);

                List<CoinHistory> buffer = new ArrayList<>(HISTORY_BATCH);
                Set<Long> seen = new HashSet<>(900_000);

                long rows = 0, inserted = 0, skipped = 0;

                for (CSVRecord r : parser) {
                    rows++;

                    String baseSymbol = safe(r, "base_symbol").toLowerCase(Locale.ROOT);
                    CryptoAsset asset = assetsBySymbol.get(baseSymbol);
                    if (asset == null) { skipped++; continue; }

                    String openTimeStr = safe(r, "open_time");
                    if (openTimeStr.isBlank()) { skipped++; continue; }

                    OffsetDateTime odt = OffsetDateTime.parse(openTimeStr.replace(" ", "T"));

                    CoinHistory h = new CoinHistory();
                    h.setAsset(asset);
                    h.setOpenTime(odt.toInstant());

                    long assetId = asset.getId();
                    long epochDay = h.getOpenTime().atZone(ZoneOffset.UTC).toLocalDate().toEpochDay();
                    long key = (assetId << 32) ^ (epochDay & 0xffffffffL);

                    if (!seen.add(key)) { skipped++; continue; }

                    h.setOpen(parseDoubleOrNull(safe(r, "open")));
                    h.setHigh(parseDoubleOrNull(safe(r, "high")));
                    h.setLow(parseDoubleOrNull(safe(r, "low")));
                    h.setClose(parseDoubleOrNull(safe(r, "close")));
                    h.setVolume(parseDoubleOrNull(safe(r, "volume")));

                    buffer.add(h);
                    inserted++;

                    if (buffer.size() >= HISTORY_BATCH) {
                        historyRepo.saveAll(buffer);
                        buffer.clear();
                        System.out.println("[HistoryImport] progress: rows=" + rows + " inserted=" + inserted + " skipped=" + skipped);
                    }
                }

                if (!buffer.isEmpty()) {
                    historyRepo.saveAll(buffer);
                }

                System.out.println("[HistoryImport] Done. rows=" + rows + " inserted=" + inserted + " skipped=" + skipped);
            }
        } catch (Exception e) {
            throw new RuntimeException("History CSV import failed: " + e.getMessage(), e);
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

    private static Double parseDoubleOrNull(String s) {
        if (s == null || s.isBlank()) return null;
        try { return Double.parseDouble(s.trim()); }
        catch (Exception e) { return null; }
    }
}
