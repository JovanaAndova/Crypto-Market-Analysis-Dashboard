package com.example.demo.importing;

import com.example.demo.ta.TaImportService;
import com.example.demo.ta.TaResultRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3)
public class TaCsvImportStrategy implements CsvImportStrategy {

    private final TaResultRepository repo;
    private final TaImportService importer;

    @Value("${ta.summary.file:data/TA_top_1000_summary.csv}")
    private String taSummaryFile;

    public TaCsvImportStrategy(TaResultRepository repo, TaImportService importer) {
        this.repo = repo;
        this.importer = importer;
    }

    @Override
    public String name() {
        return "TA CSV Import (" + taSummaryFile + ")";
    }

    @Override
    public void importIfEmpty() {
        if (repo.count() > 0) {
            System.out.println("[TaImport] TA already exists, skipping.");
            return;
        }
        importer.importFromClasspathCsv(taSummaryFile);
        System.out.println("[TaImport] TA imported.");
    }
}
