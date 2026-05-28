import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardKpiBar from "../components/DashboardKpiBar";
import {
    Search,
    ListFilter,
    Star,
    SearchX,
    ChevronDown,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import { API_BASE } from "../config/api";



const translations = {
    mk: {
        title: "Контролна табла",
        subtitle: "Преглед на пазарот",
        search: "Пребарај...",
        noResults: "Нема пронајдено валути за:",
        favorites: "Омилени",
        th_rank: "# Ранг",
        th_name: "Име",
        th_price: "Цена",
        sort_standard: "Стандардно (Ранг)",
        sort_highest: "Највисока цена",
        sort_lowest: "Најниска цена",
        sort_gain: "Најдобар профит"
    },
    en: {
        title: "Dashboard",
        subtitle: "Market Overview",
        search: "Search...",
        noResults: "No coins found for:",
        favorites: "Favorites",
        th_rank: "# Rank",
        th_name: "Name",
        th_price: "Price",
        sort_standard: "Standard (Rank)",
        sort_highest: "Highest Price",
        sort_lowest: "Lowest Price",
        sort_gain: "Best Gain"
    }
};

export default function Dashboard({ darkMode, lang }) {
    const [coins, setCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("standard");
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favs") || "[]"));
    const [showOnlyFavs, setShowOnlyFavs] = useState(false);

    const navigate = useNavigate();
    const t = translations[lang || "mk"];

    const theme = {
        text: darkMode ? "#6fa0d0" : "#0f172a",
        subText: "#94a3b8",
        card: darkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
        border: darkMode ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
        accent: "#3b82f6",
        positive: "#10b981",
        negative: "#ef4444",
        star: "#f59e0b"
    };

    useEffect(() => {
        // FIXED: Removed the extra /api/all which was causing the 404/filter crash
        fetch(`${API_BASE}/api/assets`)
            .then(r => {
                if (!r.ok) throw new Error("Network response was not ok");
                return r.json();
            })
            .then(data => {
                // Ensure we are setting an array even if the backend fails
                setCoins(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setCoins([]); // Fallback to empty list to prevent .filter crash
            });
    }, []);

    useEffect(() => {
        localStorage.setItem("favs", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFav = (e, id) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const renderPct = (val) => {
        if (val === undefined || val === null || isNaN(val)) return <span style={{ color: theme.subText }}>—</span>;
        const isPos = val >= 0;
        return (
            <div style={{
                color: isPos ? theme.positive : theme.negative,
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px"
            }}>
                {isPos ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                {Math.abs(val).toFixed(2)}%
            </div>
        );
    };

    // FIXED: Added Array.isArray check to prevent the "filter is not a function" error
    const processedCoins = Array.isArray(coins)
        ? coins.filter(c => {
            const name = c.name?.toLowerCase() || "";
            const symbol = c.symbol?.toLowerCase() || "";
            const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                symbol.includes(searchTerm.toLowerCase());
            return showOnlyFavs ? (matchesSearch && favorites.includes(c.id)) : matchesSearch;
        })
            .sort((a, b) => {
                if (sortBy === "highest") return Number(b.currentPrice || 0) - Number(a.currentPrice || 0);
                if (sortBy === "lowest") return Number(a.currentPrice || 0) - Number(b.currentPrice || 0);
                if (sortBy === "gain") return Number(b.percentChange24h || 0) - Number(a.percentChange24h || 0);

                return (a.rank || 0) - (b.rank || 0);
            })
        : [];

    return (
        <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "40px"
            }}>
                <div>
                    <h1 style={{ fontSize: "36px", fontWeight: "800", color: theme.text, margin: 0 }}>{t.title}</h1>
                    <p style={{ color: theme.subText, marginTop: "4px" }}>{t.subtitle}</p>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        background: theme.card,
                        padding: "0 15px",
                        borderRadius: "16px",
                        border: `1px solid ${theme.border}`,
                        position: "relative"
                    }}>
                        <ListFilter size={18} color={theme.subText} style={{ marginRight: "10px" }} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: theme.text,
                                outline: "none",
                                fontSize: "14px",
                                fontWeight: "600",
                                appearance: "none",
                                padding: "12px 30px 12px 0",
                                cursor: "pointer",
                                zIndex: 2
                            }}
                        >
                            <option value="standard">{t.sort_standard}</option>
                            <option value="highest">{t.sort_highest}</option>
                            <option value="lowest">{t.sort_lowest}</option>
                            <option value="gain">{t.sort_gain}</option>
                        </select>
                        <ChevronDown size={14} color={theme.subText} style={{ position: "absolute", right: "15px", pointerEvents: "none" }} />
                    </div>

                    <button
                        onClick={() => setShowOnlyFavs(!showOnlyFavs)}
                        style={{
                            background: showOnlyFavs ? theme.star + "20" : theme.card,
                            border: `1px solid ${showOnlyFavs ? theme.star : theme.border}`,
                            color: showOnlyFavs ? theme.star : theme.text,
                            padding: "10px 15px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <Star size={18} fill={showOnlyFavs ? theme.star : "none"} /> {t.favorites}
                    </button>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        background: theme.card,
                        padding: "12px 20px",
                        borderRadius: "16px",
                        border: `1px solid ${theme.border}`,
                        width: "220px"
                    }}>
                        <Search size={20} color={theme.subText} style={{ marginRight: "12px" }} />
                        <input
                            placeholder={t.search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: "none", border: "none", color: theme.text, outline: "none", width: "100%" }}
                        />
                    </div>
                </div>
            </header>

            <DashboardKpiBar darkMode={darkMode} lang={lang} />

            <div style={{
                background: theme.card,
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                overflow: "hidden"
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{
                        color: theme.subText,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        textAlign: "left",
                        background: darkMode ? "rgba(0,0,0,0.2)" : "#f8fafc"
                    }}>
                        <th style={{ padding: "20px 32px" }}>{t.th_rank}</th>
                        <th>{t.th_name}</th>
                        <th style={{ textAlign: "right" }}>{t.th_price}</th>
                        <th style={{ textAlign: "right" }}>1h %</th>
                        <th style={{ textAlign: "right" }}>24h %</th>
                        <th style={{ textAlign: "right", paddingRight: "32px" }}>7d %</th>
                    </tr>
                    </thead>
                    <tbody>
                    {processedCoins.length > 0 ? (
                        processedCoins.map((coin) => (
                            <tr
                                key={coin.id}
                                onClick={() => navigate(`/coin/${coin.symbol?.toLowerCase()}`)}
                                style={{ borderTop: `1px solid ${theme.border}`, cursor: "pointer" }}
                            >
                                <td style={{ padding: "20px 32px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <Star
                                            size={16}
                                            onClick={(e) => toggleFav(e, coin.id)}
                                            fill={favorites.includes(coin.id) ? theme.star : "none"}
                                            color={favorites.includes(coin.id) ? theme.star : theme.subText}
                                        />
                                        <span style={{ fontWeight: "600", color: theme.subText }}>{coin.rank}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: "700", color: theme.text }}>
                                        {coin.name}
                                        <span style={{ color: theme.subText, fontSize: "12px", marginLeft: "8px" }}>
                                                {coin.symbol?.toUpperCase()}
                                            </span>
                                    </div>
                                </td>
                                <td style={{ textAlign: "right", fontWeight: "700", color: theme.text }}>
                                    ${Number(coin.currentPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ textAlign: "right" }}>{renderPct(coin.percentChange1h)}</td>
                                <td style={{ textAlign: "right" }}>{renderPct(coin.percentChange24h)}</td>
                                <td style={{ textAlign: "right", paddingRight: "32px" }}>{renderPct(coin.percentChange7d)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: "100px 0", textAlign: "center" }}>
                                <SearchX size={48} color={theme.subText} style={{ marginBottom: "16px", opacity: 0.5 }} />
                                <div style={{ color: theme.text, fontSize: "18px", fontWeight: "600" }}>{t.noResults}</div>
                                <div style={{ color: theme.subText }}>"{searchTerm}"</div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}