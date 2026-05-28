import React from 'react';

export default function TaGauge({ title, signal, score, darkMode }) {
    // Calming Palette from the image
    const colorTeal = "#2DD4BF";
    const colorBlue = "#5086bf";
    const colorNeutral = "#64748b";

    // Maps score (-10 to 10) to degrees (-90 to 90)
    const normalizedScore = Math.max(-10, Math.min(10, score || 0));
    const rotation = (normalizedScore * 9);

    const textColor = darkMode ? "#f8fafc" : "#1e293b";
    const cardBg = darkMode ? "#1e293b" : "#ffffff";
    const borderColor = darkMode ? "#334155" : "#e2e8f0";

    const getSignalColor = (sig) => {
        if (sig?.includes("BUY")) return colorBlue;
        if (sig?.includes("SELL")) return colorTeal;
        return colorNeutral;
    };

    return (
        <div style={{
            background: cardBg,
            padding: "24px",
            borderRadius: "24px",
            border: `1px solid ${borderColor}`,
            textAlign: "center",
            color: textColor,
            transition: "all 0.3s ease",
            boxShadow: darkMode ? "0 10px 15px -3px rgba(0, 0, 0, 0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
            <h4 style={{
                margin: "0 0 15px 0",
                fontSize: "11px",
                color: "#94a3b8",
                letterSpacing: "2px",
                textTransform: "uppercase"
            }}>{title}</h4>

            <div style={{ position: "relative", width: "220px", height: "110px", margin: "0 auto" }}>
                <svg width="220" height="110" viewBox="0 0 200 100">
                    {/* Background Track */}
                    <path
                        d="M20 100 A80 80 0 0 1 180 100"
                        fill="none"
                        stroke={darkMode ? "#0f172a" : "#f1f5f9"}
                        strokeWidth="14"
                        strokeLinecap="round"
                    />

                    {/* Left Side (Teal) */}
                    <path
                        d="M20 100 A80 80 0 0 1 100 20"
                        fill="none"
                        stroke={colorTeal}
                        strokeWidth="14"
                        strokeLinecap="butt"
                    />

                    {/* Right Side (Blue) */}
                    <path
                        d="M100 20 A80 80 0 0 1 180 100"
                        fill="none"
                        stroke={colorBlue}
                        strokeWidth="14"
                        strokeLinecap="butt"
                    />

                    {/* Center Pivot Detail */}
                    <circle cx="100" cy="100" r="6" fill={textColor} />
                    <circle cx="100" cy="100" r="3" fill={cardBg} />

                    {/* The Needle */}
                    <line
                        x1="100" y1="100"
                        x2="100" y2="25"
                        stroke={textColor}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transformOrigin: "100px 100px",
                            transition: "transform 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" // Smooth catch-up
                        }}
                    />
                </svg>
            </div>

            <div style={{
                fontSize: "26px",
                fontWeight: "900",
                marginTop: "12px",
                color: getSignalColor(signal),
                textShadow: darkMode ? `0 0 20px ${getSignalColor(signal)}33` : "none"
            }}>
                {signal || 'HOLD'}
            </div>

            <div style={{
                fontSize: "12px",
                color: "#94a3b8",
                fontWeight: "700",
                marginTop: "4px"
            }}>
                SCORE: {score || 0}
            </div>
        </div>
    );
}