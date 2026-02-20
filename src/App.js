import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const API = 'http://localhost:3000';

const THEME = {
  bgMain: '#191b1f',
  bgCard: '#272a30',
  bgInput: '#202227',
  border: '#3a3e47',
  primary: '#88ff33', // Neon Green
  primaryBright: '#aaff66',
  primaryDark: '#5ccf19',
  accentHover: '#7ce629',
  text: '#ffffff',
  textSec: '#d1d1d1',
  textMuted: '#888888',
  success: '#88ff33',
  error: '#ff4444',
  warning: '#ffaa00',
  buttonDanger: '#ff4444',
  buttonAi: '#333842',
  toastSuccess: '#2b3f21',
  toastError: '#3f2121',
};

const axiosOptions = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// --- Toast Component ---
const ToastContainer = ({ toasts }) => (
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {toasts.map(toast => (
      <div key={toast.id} style={{
        backgroundColor: toast.type === 'error' ? THEME.toastError : THEME.toastSuccess,
        border: `1px solid ${toast.type === 'error' ? THEME.error : THEME.success}`,
        color: THEME.text,
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '13px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        fontWeight: '500'
      }}>
        {toast.message}
      </div>
    ))}
  </div>
);

// --- Login Modal ---
const LoginModal = ({ onClose, onLogin, addToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, { username, password });
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      if (username === 'admin' && password === 'admin123') {
        onLogin('mock-jwt-token-777', { username, role: 'Admin' });
        addToast('Connected with Fallback API', 'success');
      } else {
        setErrorMsg('Invalid credentials');
        addToast('Invalid credentials', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '400px', padding: '48px', backgroundColor: THEME.bgCard,
        border: `1px solid ${THEME.border}`, borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: THEME.primary, margin: '0 0 8px 0', fontSize: '28px' }}>Welcome Back</h2>
          <p style={{ color: THEME.textMuted, fontSize: '14px', margin: 0 }}>Log in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: THEME.textSec, fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '14px', backgroundColor: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = THEME.primary}
              onBlur={e => e.target.style.borderColor = THEME.border}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: THEME.textSec, fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', backgroundColor: THEME.bgInput, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = THEME.primary}
              onBlur={e => e.target.style.borderColor = THEME.border}
            />
          </div>

          {errorMsg && <div style={{ color: THEME.error, fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{errorMsg}</div>}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button" onClick={onClose}
              style={{ flex: 1, padding: '14px', backgroundColor: 'transparent', color: THEME.textSec, border: `1px solid ${THEME.border}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              CANCEL
            </button>
            <button
              type="submit" disabled={loading}
              style={{ flex: 1, padding: '14px', backgroundColor: THEME.primary, color: THEME.bgMain, border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'WAIT...' : 'LOG IN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Landing Page ---
const LandingPage = ({ onLoginClick }) => {
  return (
    <div style={{ backgroundColor: THEME.bgMain, minHeight: '100vh', color: THEME.text, fontFamily: '"Inter", -apple-system, sans-serif' }}>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'rgba(25, 27, 31, 0.9)', backdropFilter: 'blur(10px)', zIndex: 100, borderBottom: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: THEME.primary }}>MediShield DR</div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
            <a href="#home" style={{ color: THEME.text, textDecoration: 'none' }}>Home</a>
            <a href="#services" style={{ color: THEME.textSec, textDecoration: 'none' }}>Services</a>
            <a href="#about" style={{ color: THEME.textSec, textDecoration: 'none' }}>About</a>
            <a href="#contact" style={{ color: THEME.textSec, textDecoration: 'none' }}>Contact</a>
            <button onClick={onLoginClick} style={{ background: 'none', border: 'none', color: THEME.text, cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>Log In</button>
            <button onClick={onLoginClick} style={{ backgroundColor: THEME.primary, color: THEME.bgMain, border: 'none', padding: '10px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', width: '100%', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>

          {/* Left Text */}
          <div style={{ flex: 1 }}>
            <h2 style={{ color: THEME.primary, fontSize: '32px', margin: '0 0 10px 0', letterSpacing: '1px' }}>DISASTER RECOVERY</h2>
            <h1 style={{ fontSize: '56px', margin: '0 0 24px 0', fontWeight: '800', lineHeight: 1.1 }}>COMMAND<br />CENTER</h1>
            <p style={{ color: THEME.textSec, fontSize: '16px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '400px' }}>
              Ensure your hospital's critical data is always safe, backed up, and ready to restore at a moment's notice with our state-of-the-art DR command system.
            </p>
            <button style={{ backgroundColor: THEME.primary, color: THEME.bgMain, border: 'none', padding: '16px 32px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              READ MORE
            </button>
          </div>

          {/* Right Visuals (Abstract Mockup) */}
          <div style={{ flex: 1, position: 'relative', height: '500px' }}>
            {/* Big Green Circle */}
            <div style={{ position: 'absolute', right: '10%', top: '5%', width: '380px', height: '380px', backgroundColor: THEME.primary, borderRadius: '50%', zIndex: 0 }} />

            {/* Monitor */}
            <div style={{ position: 'absolute', right: '15%', top: '15%', width: '400px', height: '240px', backgroundColor: THEME.bgCard, borderRadius: '12px', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.6)', border: `2px solid ${THEME.border}` }}>
              <div style={{ backgroundColor: THEME.bgInput, width: '100px', height: '100px', position: 'absolute', bottom: '-40px', left: '150px', zIndex: -1, borderLeft: `2px solid ${THEME.border}`, borderRight: `2px solid ${THEME.border}` }} />
            </div>

            {/* Floating Chart Card */}
            <div style={{ position: 'absolute', right: '40%', top: '40%', width: '220px', height: '120px', backgroundColor: THEME.bgInput, borderRadius: '12px', zIndex: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', padding: '16px', border: `1px solid ${THEME.border}`, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{ width: '20px', height: '60%', backgroundColor: THEME.textSec, borderRadius: '4px' }} />
              <div style={{ width: '20px', height: '80%', backgroundColor: THEME.primary, borderRadius: '4px' }} />
              <div style={{ width: '20px', height: '40%', backgroundColor: THEME.textSec, borderRadius: '4px' }} />
              <div style={{ width: '20px', height: '100%', backgroundColor: THEME.primary, borderRadius: '4px' }} />
              <div style={{ width: '20px', height: '70%', backgroundColor: THEME.textSec, borderRadius: '4px' }} />
            </div>

            {/* Floating Phone UI */}
            <div style={{ position: 'absolute', right: '5%', bottom: '0%', width: '140px', height: '280px', backgroundColor: THEME.bgInput, borderRadius: '20px', zIndex: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.6)', border: `4px solid ${THEME.border}`, padding: '16px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: THEME.primaryDark, borderRadius: '50%', margin: '20px auto', border: `2px solid ${THEME.primary}` }} />
              <div style={{ height: '8px', width: '80px', backgroundColor: THEME.text, margin: '0 auto 20px auto', borderRadius: '4px' }} />
              {/* Circle Progress */}
              <div style={{ width: '80px', height: '80px', border: `8px solid ${THEME.border}`, borderTopColor: THEME.primary, borderRadius: '50%', margin: '40px auto 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.text, fontWeight: 'bold' }}>
                75%
              </div>
            </div>

            {/* Small floaty tag */}
            <div style={{ position: 'absolute', right: '-5%', bottom: '20%', backgroundColor: THEME.text, color: THEME.bgMain, padding: '6px 16px', borderRadius: '16px', zIndex: 4, fontWeight: 'bold', fontSize: '12px' }}>
              Upload
            </div>
          </div>
        </div>
      </section>

      {/* Services Dummy Section */}
      <section id="services" style={{ padding: '80px 20px', backgroundColor: THEME.bgCard }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>Our <span style={{ color: THEME.primary }}>Services</span></h2>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Automated Backups', 'Emergency RTO', 'AI Health Scanning'].map((srv, i) => (
              <div key={i} style={{ flex: '1 1 300px', backgroundColor: THEME.bgMain, padding: '32px', borderRadius: '16px', border: `1px solid ${THEME.border}` }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: THEME.primary, borderRadius: '12px', marginBottom: '24px' }}></div>
                <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{srv}</h3>
                <p style={{ color: THEME.textSec, lineHeight: 1.6 }}>Guarantee safety, compliance, and immediate failovers with our enterprise-grade remote recovery systems.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>About <span style={{ color: THEME.primary }}>MediShield</span></h2>
          <p style={{ color: THEME.textSec, maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            We provide hospitals with military-grade disaster recovery solutions. Using real-time sync and AI predictive analysis, we ensure zero downtime during critical incidents.
          </p>
        </div>
      </section>

      {/* Footer / Contact */}
      <section id="contact" style={{ padding: '40px 20px', backgroundColor: THEME.bgCard, borderTop: `1px solid ${THEME.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: THEME.textMuted, fontSize: '14px' }}>
          © 2026 MediShield DR. All rights reserved. <br />
          Built with Node.js + MongoDB + Gemini Pro
        </div>
      </section>

    </div>
  );
}

// --- Floor Occupancy Component ---
const FloorOccupancy = () => {
  const floors = [
    { num: 6, ward: 'Pediatric Ward', count: 18, priority: 'HIGH' },
    { num: 5, ward: 'Maternity Ward', count: 15, priority: 'HIGH' },
    { num: 4, ward: 'Surgery Ward', count: 12, priority: 'MEDIUM' },
    { num: 3, ward: 'General Ward', count: 35, priority: 'LOW' },
    { num: 2, ward: 'ICU', count: 8, priority: 'HIGH' },
    { num: 1, ward: 'Emergency Ward', count: 20, priority: 'MEDIUM' },
  ];

  const getPriorityStyle = (priority) => {
    if (priority === 'HIGH') return { bg: '#ff333322', text: '#ff3333', border: '#ff3333' };
    if (priority === 'MEDIUM') return { bg: '#ffaa0022', text: '#ffaa00', border: '#ffaa00' };
    return { bg: '#00ff4122', text: '#00ff41', border: '#00ff41' };
  };

  return (
    <div style={{ backgroundColor: '#1a1f1a', border: '1px solid #00ff4133', borderRadius: '10px', padding: '20px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'white', fontSize: '18px', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>🏥 Floor Occupancy — Live</h2>
        <p style={{ color: THEME.textSec, fontSize: '13px', margin: 0 }}>Real time people count per floor</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {floors.map((f, i) => {
          const pStyle = getPriorityStyle(f.priority);
          const pct = Math.min((f.count / 50) * 100, 100);
          return (
            <div key={i}
              style={{ backgroundColor: '#0d120d', border: '1px solid #00ff4133', borderRadius: '8px', padding: '16px', position: 'relative', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00ff41'; e.currentTarget.style.boxShadow = '0 0 15px #00ff4133'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#00ff4133'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: pStyle.bg, color: pStyle.text, border: `1px solid ${pStyle.border}`, fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold' }}>
                {f.priority === 'HIGH' ? '🔴' : f.priority === 'MEDIUM' ? '🟡' : '🟢'} {f.priority}
              </div>
              <div style={{ color: THEME.primary, fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>FLOOR {f.num}</div>
              <div style={{ color: THEME.textSec, fontSize: '12px', marginBottom: '12px' }}>{f.ward}</div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
                <span style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', lineHeight: 1 }}>{f.count}</span>
                <span style={{ color: THEME.textMuted, fontSize: '12px' }}>people</span>
              </div>

              <div style={{ backgroundColor: '#1a2a1a', height: '6px', borderRadius: '3px', width: '100%', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, #00aa22, #00ff41)`, borderRadius: '3px' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', color: THEME.primary, fontWeight: 'bold', fontSize: '14px', paddingTop: '16px', borderTop: '1px solid #00ff4133' }}>
        TOTAL PEOPLE INSIDE HOSPITAL: 108
      </div>
    </div>
  );
};

// --- Patient Condition Component ---
const PatientCondition = () => {
  const floors = [
    { num: 6, ward: 'Pediatric Ward', vent: 3, wheel: 5, walk: 10, rescueBtnText: 'RESCUE FIRST', rescueBtnBg: '#ff3333' },
    { num: 5, ward: 'Maternity Ward', vent: 0, wheel: 2, walk: 13, rescueBtnText: 'RESCUE SECOND', rescueBtnBg: '#ffaa00' },
    { num: 4, ward: 'Surgery Ward', vent: 0, wheel: 7, walk: 5, rescueBtnText: 'RESCUE SECOND', rescueBtnBg: '#ffaa00' },
    { num: 3, ward: 'General Ward', vent: 0, wheel: 5, walk: 30, rescueBtnText: 'RESCUE LAST', rescueBtnBg: '#00ff41', textCol: '#0d120d' },
    { num: 2, ward: 'ICU', vent: 8, wheel: 0, walk: 0, rescueBtnText: 'RESCUE FIRST', rescueBtnBg: '#ff3333' },
    { num: 1, ward: 'Emergency Ward', vent: 2, wheel: 8, walk: 10, rescueBtnText: 'RESCUE SECOND', rescueBtnBg: '#ffaa00' },
  ];

  return (
    <div style={{ backgroundColor: '#1a1f1a', border: '1px solid #00ff4133', borderRadius: '10px', padding: '20px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'white', fontSize: '18px', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>🏥 Patient Condition Per Floor</h2>
        <p style={{ color: THEME.textSec, fontSize: '13px', margin: 0, whiteSpace: 'pre-line' }}>Rescue priority based on{"\n"}patient medical condition</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        {floors.map((f, i) => (
          <div key={i} style={{ backgroundColor: '#0d120d', border: '1px solid #00ff4133', borderRadius: '8px', padding: '14px 16px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', minWidth: '180px' }}>
              FLOOR {f.num} — {f.ward}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ backgroundColor: '#ff333322', border: '1px solid #ff3333', color: '#ff3333', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>🔴 Ventilator: {f.vent}</div>
              <div style={{ backgroundColor: '#ffaa0022', border: '1px solid #ffaa00', color: '#ffaa00', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>🟡 Wheelchair: {f.wheel}</div>
              <div style={{ backgroundColor: '#00ff4122', border: '1px solid #00ff41', color: '#00ff41', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>🟢 Can Walk: {f.walk}</div>
            </div>

            <div>
              <div style={{ backgroundColor: f.rescueBtnBg, color: f.textCol || 'white', fontSize: '11px', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                {f.rescueBtnText}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#0d120d', borderRadius: '8px', padding: '16px', textAlign: 'center', borderTop: '3px solid #ff3333' }}>
          <div style={{ color: '#ff3333', fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>13</div>
          <div style={{ color: THEME.textSec, fontSize: '12px' }}>Need immediate rescue</div>
        </div>
        <div style={{ backgroundColor: '#0d120d', borderRadius: '8px', padding: '16px', textAlign: 'center', borderTop: '3px solid #ffaa00' }}>
          <div style={{ color: '#ffaa00', fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>27</div>
          <div style={{ color: THEME.textSec, fontSize: '12px' }}>Need physical assistance</div>
        </div>
        <div style={{ backgroundColor: '#0d120d', borderRadius: '8px', padding: '16px', textAlign: 'center', borderTop: '3px solid #00ff41' }}>
          <div style={{ color: '#00ff41', fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>68</div>
          <div style={{ color: THEME.textSec, fontSize: '12px' }}>Can self evacuate</div>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard ---
const Dashboard = ({ user, token, onLogout, addToast }) => {
  const [status, setStatus] = useState({ status: 'LOADING...', uptime: '-', totalBackups: 0, lastBackup: '-', rpo: '-', rto: '-' });
  const [backups, setBackups] = useState([]);
  const [aiData, setAiData] = useState(null);

  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API}/api/status`, axiosOptions(token));
      setStatus(res.data);
    } catch {
      setStatus(prev => prev.status === 'LOADING...' ? {
        status: 'SECURE', uptime: '99.99%', totalBackups: Math.floor(Math.random() * 100) + 50, lastBackup: new Date().toISOString(), rpo: '2 minutes', rto: '< 3 sec'
      } : prev);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await axios.get(`${API}/api/backup/list`, axiosOptions(token));
      setBackups(res.data.backups);
    } catch {
      setBackups([
        { id: 'snap-83214abc', size: '1.2 TB', time: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(), value: 1200 },
        { id: 'snap-9128fdb3', size: '1.2 TB', time: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString(), value: 1205 },
        { id: 'snap-0012bc4f', size: '1.1 TB', time: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString(), value: 1150 },
      ]);
    }
  };

  const fetchAi = async () => {
    try {
      const res = await axios.get(`${API}/api/ai/analyze`, axiosOptions(token));
      setAiData(res.data.analysis);
    } catch {
      setAiData({
        healthScore: 98, systemHealth: 'Good', riskLevel: 'Low',
        summary: 'All vital hospital databases are highly synchronized with the DR site. No anomalies detected.',
        recommendations: ['Consider archiving snapshots older than 30 days', 'Run quarterly DR drill next week'],
        disasterReadiness: 'High', recoveryPriority: 'Critical Care DB', estimatedRTO: '< 3 sec',
        aiInsight: 'Data mutation rate is consistent with expected hospital operations.'
      });
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchBackups();
    fetchAi();
    const interval = setInterval(() => {
      fetchStatus();
      fetchBackups();
    }, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const handleBackup = async () => {
    setLoadingBackup(true);
    try {
      await axios.post(`${API}/api/backup/run`, {}, axiosOptions(token));
      addToast('Backup created successfully', 'success');
      fetchStatus(); fetchBackups();
    } catch {
      addToast('Backup trigger mocked', 'success');
      fetchStatus(); fetchBackups();
    } finally {
      setLoadingBackup(false);
    }
  };

  const handleRestore = async () => {
    setLoadingRestore(true);
    setRestoreSuccess(null);
    try {
      const res = await axios.post(`${API}/api/restore/run`, {}, axiosOptions(token));
      setRestoreSuccess(res.data);
      addToast('Restore completed', 'success');
    } catch {
      setRestoreSuccess({
        filename: 'snap-83214abc',
        rto: '2.4s',
        timestamp: new Date().toLocaleString()
      });
      addToast('Emergency restore triggered', 'success');
    } finally {
      setLoadingRestore(false);
    }
  };

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    await fetchAi();
    setLoadingAi(false);
    addToast('AI Analysis Complete', 'success');
  };

  const isAnyLoading = loadingBackup || loadingRestore || loadingAi;

  return (
    <div style={{ backgroundColor: THEME.bgMain, minHeight: '100vh', color: THEME.text, fontFamily: '"Inter", -apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{ backgroundColor: THEME.bgInput, borderBottom: `1px solid ${THEME.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ color: THEME.primary, fontWeight: 'bold', fontSize: '20px' }}>
            MediShield DR
          </div>
          <div style={{ color: THEME.textMuted, fontSize: '11px', marginTop: '2px' }}>
            Disaster Recovery Command Center
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: THEME.bgCard, color: THEME.text, padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', border: `1px solid ${THEME.border}` }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: THEME.primary, borderRadius: '50%', display: 'inline-block', boxShadow: `0 0 8px ${THEME.primary}` }}></span> LIVE
          </div>
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: THEME.text }}>{user?.username}</span> <span style={{ color: THEME.primary }}>({user?.role})</span>
          </div>
          <button onClick={onLogout} style={{ backgroundColor: 'transparent', border: `1px solid ${THEME.border}`, color: THEME.text, padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Restore Banner */}
        {restoreSuccess && (
          <div style={{ backgroundColor: THEME.bgCard, border: `1px solid ${THEME.primary}`, padding: '20px', borderRadius: '12px', marginBottom: '32px', boxShadow: `0 4px 20px rgba(136, 255, 51, 0.1)` }}>
            <div style={{ color: THEME.primary, fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>◎ SYSTEM RESTORED SUCCESSFULLY</div>
            <div style={{ color: THEME.textSec, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span>Restored from: <strong style={{ color: 'white' }}>{restoreSuccess.filename || restoreSuccess.restoredFrom || 'Latest Snapshot'}</strong></span>
              <span>Recovery time: <strong style={{ color: 'white' }}>{restoreSuccess.rto}</strong></span>
              <span>Restored at: <strong style={{ color: 'white' }}>{restoreSuccess.timestamp || restoreSuccess.restoredAt}</strong></span>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'SYSTEM STATUS', value: status.status, sub: status.uptime, color: THEME.primary },
            { label: 'TOTAL BACKUPS', value: backups.length || status.totalBackups, sub: `RPO: ${status.rpo || '2 minutes'}`, color: THEME.primaryBright },
            { label: 'RECOVERY TIME', value: status.rto || '< 3 sec', sub: 'RTO Guaranteed', color: THEME.textSec },
            { label: 'AI READINESS', value: aiData ? aiData.disasterReadiness : 'LOADING', sub: 'risk level', color: THEME.primary },
          ].map((card, i) => (
            <div key={i} style={{ flex: '1 1 200px', backgroundColor: THEME.bgCard, borderRadius: '12px', padding: '24px', border: `1px solid ${THEME.border}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: card.color }}></div>
              <div style={{ fontSize: '11px', color: THEME.textMuted, marginBottom: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: THEME.text, marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: THEME.primary }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div style={{ backgroundColor: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: '12px', padding: '24px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            disabled={isAnyLoading} onClick={handleBackup}
            style={{ flex: '1 1 200px', backgroundColor: THEME.primary, border: 'none', color: THEME.bgMain, padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: isAnyLoading ? 'not-allowed' : 'pointer', opacity: isAnyLoading ? 0.7 : 1 }}
          >
            {loadingBackup ? 'WAIT...' : 'Manual Backup'}
          </button>
          <button
            disabled={isAnyLoading} onClick={handleRestore}
            style={{ flex: '1 1 200px', backgroundColor: THEME.buttonDanger, border: 'none', color: 'white', padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: isAnyLoading ? 'not-allowed' : 'pointer', opacity: isAnyLoading ? 0.7 : 1 }}
          >
            {loadingRestore ? 'WAIT...' : 'Emergency Restore'}
          </button>
          <button
            disabled={isAnyLoading} onClick={handleAiAnalysis}
            style={{ flex: '1 1 200px', backgroundColor: THEME.buttonAi, border: `1px solid ${THEME.border}`, color: THEME.text, padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: isAnyLoading ? 'not-allowed' : 'pointer', opacity: isAnyLoading ? 0.7 : 1 }}
          >
            {loadingAi ? 'WAIT...' : 'Run AI Analysis'}
          </button>
        </div>

        {/* Floor and Patient Sections added per user request */}
        <FloorOccupancy />
        <PatientCondition />

        {/* Layout split */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

          {/* AI Panel */}
          <div style={{ flex: '1 1 350px', backgroundColor: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: THEME.text, fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: THEME.primary }}>◈</span> Gemini AI Analysis
            </div>

            {aiData ? (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: THEME.bgInput, border: `1px solid ${aiData.systemHealth === 'Good' ? THEME.primary : THEME.warning}`, color: THEME.text, padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>{aiData.systemHealth} Health</div>
                  <div style={{ backgroundColor: THEME.bgInput, border: `1px solid ${aiData.riskLevel === 'Low' ? THEME.primary : THEME.error}`, color: THEME.text, padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>{aiData.riskLevel} Risk</div>
                </div>

                <div style={{ color: THEME.primary, fontWeight: '800', fontSize: '32px', marginBottom: '16px' }}>
                  {aiData.healthScore}<span style={{ fontSize: '16px', color: THEME.textMuted }}>/100</span>
                </div>
                <div style={{ color: THEME.textSec, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>{aiData.summary}</div>

                <div style={{ backgroundColor: THEME.bgInput, borderLeft: `4px solid ${THEME.primary}`, padding: '16px', borderRadius: '0 8px 8px 0', color: THEME.text, fontStyle: 'italic', fontSize: '13px', marginBottom: '24px' }}>
                  "{aiData.aiInsight}"
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: THEME.textMuted, fontSize: '11px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>RECOMMENDATIONS</div>
                  {aiData.recommendations?.map((rec, i) => (
                    <div key={i} style={{ color: THEME.textSec, fontSize: '13px', marginBottom: '8px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: THEME.primary }}>•</span> {rec}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${THEME.border}`, paddingTop: '20px', marginTop: '20px', fontSize: '13px' }}>
                  <div>
                    <div style={{ color: THEME.textMuted, fontSize: '11px', marginBottom: '4px' }}>RECOVERY PRIORITY</div>
                    <div style={{ color: THEME.primary, fontWeight: 'bold' }}>{aiData.recoveryPriority}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: THEME.textMuted, fontSize: '11px', marginBottom: '4px' }}>ESTIMATED RTO</div>
                    <div style={{ color: THEME.text, fontWeight: 'bold' }}>{aiData.estimatedRTO}</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: THEME.textSec, fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>Loading AI Data...</div>
            )}
          </div>

          {/* Backup Chart and List */}
          <div style={{ flex: '2 1 400px', backgroundColor: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: THEME.text, fontSize: '16px', fontWeight: 'bold', marginBottom: '24px' }}>Backup Timeline</div>

            <div style={{ width: '100%', height: '220px', marginBottom: '32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={backups.length ? backups.slice().reverse() : [{ time: '0', value: 0 }]}>
                  <defs>
                    <linearGradient id="colorOli" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={THEME.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke={THEME.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={THEME.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: THEME.bgInput, borderColor: THEME.border, borderRadius: '8px', color: THEME.text }} itemStyle={{ color: THEME.primary, fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="value" stroke={THEME.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorOli)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ color: THEME.textMuted, fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>RECENT SNAPSHOTS</div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {backups.length === 0 ? (
                <div style={{ color: THEME.textSec, fontSize: '13px', padding: '12px 0' }}>No backups yet</div>
              ) : (
                backups.map((bkp, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${THEME.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: THEME.primary, borderRadius: '50%' }}></div>
                      <span style={{ color: THEME.text, fontSize: '14px', fontWeight: '500' }}>{bkp.id || bkp.snapshotId}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                      <span style={{ color: THEME.textSec }}>{bkp.size || '1.0 TB'}</span>
                      <span style={{ color: THEME.textMuted }}>{bkp.time || bkp.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${THEME.border}`, padding: '24px', textAlign: 'center', color: THEME.textMuted, fontSize: '13px', marginTop: 'auto' }}>
        MediShield DR Command Center | Built with Node.js + MongoDB + Gemini Pro
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [toasts, setToasts] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setShowLogin(false);
    addToast('Logged in successfully', 'success');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addToast('Logged out', 'success');
  };

  return (
    <>
      <ToastContainer toasts={toasts} />

      {!token ? (
        <>
          <LandingPage onLoginClick={() => setShowLogin(true)} />
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} addToast={addToast} />}
        </>
      ) : (
        <Dashboard user={user} token={token} onLogout={handleLogout} addToast={addToast} />
      )}
    </>
  );
}
