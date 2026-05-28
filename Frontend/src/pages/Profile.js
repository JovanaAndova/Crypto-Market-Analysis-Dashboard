import React from "react";
import {
    User,
    ShieldCheck,
    Zap,
    LogOut,
    Users,
    Mail,
    Globe,
    ChevronRight,
    BadgeCheck
} from "lucide-react";

const translations = {
    mk: {
        title: "Кориснички Профил",
        accountStatus: "Статус на сметка",
        verified: "Верификуван",
        proMember: "PRO Член",
        personalInfo: "Лични информации",
        actions: "Акции на сметка",
        logout: "Одјави се",
        switchAcc: "Промени сметка",
        referral: "Реферален код",
        securityLevel: "Ниво на безбедност",
        email: "Е-пошта",
        country: "Држава"
    },
    en: {
        title: "User Profile",
        accountStatus: "Account Status",
        verified: "Verified",
        proMember: "PRO Member",
        personalInfo: "Personal Information",
        actions: "Account Actions",
        logout: "Log Out",
        switchAcc: "Switch Account",
        referral: "Referral Code",
        securityLevel: "Security Level",
        email: "Email Address",
        country: "Country"
    }
};

export default function Profile({ darkMode, lang }) {
    const t = translations[lang || "mk"];

    const theme = {
        text: darkMode ? "#f8fafc" : "#0f172a",
        subText: "#94a3b8",
        card: darkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
        border: darkMode ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
        accent: "#3b82f6",
        gold: "#edbb32",
        danger: "#ef4444",
        success: "#10b981"
    };

    const user = {
        name: "John Doe",
        email: "j.doe@cryptopro.com",
        country: "North Macedonia",
        referralCode: "CRYPTO-99-PRO",
        joinDate: "Jan 2024",
        kycLevel: 2
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: theme.text, marginBottom: "32px" }}>{t.title}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "32px" }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{
                        background: theme.card,
                        padding: "40px",
                        borderRadius: "32px",
                        border: `1px solid ${theme.border}`,
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, ${theme.accent}, ${theme.gold})` }} />

                        <div style={{
                            width: "100px", height: "100px", borderRadius: "35px", background: `linear-gradient(135deg, ${theme.accent}, #60a5fa)`,
                            margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "white", fontWeight: "800",
                            boxShadow: `0 10px 25px ${theme.accent}40`
                        }}>
                            JD
                        </div>
                        <h2 style={{ color: theme.text, margin: "0 0 8px 0", fontSize: "24px" }}>{user.name}</h2>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: theme.success, fontWeight: "700", fontSize: "14px" }}>
                            <BadgeCheck size={16} /> {t.verified}
                        </div>
                    </div>

                    <div style={{ background: `linear-gradient(135deg, ${theme.card}, ${theme.accent}10)`, padding: "24px", borderRadius: "24px", border: `1px solid ${theme.accent}30` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                            <Zap size={20} color={theme.gold} fill={theme.gold} />
                            <span style={{ color: theme.text, fontWeight: "800" }}>{t.proMember}</span>
                        </div>
                        <p style={{ color: theme.subText, fontSize: "13px", margin: 0 }}>Renews on Dec 12, 2026</p>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                    {/* Personal Info Box */}
                    <div style={{ background: theme.card, borderRadius: "24px", border: `1px solid ${theme.border}`, padding: "32px" }}>
                        <h3 style={{ color: theme.text, marginTop: 0, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <User size={20} color={theme.accent} /> {t.personalInfo}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <InfoRow label={t.email} value={user.email} icon={Mail} theme={theme} />
                            <InfoRow label={t.country} value={user.country} icon={Globe} theme={theme} />
                            <InfoRow label={t.referral} value={user.referralCode} icon={Users} theme={theme} color={theme.accent} />
                            <InfoRow label={t.securityLevel} value={`Level ${user.kycLevel}`} icon={ShieldCheck} theme={theme} color={theme.success} />
                        </div>
                    </div>

                    <div style={{ background: theme.card, borderRadius: "24px", border: `1px solid ${theme.border}`, padding: "24px" }}>
                        <h3 style={{ color: theme.text, marginTop: 0, marginBottom: "20px" }}>{t.actions}</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <ActionButton icon={Users} label={t.switchAcc} theme={theme} />
                            <ActionButton icon={LogOut} label={t.logout} color={theme.danger} theme={theme} isLast />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, icon: Icon, theme, color }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Icon size={18} color={theme.subText} />
                <span style={{ color: theme.subText, fontSize: "14px" }}>{label}</span>
            </div>
            <span style={{ color: color || theme.text, fontWeight: "700", fontSize: "14px" }}>{value}</span>
        </div>
    );
}

function ActionButton({ icon: Icon, label, color, theme, isLast }) {
    return (
        <div
            style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px", borderRadius: "12px", cursor: "pointer",
                background: "rgba(255,255,255,0.02)", transition: "0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Icon size={20} color={color || theme.text} />
                <span style={{ color: color || theme.text, fontWeight: "600" }}>{label}</span>
            </div>
            <ChevronRight size={18} color={theme.subText} />
        </div>
    );
}