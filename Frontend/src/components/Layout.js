import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ArrowUp, Languages } from "lucide-react";

export default function Layout({ children, darkMode, setDarkMode, lang, setLang }) {
    const [showScroll, setShowScroll] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const collapsedWidth = "80px";
    const expandedWidth = "280px";

    useEffect(() => {
        const checkScroll = () => {
            if (window.pageYOffset > 400) setShowScroll(true);
            else setShowScroll(false);
        };
        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: darkMode ? "#0f172a" : "#f8fafc" }}>

            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: "fixed",
                    zIndex: 100,
                    height: "100vh",
                    width: isHovered ? expandedWidth : collapsedWidth,
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
            >
                <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} isExpanded={isHovered} lang={lang} />
            </div>

            <main style={{
                flex: 1,
                padding: "20px 40px 40px 40px",
                marginLeft: isHovered ? expandedWidth : collapsedWidth,
                transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                minWidth: 0
            }}>
                {/* --- UNIVERSAL HEADER WITH TRANSLATION BUTTON --- */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: "30px",
                    paddingBottom: "20px",
                    borderBottom: darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0"
                }}>
                    <button
                        onClick={() => setLang(lang === "en" ? "mk" : "en")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            borderRadius: "12px",
                            border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #cbd5e1",
                            background: darkMode ? "rgba(255,255,255,0.05)" : "#ffffff",
                            color: darkMode ? "#f8fafc" : "#0f172a",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "0.2s"
                        }}
                    >
                        <Languages size={18} color="#3b82f6" />
                        {lang === "en" ? "MKD" : "ENG"}
                    </button>
                </div>

                {showScroll && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{
                            position: "fixed", bottom: "30px", right: "30px", zIndex: 1000,
                            background: "#3b82f6", color: "white", border: "none",
                            borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer",
                            boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <ArrowUp size={24} />
                    </button>
                )}

                <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                    {children}
                </div>
            </main>
        </div>
    );
}