import React, { useEffect, useState } from "react";
import "../App.css";
import { API_BASE } from "../config/api";


const List = () => {
    const [state, setState] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/api/assets`)
            .then(async (res) => {
                if (!res.ok) throw new Error(`Backend error: ${res.status}`);
                return res.json();
            })
            .then((data) => setState(Array.isArray(data) ? data : []))
            .catch((e) => {
                console.error(e);
                setState([]);
            });
    }, []);

    const formatPrice = (value) => {
        if (value === null || value === undefined) return "-";
        const n = Number(value);
        if (isNaN(n)) return value;
        return `$${n.toLocaleString("en-US", {
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <div className="dashboard-layout">

            <aside className="sidebar">
                <div className="sidebar-logo">ЛОГО / Име на Апликацијата</div>

                <nav className="sidebar-menu">
                    <div className="sidebar-item sidebar-item-active">
                        Контролна табла
                    </div>
                    <div className="sidebar-item">Поставки</div>
                    <div className="sidebar-item">Извештаи</div>
                    <div className="sidebar-item">Профил</div>
                </nav>
            </aside>

            <main className="main-content">
                {/* ТОП БАР */}
                <header className="topbar">
                    <div className="topbar-spacer" />
                    <input
                        className="search-input"
                        placeholder="Пребарување..."
                    />
                    <div className="user-badge">
                        <span>Корисник</span>
                    </div>
                </header>

                <h1 className="page-title">Контролна табла</h1>

                {/* КАРТИЧКИ СО KPI */}
                <section className="kpi-row">
                    <div className="kpi-card">
                        <p className="kpi-label">Активни Корисници</p>
                        <p className="kpi-value">4,582</p>
                    </div>
                    <div className="kpi-card">
                        <p className="kpi-label">Пазарен лимит</p>
                        <p className="kpi-value">$2.9T ▼ 6.6%</p>
                    </div>
                    <div className="kpi-card">
                        <p className="kpi-label">CMC20</p>
                        <p className="kpi-value">$179.72 ▼ 7.07%</p>
                    </div>
                    <div className="kpi-card">
                        <p className="kpi-label">Просечно Време (сесија)</p>
                        <p className="kpi-value">3 мин. 15 сек.</p>
                    </div>
                </section>

                <section className="table-section">
                    <table className="crypto-table">
                        <thead>
                        <tr>
                            <th>Име</th>
                            <th>Цена</th>
                            <th>1h %</th>
                            <th>24h %</th>
                            <th>7d %</th>
                        </tr>
                        </thead>
                        <tbody>
                        {state.slice(0, 10).map((obj) => (
                            <tr key={obj.id}>
                                <td>{obj.name}</td>
                                <td>{formatPrice(obj.currentPrice)}</td>
                                {/* немаш проценти во базата, ставаме placeholder */}
                                <td>▲ 0.60%</td>
                                <td>▼ 6.48%</td>
                                <td>▼ 4.02%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default List;
