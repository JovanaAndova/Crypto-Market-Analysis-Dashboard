import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function CoinsPage() {
    const [coins, setCoins] = useState([]);
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/api/assets`)
            .then(async (r) => {
                if (!r.ok) throw new Error(`Backend error: ${r.status}`);
                return r.json();
            })
            .then((data) => setCoins(Array.isArray(data) ? data : []))
            .catch((e) => {
                console.error(e);
                setCoins([]);
            });
    }, []);

    const filtered = coins.filter(
        (c) =>
            (c.symbol || "").toLowerCase().includes(q.toLowerCase()) ||
            (c.name || "").toLowerCase().includes(q.toLowerCase())
    );

    return (
        <div style={{ padding: 20 }}>
            <h2>Coins</h2>

            <input
                placeholder="Search coin..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ padding: 10, width: "100%", maxWidth: 420 }}
            />

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                {filtered.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => navigate(`/coin/${c.symbol}`)}
                        style={{
                            padding: 12,
                            textAlign: "left",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            background: "white",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ fontWeight: 700 }}>
                            {c.name}{" "}
                            <span style={{ opacity: 0.6 }}>({c.symbol?.toUpperCase()})</span>
                        </div>
                        <div style={{ opacity: 0.7 }}>
                            Rank: {c.rank ?? "—"} • Price: {c.currentPrice ?? "—"}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
