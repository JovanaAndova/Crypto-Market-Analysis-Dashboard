import React, { useState } from "react";
import {
    Key,
    Eye,
    EyeOff,
    Copy,
    Smartphone,
    Bell,
    Lock
} from "lucide-react";

const translations = {
    mk: {
        title: "Поставки",
        tabSecurity: "Безбедност",
        tabGeneral: "Општо",
        apiTitle: "API Клучеви",
        apiDesc: "Користете ги овие клучеви за поврзување со надворешни ботови.",
        tfaTitle: "2-Факторска Автентикација",
        tfaDesc: "Додадете дополнителен слој на безбедност на вашата сметка.",
        notifyTitle: "Известувања",
        save: "Зачувај промени",
        reveal: "Прикажи",
        hide: "Сокриј"
    },
    en: {
        title: "Settings",
        tabSecurity: "Security",
        tabGeneral: "General",
        apiTitle: "API Keys",
        apiDesc: "Use these keys to connect your account to external trading bots.",
        tfaTitle: "Two-Factor Auth (2FA)",
        tfaDesc: "Add an extra layer of security to your account.",
        notifyTitle: "Notifications",
        save: "Save Changes",
        reveal: "Reveal",
        hide: "Hide"
    }
};

export default function Settings({ darkMode, lang }) {
    const [activeTab, setActiveTab] = useState("security");
    const [showApiKey, setShowApiKey] = useState(false);

    // --- TOGGLE STATES ---
    const [tfaEnabled, setTfaEnabled] = useState(true);
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);
    const [priceAlerts, setPriceAlerts] = useState(true);

    const t = translations[lang || "mk"];

    const theme = {
        text: darkMode ? "#f8fafc" : "#0f172a",
        subText: "#94a3b8",
        card: darkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
        border: darkMode ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
        accent: "#3b82f6",
        input: darkMode ? "rgba(0,0,0,0.2)" : "#f1f5f9",
        success: "#10b981"
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: theme.text, marginBottom: "32px" }}>{t.title}</h1>

            {/* Tab Navigation */}
            <div style={{ display: "flex", gap: "32px", marginBottom: "32px", borderBottom: `1px solid ${theme.border}` }}>
                {["security", "general"].map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: "12px 8px",
                            cursor: "pointer",
                            color: activeTab === tab ? theme.accent : theme.subText,
                            fontWeight: "700",
                            borderBottom: activeTab === tab ? `3px solid ${theme.accent}` : "3px solid transparent",
                            transition: "0.2s",
                            textTransform: "capitalize"
                        }}
                    >
                        {tab === "security" ? t.tabSecurity : t.tabGeneral}
                    </div>
                ))}
            </div>

            {activeTab === "security" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                    {/* 2FA Section */}
                    <div style={{ background: theme.card, padding: "32px", borderRadius: "24px", border: `1px solid ${theme.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <div style={{ padding: "12px", background: `${theme.accent}15`, borderRadius: "12px", color: theme.accent }}>
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h3 style={{ color: theme.text, margin: "0 0 4px 0" }}>{t.tfaTitle}</h3>
                                    <p style={{ color: theme.subText, margin: 0, fontSize: "14px" }}>{t.tfaDesc}</p>
                                </div>
                            </div>
                            {/* Functional 2FA Toggle */}
                            <ToggleSwitch isOn={tfaEnabled} handleToggle={() => setTfaEnabled(!tfaEnabled)} theme={theme} />
                        </div>
                    </div>

                    {/* API Key Management */}
                    <div style={{ background: theme.card, padding: "32px", borderRadius: "24px", border: `1px solid ${theme.border}` }}>
                        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                            <div style={{ padding: "12px", background: `${theme.accent}15`, borderRadius: "12px", color: theme.accent }}>
                                <Key size={24} />
                            </div>
                            <div>
                                <h3 style={{ color: theme.text, margin: "0 0 4px 0" }}>{t.apiTitle}</h3>
                                <p style={{ color: theme.subText, margin: 0, fontSize: "14px" }}>{t.apiDesc}</p>
                            </div>
                        </div>

                        <div style={{
                            background: theme.input, padding: "16px", borderRadius: "12px",
                            display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${theme.border}`
                        }}>
                            <code style={{ color: theme.text, fontSize: "14px", letterSpacing: "1px" }}>
                                {showApiKey ? "pk_live_51Msz92Kls0293XvAz81..." : "••••••••••••••••••••••••••••••••"}
                            </code>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                                >
                                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />} {showApiKey ? t.hide : t.reveal}
                                </button>
                                <Copy size={16} color={theme.subText} style={{ cursor: "pointer" }} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* General Tab Content */
                <div style={{ background: theme.card, padding: "32px", borderRadius: "24px", border: `1px solid ${theme.border}` }}>
                    <h3 style={{ color: theme.text, marginTop: 0, marginBottom: "24px" }}>{t.notifyTitle}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <ToggleRow label="Email Notifications" isOn={emailNotif} handleToggle={() => setEmailNotif(!emailNotif)} theme={theme} />
                        <ToggleRow label="Push Notifications" isOn={pushNotif} handleToggle={() => setPushNotif(!pushNotif)} theme={theme} />
                        <ToggleRow label="Price Alerts" isOn={priceAlerts} handleToggle={() => setPriceAlerts(!priceAlerts)} theme={theme} />
                    </div>
                    <button style={{
                        marginTop: "40px", background: theme.accent, color: "white", border: "none",
                        padding: "16px 24px", borderRadius: "16px", fontWeight: "700", cursor: "pointer", width: "100%",
                        boxShadow: `0 4px 15px ${theme.accent}30`
                    }}>
                        {t.save}
                    </button>
                </div>
            )}
        </div>
    );
}

// --- REUSABLE TOGGLE COMPONENTS ---

function ToggleRow({ label, isOn, handleToggle, theme }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: theme.text, fontWeight: "600" }}>{label}</span>
            <ToggleSwitch isOn={isOn} handleToggle={handleToggle} theme={theme} />
        </div>
    );
}

function ToggleSwitch({ isOn, handleToggle, theme }) {
    return (
        <div
            onClick={handleToggle}
            style={{
                width: "50px",
                height: "26px",
                background: isOn ? theme.accent : (theme.darkMode ? "rgba(255,255,255,0.1)" : "#cbd5e1"),
                borderRadius: "20px",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                padding: "0 4px"
            }}
        >
            <div style={{
                width: "18px",
                height: "18px",
                background: "white",
                borderRadius: "50%",
                position: "absolute",
                left: isOn ? "28px" : "4px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }} />
        </div>
    );
}