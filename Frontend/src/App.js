import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import CoinDetailsPage from "./pages/CoinDetailsPage";

function App() {
    const [darkMode, setDarkMode] = useState(true);
    const [lang, setLang] = useState("mk");

    return (
        <Router>
            {/* Pass lang AND setLang to Layout */}
            <Layout darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang}>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard darkMode={darkMode} lang={lang} setLang={setLang} />} />
                    <Route path="/settings" element={<Settings darkMode={darkMode} lang={lang} />} />
                    <Route path="/reports" element={<Reports darkMode={darkMode} lang={lang} />} />
                    <Route path="/profile" element={<Profile darkMode={darkMode} lang={lang} />} />
                    <Route path="/coin/:symbol" element={<CoinDetailsPage darkMode={darkMode} lang={lang} />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;