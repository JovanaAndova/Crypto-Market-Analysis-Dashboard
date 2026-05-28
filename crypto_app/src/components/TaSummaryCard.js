// src/components/TaSummaryCard.js
import React from "react";
import TaGauge from "./TaGauge";

export default function TaSummaryCard({ ta }) {
    if (!ta) {
        return <div>Technical Analysis: loading…</div>;
    }

    return (
        <div style={{ marginTop: 24 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                }}
            >
                <h3 style={{ margin: 0 }}>Technical Analysis</h3>
                {ta.updatedAt && (
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
            Updated: {ta.updatedAt}
          </span>
                )}
            </div>

            {/* 3 gauges in a row (1D, 1W, 1M) */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 16,
                }}
            >
                <TaGauge
                    title="1 Day"
                    signal={ta.signal1D}
                    score={ta.score1D}
                />
                <TaGauge
                    title="1 Week"
                    signal={ta.signal1W}
                    score={ta.score1W}
                />
                <TaGauge
                    title="1 Month"
                    signal={ta.signal1M}
                    score={ta.score1M}
                />
            </div>
        </div>
    );
}
