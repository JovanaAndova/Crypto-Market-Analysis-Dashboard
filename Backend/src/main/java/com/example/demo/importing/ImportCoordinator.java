package com.example.demo.importing;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ImportCoordinator {

    private final List<CsvImportStrategy> strategies;

    // Reads from application.properties:
    // app.import.enabled=${APP_IMPORT_ENABLED:true}
    @Value("${app.import.enabled:true}")
    private boolean importEnabled;

    public ImportCoordinator(List<CsvImportStrategy> strategies) {
        this.strategies = strategies;
    }

    @PostConstruct
    public void run() {
        if (!importEnabled) {
            System.out.println("[ImportCoordinator] Import disabled (app.import.enabled=false). Skipping CSV imports.");
            return;
        }

        System.out.println("[ImportCoordinator] Running CSV import strategies...");

        strategies.forEach(s -> {
            System.out.println("[ImportCoordinator] Strategy: " + s.name());
            s.importIfEmpty();
        });

        System.out.println("[ImportCoordinator] Done.");
    }
}
