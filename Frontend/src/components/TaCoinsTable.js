// src/components/TaCoinsTable.js
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config/api";

function badgeStyle(signal) {
    switch (signal) {
        case "BUY":
            return { bg: "rgba(22, 163, 74, 0.12)", fg: "#15803d", border: "1px solid rgba(22, 163, 74, 0.2)" };
        case "SELL":
            return { bg: "rgba(220, 38, 38, 0.08)", fg: "#b91c1c", border: "1px solid rgba(220, 38, 38, 0.25)" };
        case "HOLD":
        default:
            return { bg: "rgba(31, 41, 55, 0.04)", fg: "#111827", border: "1px solid rgba(156, 163, 175, 0.4)" };
    }
}

function SignalBadge({ signal }) {
    const { bg, fg, border } = badgeStyle(signal);
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 54,
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                background: bg,
                color: fg,
                border,
            }}
        >
            {signal || "N/A"}
        </span>
    );
}

export default function TaCoinsTable() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        fetch(`${API_BASE}/api/ta/summary`)
            .then((res) => {
                if (!res.ok) throw new Error(`Backend error: ${res.status}`);
                return res.json();
            })
            .then((data) => setRows(Array.isArray(data) ? data : []))
            .catch((e) => {
                console.error(e);
                setError(e.message || "Failed to load TA summary");
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        if (!query.trim()) return rows;
        const q = query.toLowerCase();
        return rows.filter(
            (r) =>
                r.symbol?.toLowerCase().includes(q) ||
                r.name?.toLowerCase().includes(q)
        );
    }, [rows, query]);

    if (loading) return <div>Loading technical analysis…</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            {/* table rendering stays unchanged */}
        </div>
    );
}
