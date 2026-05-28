package com.example.demo.importing;

public interface CsvImportStrategy {
    String name();

    /**
     * Го извршува import-от само ако табелата/податоците се празни.
     */
    void importIfEmpty();
}
