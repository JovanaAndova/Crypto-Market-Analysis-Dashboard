import React from "react";

export default function SignalBadge({ value }) {
    const bg = value === "BUY" ? "#d1fae5" : value === "SELL" ? "#fee2e2" : "#e5e7eb";
    const fg = value === "BUY" ? "#065f46" : value === "SELL" ? "#991b1b" : "#374151";

    return (
        <span style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 999,
            background: bg,
            color: fg,
            fontWeight: 800
        }}>
      {value}
    </span>
    );
}
