import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
    return (
        <div className="home-container">
            <h1>Добредојдовте</h1>
            <p className="subtitle">Избери дел од менито:</p>

            <div className="home-buttons">
                <Link to="/list" className="btn-primary">Контролна табла</Link>
                <Link to="/settings" className="btn-secondary">Поставки</Link>
            </div>
        </div>
    );
};

export default Home;
