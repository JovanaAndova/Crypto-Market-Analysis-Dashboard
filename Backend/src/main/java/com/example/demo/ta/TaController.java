package com.example.demo.ta;

import com.example.demo.dto.TaSummaryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/ta")
public class TaController {

    private final TaResultRepository repo;

    public TaController(TaResultRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/summary")
    public List<TaResult> getAll() {
        return repo.findAll();
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<?> getForSymbol(@PathVariable String symbol) {

        List<TaResult> list = repo.findAllBySymbolIgnoreCase(symbol);
        if (list.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("No TA summary for symbol " + symbol.toUpperCase());
        }

        // Ако има повеќе редови, земи го најновиот според updatedAt
        TaResult ta = list.stream()
                .max(Comparator.comparing(TaResult::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(list.get(0));

        TaSummaryDto dto = new TaSummaryDto(
                ta.getCoinId(),
                ta.getSymbol(),
                ta.getName(),
                ta.getSignal1D(),
                ta.getScore1D(),
                ta.getSignal1W(),
                ta.getScore1W(),
                ta.getSignal1M(),
                ta.getScore1M(),
                ta.getUpdatedAt()
        );

        return ResponseEntity.ok(dto);
    }
}
