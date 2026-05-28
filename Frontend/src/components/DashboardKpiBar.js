import React from 'react';
import { Users, Globe, Activity, Clock } from 'lucide-react';

const kpiTranslations = {
    mk: {
        activeUsers: "АКТИВНИ КОРИСНИЦИ",
        marketCap: "ПАЗАРЕН ЛИМИТ",
        cmc20: "CMC20",
        avgTime: "ПРОСЕЧНО ВРЕМЕ",
        min: "м",
        sec: "с"
    },
    en: {
        activeUsers: "ACTIVE USERS",
        marketCap: "MARKET CAP",
        cmc20: "CMC20 INDEX",
        avgTime: "AVERAGE TIME",
        min: "m",
        sec: "s"
    }
};

const KpiCard = ({ icon: Icon, label, value, change, darkMode }) => (
    <div style={{
        background: darkMode ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
        borderRadius: '24px',
        padding: '24px',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '10px',
                borderRadius: '12px',
                color: '#3b82f6'
            }}>
                <Icon size={20} />
            </div>
            {change && (
                <span style={{
                    color: change.includes('-') ? '#ef4444' : '#10b981',
                    background: change.includes('-') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}>
          {change}
        </span>
            )}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', marginBottom: '8px', letterSpacing: '0.5px' }}>
            {label}
        </div>
        <div style={{ color: darkMode ? '#f8fafc' : '#0f172a', fontSize: '24px', fontWeight: '800', whiteSpace: 'nowrap' }}>
            {value}
        </div>
    </div>
);

export default function DashboardKpiBar({ darkMode, lang }) {
    const t = kpiTranslations[lang || 'mk'];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', // FORCES 4 EQUAL COLUMNS
            gap: '24px',
            marginBottom: '40px',
            width: '100%'
        }}>
            <KpiCard
                icon={Users}
                label={t.activeUsers}
                value="4,582"
                darkMode={darkMode}
            />
            <KpiCard
                icon={Globe}
                label={t.marketCap}
                value="$2.9T"
                change="-6.6%"
                darkMode={darkMode}
            />
            <KpiCard
                icon={Activity}
                label={t.cmc20}
                value="$179.72"
                change="-7.07%"
                darkMode={darkMode}
            />
            <KpiCard
                icon={Clock}
                label={t.avgTime}
                value={`3${t.min} 15${t.sec}`}
                darkMode={darkMode}
            />
        </div>
    );
}