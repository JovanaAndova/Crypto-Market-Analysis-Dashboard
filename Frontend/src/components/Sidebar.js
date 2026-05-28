import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Settings,
    FileText,
    User,
    Sun,
    Moon,
    LogOut
} from "lucide-react";

const sidebarTranslations = {
    mk: {
        dashboard: "Контролна табла",
        settings: "Поставки",
        reports: "Извештаи",
        profile: "Профил",
        lightMode: "Светлосен режим",
        darkMode: "Темен режим",
    },
    en: {
        dashboard: "Dashboard",
        settings: "Settings",
        reports: "Reports",
        profile: "Profile",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
    }
};

export default function Sidebar({ darkMode, setDarkMode, isExpanded, lang }) {
    const t = sidebarTranslations[lang || "mk"];
    const location = useLocation(); // Hook to get the current URL path

    const theme = {
        bg: "#1e293b",
        text: "#f8fafc",
        activeBg: "rgba(59, 130, 246, 0.2)",
        activeText: "#3b82f6",
        hoverBg: "rgba(255, 255, 255, 0.05)",
        accent: "#3b82f6"
    };

    const menuItems = [
        { icon: LayoutDashboard, label: t.dashboard, id: "dashboard", path: "/dashboard" },
        { icon: Settings, label: t.settings, id: "settings", path: "/settings" },
        { icon: FileText, label: t.reports, id: "reports", path: "/reports" },
        { icon: User, label: t.profile, id: "profile", path: "/profile" },
    ];

    return (
        <div style={{
            height: "100%",
            background: theme.bg,
            color: theme.text,
            display: "flex",
            flexDirection: "column",
            padding: "20px 0",
            boxShadow: "4px 0 10px rgba(0,0,0,0.3)",
            overflow: "hidden"
        }}>

            {/* --- CUSTOM GEOMETRIC LOGO SECTION --- */}
            <div style={{
                padding: "0 24px",
                marginBottom: "40px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                minHeight: "50px"
            }}>
                <div style={{ position: "relative", width: "35px", height: "35px", flexShrink: 0 }}>
                    <div style={{
                        position: "absolute",
                        inset: "-2px",
                        background: theme.accent,
                        filter: "blur(8px)",
                        opacity: 0.4,
                        borderRadius: "50%"
                    }} />

                    <div style={{
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(135deg, ${theme.accent}, #60a5fa)`,
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <div style={{
                            width: "60%",
                            height: "60%",
                            border: "2px solid rgba(255,255,255,0.4)",
                            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        }} />
                    </div>
                </div>

                {isExpanded && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{
                            fontWeight: "900",
                            fontSize: "18px",
                            letterSpacing: "1px",
                            color: theme.text,
                            lineHeight: "1.2"
                        }}>
                            CRYPTO<span style={{ color: theme.accent }}>PRO</span>
                        </span>
                        <span style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            color: "#edbb32",
                            letterSpacing: "1.5px"
                        }}>
                            TERMINAL
                        </span>
                    </div>
                )}
            </div>

            {/* --- NAVIGATION LINKS --- */}
            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link to={item.path} key={item.id} style={{ textDecoration: 'none' }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "16px 24px",
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    color: isActive ? theme.activeText : theme.text,
                                    background: isActive ? theme.activeBg : "transparent",
                                    gap: "16px",
                                    borderLeft: isActive ? `4px solid ${theme.accent}` : "4px solid transparent"
                                }}
                            >
                                <item.icon size={22} style={{ flexShrink: 0 }} />
                                {isExpanded && (
                                    <span style={{ fontWeight: "600", whiteSpace: "nowrap" }}>
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* --- BOTTOM CONTROLS --- */}
            <div style={{ padding: "0 12px" }}>
                {/* Dark Mode Toggle */}
                <div
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        gap: "16px",
                        marginBottom: "8px",
                        color: "#edbb32"
                    }}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    {isExpanded && (
                        <span style={{ fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}>
                            {darkMode ? t.lightMode : t.darkMode}
                        </span>
                    )}
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    gap: "16px",
                    color: "#ef4444"
                }}>
                </div>
            </div>
        </div>
    );
}