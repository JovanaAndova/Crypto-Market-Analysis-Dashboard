import React from "react";
import {
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    PieChart
} from "lucide-react";

const translations = {
    mk: {
        title: "Извештаи за портфолио",
        subtitle: "Детален преглед на вашите инвестиции",
        netWorth: "Вкупна вредност",
        monthlyChange: "Месечна промена",
        bestAsset: "Најдобар асет",
        worstAsset: "Најслаб асет",
        history: "Историја на трансакции",
        download: "Преземи PDF",
        assetName: "Име на валута",
        allocation: "Алокација",
        profit: "Профит/Загуба"
    },
    en: {
        title: "Portfolio Reports",
        subtitle: "Detailed overview of your investments",
        netWorth: "Total Net Worth",
        monthlyChange: "Monthly Change",
        bestAsset: "Best Performer",
        worstAsset: "Worst Performer",
        history: "Transaction History",
        download: "Download PDF",
        assetName: "Asset Name",
        allocation: "Allocation",
        profit: "Profit/Loss"
    }
};

// PLACEHOLDER DATA: Change these values to update the UI
const dummyData = {
    totalValue: 125480.00,
    monthlyChangePct: +12.5,
    bestCoin: { name: "Solana", symbol: "SOL", gain: "+45.2%" },
    worstCoin: { name: "Ethereum", symbol: "ETH", gain: "-2.4%" },
    assets: [
        { name: "Bitcoin", symbol: "BTC", amount: "0.5", value: "44200", allocation: "35%" },
        { name: "Ethereum", symbol: "ETH", amount: "12.4", value: "38500", allocation: "30%" },
        { name: "Solana", symbol: "SOL", amount: "150", value: "28000", allocation: "22%" },
        { name: "Chainlink", symbol: "LINK", amount: "500", value: "14780", allocation: "13%" },
    ]
};

export default function Reports({ darkMode, lang }) {
    const t = translations[lang || "mk"];

    const theme = {
        text: darkMode ? "#f8fafc" : "#0f172a",
        subText: "#94a3b8",
        card: darkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
        border: darkMode ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
        accent: "#3b82f6",
        positive: "#10b981",
        negative: "#ef4444"
    };

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                <div>
                    <h1 style={{ fontSize: "32px", fontWeight: "800", color: theme.text, margin: 0 }}>{t.title}</h1>
                    <p style={{ color: theme.subText, marginTop: "4px" }}>{t.subtitle}</p>
                </div>
                <button style={{
                    background: theme.accent, color: "white", border: "none", padding: "12px 24px",
                    borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600"
                }}>
                    <Download size={18} /> {t.download}
                </button>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" }}>
                <ReportKpi label={t.netWorth} value={`$${dummyData.totalValue.toLocaleString()}`} icon={PieChart} theme={theme} />
                <ReportKpi label={t.monthlyChange} value={`${dummyData.monthlyChangePct}%`} color={theme.positive} icon={TrendingUp} theme={theme} />
                <ReportKpi label={t.bestAsset} value={dummyData.bestCoin.name} subValue={dummyData.bestCoin.gain} color={theme.positive} icon={ArrowUpRight} theme={theme} />
                <ReportKpi label={t.worstAsset} value={dummyData.worstCoin.name} subValue={dummyData.worstCoin.gain} color={theme.negative} icon={ArrowDownRight} theme={theme} />
            </div>

            {/* Chart & Table Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>

                {/* Visual Chart Placeholder */}
                <div style={{ background: theme.card, borderRadius: "24px", border: `1px solid ${theme.border}`, padding: "32px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                        <h3 style={{ color: theme.text, margin: 0 }}>{t.monthlyChange}</h3>
                        <div style={{ color: theme.subText, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Calendar size={16} /> Last 30 Days
                        </div>
                    </div>
                    {/* SVG Line Chart Placeholder */}
                    <div style={{ width: "100%", height: "250px", display: "flex", alignItems: "flex-end", gap: "10px" }}>
                        {[40, 70, 45, 90, 65, 80, 95, 70, 100].map((h, i) => (
                            <div key={i} style={{ flex: 1, background: `linear-gradient(to top, ${theme.accent}20, ${theme.accent})`, height: `${h}%`, borderRadius: "4px 4px 0 0" }} />
                        ))}
                    </div>
                </div>

                {/* Allocation Table */}
                <div style={{ background: theme.card, borderRadius: "24px", border: `1px solid ${theme.border}`, padding: "32px" }}>
                    <h3 style={{ color: theme.text, marginBottom: "24px", marginTop: 0 }}>{t.allocation}</h3>
                    {dummyData.assets.map((asset, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: i === 0 ? "none" : `1px solid ${theme.border}` }}>
                            <div>
                                <div style={{ color: theme.text, fontWeight: "700" }}>{asset.name}</div>
                                <div style={{ color: theme.subText, fontSize: "12px" }}>{asset.symbol}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ color: theme.text, fontWeight: "700" }}>{asset.allocation}</div>
                                <div style={{ color: theme.subText, fontSize: "12px" }}>${asset.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

// Small helper component for the KPI boxes
function ReportKpi({ label, value, subValue, color, icon: Icon, theme }) {
    return (
        <div style={{ background: theme.card, padding: "24px", borderRadius: "24px", border: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: theme.subText, fontSize: "12px", fontWeight: "800" }}>{label}</span>
                <Icon size={18} color={color || theme.accent} />
            </div>
            <div style={{ color: theme.text, fontSize: "24px", fontWeight: "800" }}>{value}</div>
            {subValue && <div style={{ color: color, fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>{subValue}</div>}
        </div>
    );
}