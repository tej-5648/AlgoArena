import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import io from 'socket.io-client';
import {
  Activity, Zap, TrendingUp, TrendingDown, Award, Radio, AlertCircle,
  CheckCircle2, Clock, Cpu, Database, Server, Wifi, BarChart3,
  Target, Globe, Layers, GitBranch, Maximize2, Filter, Lock,
  Search, Settings, Bell, ChevronRight, ChevronDown, ChevronUp,
  Play, Pause, RotateCw, Download, Eye, EyeOff, User, LogOut,
  Mail, Key, Shield, Star, MessageSquare, HelpCircle, Sun, Moon,
  Sliders, BookOpen, Briefcase, DollarSign, PieChart as PieIcon,
  Hash, AtSign, FileText, Save, Upload, Share2, Copy, Plus,
  Minus, X, Check, Info, AlertTriangle, ExternalLink, Calendar,
  Volume2, VolumeX, Send, Heart, Flag, Bookmark
} from 'lucide-react';

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: Infinity,
});

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════
const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n);
const formatTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const getLatencyColor = (lat) => {
  if (lat < 400) return '#10b981';
  if (lat < 500) return '#22c55e';
  if (lat < 600) return '#f59e0b';
  if (lat < 700) return '#fb923c';
  return '#ef4444';
};

const getLatencyTier = (lat) => {
  if (lat < 400) return { label: 'ELITE', color: '#10b981' };
  if (lat < 500) return { label: 'FAST', color: '#22c55e' };
  if (lat < 600) return { label: 'GOOD', color: '#f59e0b' };
  if (lat < 700) return { label: 'AVG', color: '#fb923c' };
  return { label: 'SLOW', color: '#ef4444' };
};

// ═══════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email && password) {
        onLogin({ email, name: email.split('@')[0] });
      } else {
        setError('Please enter valid credentials');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ email: 'demo@iicpc.com', name: 'Demo User' });
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#050810', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%', width: 400, height: 400,
        background: '#10b981', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.05,
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400,
        background: '#06b6d4', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.05,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            borderRadius: 12, marginBottom: 16,
            boxShadow: '0 0 30px rgba(16,185,129,0.4)',
          }}>
            <Zap size={32} color="#050810" />
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, letterSpacing: 4,
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}>IICPC TERMINAL</h1>
          <p style={{ color: '#6b7280', fontSize: 11, letterSpacing: 2 }}>
            HFT BENCHMARKING PLATFORM v2.0
          </p>
        </div>

        {/* Login Form */}
        <div className="panel scan-effect" style={{ padding: 32, borderRadius: 8 }}>
          <div className="panel-header" style={{ marginBottom: 24, padding: 0, border: 'none' }}>
            <span style={{ fontSize: 14, color: '#e5e7eb', fontWeight: 700, letterSpacing: 2 }}>
              SECURE LOGIN
            </span>
            <span className="label-tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
              <Lock size={9} style={{ display: 'inline', marginRight: 4 }} />
              SSL
            </span>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#6b7280', letterSpacing: 1, marginBottom: 6 }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 14, top: 16, color: '#6b7280' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="trader@iicpc.com"
                  className="login-input"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#6b7280', letterSpacing: 1, marginBottom: 6 }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={{ position: 'absolute', left: 14, top: 16, color: '#6b7280' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="login-input"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: 14, background: 'none',
                    border: 'none', color: '#6b7280', cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af', cursor: 'pointer' }}>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: 11, color: '#06b6d4', textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444',
                padding: 10, marginBottom: 16, fontSize: 11, color: '#ef4444',
                display: 'flex', alignItems: 'center', gap: 6, borderRadius: 4,
              }}>
                <AlertCircle size={12} />{error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%', padding: 14, fontSize: 12, marginBottom: 12,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <RotateCw size={14} className="spin-slow" />
                  AUTHENTICATING...
                </span>
              ) : (
                'SECURE LOGIN →'
              )}
            </button>

            {/* Demo button */}
            <button
              type="button"
              onClick={handleDemo}
              className="btn"
              style={{ width: '100%', padding: 12, fontSize: 11 }}
            >
              CONTINUE AS DEMO USER
            </button>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: 24, paddingTop: 20, borderTop: '1px solid #1a2236',
            display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={11} /> 256-bit AES
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={11} color="#10b981" /> ISO 27001
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Award size={11} /> SOC 2
            </span>
          </div>
        </div>

        {/* Bottom info */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 10, color: '#6b7280' }}>
          © 2026 IICPC Trading Systems · All Rights Reserved
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════
function Sidebar({ activeView, setActiveView, user, onLogout }) {
  const sections = [
    {
      title: 'TRADING',
      items: [
        { id: 'OVERVIEW', icon: <Layers size={14} />, label: 'Overview' },
        { id: 'ANALYTICS', icon: <BarChart3 size={14} />, label: 'Analytics' },
        { id: 'BOTS', icon: <Cpu size={14} />, label: 'Bot Manager' },
        { id: 'ORDERS', icon: <Briefcase size={14} />, label: 'Order Book' },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'NETWORK', icon: <Globe size={14} />, label: 'Network' },
        { id: 'LOGS', icon: <FileText size={14} />, label: 'Logs' },
        { id: 'ALERTS', icon: <Bell size={14} />, label: 'Alerts' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'PROFILE', icon: <User size={14} />, label: 'Profile' },
        { id: 'SETTINGS', icon: <Settings size={14} />, label: 'Settings' },
        { id: 'HELP', icon: <HelpCircle size={14} />, label: 'Help' },
      ],
    },
  ];

  return (
    <div style={{
      width: 220, background: '#0a0f1a', borderRight: '1px solid #1a2236',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px 18px', borderBottom: '1px solid #1a2236',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 10px rgba(16,185,129,0.4)',
        }}>
          <Zap size={18} color="#050810" />
        </div>
        <div>
          <div style={{ color: '#e5e7eb', fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>IICPC</div>
          <div style={{ color: '#6b7280', fontSize: 8, letterSpacing: 1 }}>TERMINAL v2.0</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {sections.map(section => (
          <div key={section.title} style={{ marginBottom: 16 }}>
            <div style={{
              padding: '6px 18px', fontSize: 9, color: '#4b5563',
              letterSpacing: 2, fontWeight: 700,
            }}>
              {section.title}
            </div>
            {section.items.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`tab-vertical ${activeView === item.id ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'ALERTS' && (
                  <span style={{
                    marginLeft: 'auto', background: '#ef4444', color: 'white',
                    padding: '2px 6px', borderRadius: 8, fontSize: 9, fontWeight: 700,
                  }}>3</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div style={{
        padding: 14, borderTop: '1px solid #1a2236',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4, #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13, color: 'white',
        }}>
          {user.name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ color: '#e5e7eb', fontSize: 11, fontWeight: 700 }}>{user.name}</div>
          <div style={{ color: '#6b7280', fontSize: 9 }}>{user.email}</div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: 'none', border: 'none', color: '#ef4444',
            cursor: 'pointer', padding: 6,
          }}
          title="Logout"
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('OVERVIEW');
  const [data, setData] = useState([]);
  const [previousData, setPreviousData] = useState({});
  const [time, setTime] = useState(new Date());
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState(0);
  const [chartMode, setChartMode] = useState('AVG');
  const [history, setHistory] = useState([]);
  const [throughputHistory, setThroughputHistory] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'New record latency: 116µs', time: '2m ago' },
    { id: 2, type: 'warning', message: 'thread_007 high latency detected', time: '5m ago' },
    { id: 3, type: 'info', message: 'System backup completed', time: '12m ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 23, memory: 67, network: 89, latency: 0,
  });
  const [logs, setLogs] = useState([]);

  // FETCH DATA
  useEffect(() => {
    if (!user) return;

    const fetchData = () => {
      fetch('http://localhost:3000/api/leaderboard')
        .then(r => r.json())
        .then(d => updateData(d))
        .catch(() => setConnectionStatus('error'));
    };

    fetchData();
    socket.on('connect', () => setConnectionStatus('connected'));
    socket.on('disconnect', () => setConnectionStatus('disconnected'));
    socket.on('leaderboard_update', (d) => { if (!isPaused) updateData(d); });

    return () => {
      socket.off('leaderboard_update');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [isPaused, user]);

  const updateData = useCallback((newData) => {
    setData(prevData => {
      const prevMap = {};
      prevData.forEach((b, i) => { prevMap[b.bot_id] = { rank: i, latency: b.avg_latency }; });
      setPreviousData(prevMap);
      return newData;
    });
    if (newData[0]) {
      setHistory(prev => [...prev.slice(-29), { time: Date.now(), value: newData[0].best_latency }]);
    }
    const total = newData.reduce((s, b) => s + Number(b.total_orders), 0);
    setThroughputHistory(prev => [...prev.slice(-29), { time: Date.now(), value: total }]);

    // Add log entry
    setLogs(prev => [{
      time: new Date(),
      level: 'INFO',
      message: `Received update with ${newData.length} bots`,
    }, ...prev.slice(0, 49)]);
  }, []);

  // CLOCK
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setSessionTime(Math.floor((Date.now() - sessionStart) / 1000));
      setSystemMetrics(prev => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(30, Math.min(99, prev.network + (Math.random() - 0.5) * 8)),
        latency: data[0]?.avg_latency || 0,
      }));
    }, 1000);
    return () => clearInterval(t);
  }, [sessionStart, data]);

  // SHOW LOGIN IF NOT AUTHENTICATED
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050810' }}>
      {/* SIDEBAR */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR */}
        <TopBar 
          time={time} 
          sessionTime={sessionTime}
          connectionStatus={connectionStatus}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          activeView={activeView}
        />

        {/* TICKER */}
        <TickerTape data={data} />

        {/* VIEWS */}
        <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
          {activeView === 'OVERVIEW' && (
            <OverviewView 
              data={data} previousData={previousData} chartMode={chartMode} 
              setChartMode={setChartMode} history={history} 
              throughputHistory={throughputHistory} systemMetrics={systemMetrics}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              filterTier={filterTier} setFilterTier={setFilterTier}
              selectedBot={selectedBot} setSelectedBot={setSelectedBot}
            />
          )}
          {activeView === 'ANALYTICS' && <AnalyticsView data={data} history={history} />}
          {activeView === 'BOTS' && <BotsView data={data} />}
          {activeView === 'ORDERS' && <OrdersView data={data} />}
          {activeView === 'NETWORK' && <NetworkView systemMetrics={systemMetrics} />}
          {activeView === 'LOGS' && <LogsView logs={logs} />}
          {activeView === 'ALERTS' && <AlertsView notifications={notifications} />}
          {activeView === 'PROFILE' && <ProfileView user={user} />}
          {activeView === 'SETTINGS' && <SettingsView soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} theme={theme} setTheme={setTheme} />}
          {activeView === 'HELP' && <HelpView />}
        </div>

        {/* STATUS BAR */}
        <StatusBar 
          data={data} connectionStatus={connectionStatus} 
          systemMetrics={systemMetrics} 
        />
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel 
            notifications={notifications} 
            onClose={() => setShowNotifications(false)} 
          />
        )}
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TOP BAR
// ═══════════════════════════════════════════════════════════
function TopBar({ time, sessionTime, connectionStatus, isPaused, setIsPaused, notifications, showNotifications, setShowNotifications, showSettings, setShowSettings, soundEnabled, setSoundEnabled, activeView }) {
  return (
    <div style={{
      background: '#0a0f1a', borderBottom: '1px solid #1a2236',
      padding: '0 16px', height: 48, display: 'flex', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 14, color: '#e5e7eb', fontWeight: 700, letterSpacing: 2 }}>
          {activeView}
        </div>
        <div style={{ fontSize: 9, color: '#6b7280' }}>
          {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button className="btn" onClick={() => setIsPaused(!isPaused)} style={{ padding: 8 }}>
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>
        <button className="btn" onClick={() => setSoundEnabled(!soundEnabled)} style={{ padding: 8 }}>
          {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
        </button>
        <button className="btn" onClick={() => setShowNotifications(!showNotifications)} style={{ padding: 8, position: 'relative' }}>
          <Bell size={12} />
          {notifications.length > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2, width: 6, height: 6,
              background: '#ef4444', borderRadius: '50%',
            }} />
          )}
        </button>
        <div style={{ borderLeft: '1px solid #1a2236', height: 24, margin: '0 8px' }} />

        <div style={{ padding: '0 12px' }}>
          <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1 }}>SESSION</div>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>{formatTime(sessionTime)}</div>
        </div>
        <div style={{ padding: '0 12px' }}>
          <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1 }}>TIME</div>
          <div style={{ fontSize: 12, color: '#e5e7eb', fontWeight: 700 }}>{time.toLocaleTimeString()}</div>
        </div>
        <div style={{ padding: '0 12px' }}>
          <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1 }}>STATUS</div>
          <div style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <span className={`status-dot status-${connectionStatus === 'connected' ? 'online' : 'error'}`} />
            <span style={{ color: connectionStatus === 'connected' ? '#10b981' : '#ef4444' }}>
              {connectionStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TICKER TAPE
// ═══════════════════════════════════════════════════════════
function TickerTape({ data }) {
  if (data.length === 0) return null;
  return (
    <div className="ticker-tape">
      <div className="ticker-content">
        {[...data, ...data, ...data].map((bot, i) => {
          const tier = getLatencyTier(bot.avg_latency);
          return (
            <span key={i} className="ticker-item">
              <span style={{ color: '#6b7280' }}>{bot.bot_id.toUpperCase()}</span>
              <span style={{ color: tier.color, margin: '0 8px', fontWeight: 700 }}>{bot.avg_latency}µs</span>
              <span style={{ color: tier.color, fontSize: 9 }}>{tier.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW VIEW
// ═══════════════════════════════════════════════════════════
function OverviewView({ data, previousData, chartMode, setChartMode, history, throughputHistory, systemMetrics, searchQuery, setSearchQuery, filterTier, setFilterTier, selectedBot, setSelectedBot }) {
  const fastest = data[0];
  const slowest = data[data.length - 1];
  const median = data[Math.floor(data.length / 2)];
  const avgFleet = data.length ? Math.round(data.reduce((s, b) => s + Number(b.avg_latency), 0) / data.length) : 0;
  const totalOrders = data.reduce((s, b) => s + Number(b.total_orders), 0);
  const spread = slowest && fastest ? slowest.avg_latency - fastest.avg_latency : 0;
  const filteredData = data.filter(bot => {
    const matchesSearch = bot.bot_id.toLowerCase().includes(searchQuery.toLowerCase());
    const tier = getLatencyTier(bot.avg_latency);
    return matchesSearch && (filterTier === 'ALL' || tier.label === filterTier);
  });
  const sortedAsc = [...filteredData].sort((a, b) => a.avg_latency - b.avg_latency);
  const sortedDesc = [...filteredData].sort((a, b) => b.avg_latency - a.avg_latency);

  return (
    <div className="grid-main">
      {/* LEFT — BOT FLEET */}
      <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header">
          <span>BOT FLEET</span>
          <span className="label-tag" style={{ background: '#1e3a8a', color: '#60a5fa' }}>
            {data.length} ACTIVE
          </span>
        </div>

        <div style={{ padding: 10, borderBottom: '1px solid #1a2236' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#050810', border: '1px solid #1a2236', padding: '6px 10px' }}>
            <Search size={12} color="#6b7280" style={{ marginRight: 8 }} />
            <input
              type="text" placeholder="Search bots..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none',
                color: '#e5e7eb', fontFamily: 'JetBrains Mono', fontSize: 11, width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #1a2236', padding: 8, gap: 4 }}>
          {['ALL', 'ELITE', 'FAST', 'SLOW'].map(tier => (
            <button key={tier}
              className={`btn ${filterTier === tier ? 'btn-active' : ''}`}
              onClick={() => setFilterTier(tier)}
              style={{ fontSize: 9, padding: '4px 8px', flex: 1 }}>{tier}</button>
          ))}
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <AnimatePresence>
            {sortedAsc.map((bot, i) => {
              const tier = getLatencyTier(bot.avg_latency);
              const max = Math.max(...data.map(b => b.avg_latency));
              const width = (bot.avg_latency / max) * 100;
              return (
                <motion.div key={bot.bot_id} layout
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedBot(bot.bot_id)} className="data-row"
                  style={{ padding: 12, borderBottom: '1px solid #131b2c',
                    borderLeft: selectedBot === bot.bot_id ? '2px solid #10b981' : '2px solid transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#6b7280', fontSize: 9 }}>#{i + 1}</span>
                      <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 11 }}>T_{bot.bot_id.replace('thread_', '')}</span>
                    </div>
                    <span style={{ color: tier.color, fontWeight: 700, fontSize: 12 }}>{bot.avg_latency}µs</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 6 }}>
                    <motion.div className="progress-fill" initial={{ width: 0 }}
                      animate={{ width: `${width}%` }} style={{ background: tier.color }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                    <span style={{ color: '#6b7280' }}>{bot.total_orders} orders</span>
                    <span style={{ color: tier.color, fontWeight: 700, letterSpacing: 1 }}>{tier.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* MIDDLE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="grid-metrics">
          <MetricCard label="FASTEST" value={`${fastest?.best_latency || 0}µs`} sub={fastest?.bot_id} color="#10b981" icon={<Award size={12} />} trend="+2.3%" />
          <MetricCard label="FLEET AVG" value={`${avgFleet}µs`} sub="all bots" color="#3b82f6" icon={<Activity size={12} />} trend="-0.8%" />
          <MetricCard label="MEDIAN" value={`${median?.avg_latency || 0}µs`} sub="50th pct" color="#a78bfa" icon={<Target size={12} />} trend="+1.1%" />
          <MetricCard label="SLOWEST" value={`${slowest?.avg_latency || 0}µs`} sub={slowest?.bot_id} color="#ef4444" icon={<TrendingDown size={12} />} trend="-1.5%" />
          <MetricCard label="ORDERS" value={formatNumber(totalOrders)} sub="total" color="#06b6d4" icon={<Zap size={12} />} trend="+12%" />
          <MetricCard label="SPREAD" value={`${spread}µs`} sub="range" color="#f59e0b" icon={<Maximize2 size={12} />} trend="-3.2%" />
        </div>

        <div className="panel" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#6b7280', fontSize: 10, letterSpacing: 1.5 }}>LATENCY DISTRIBUTION</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['AVG', 'BEST', 'WORST'].map(m => (
                <button key={m} className={`btn ${chartMode === m ? 'btn-active' : ''}`}
                  onClick={() => setChartMode(m)}>{m}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1a2236" vertical={false} />
              <XAxis dataKey="bot_id" stroke="#6b7280" style={{ fontSize: 9 }} 
                tickFormatter={v => 'T' + v.replace('thread_', '')} />
              <YAxis stroke="#6b7280" style={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ background: '#050810', border: '1px solid #1a2236', fontSize: 11 }} />
              <Bar dataKey={chartMode === 'AVG' ? 'avg_latency' : chartMode === 'BEST' ? 'best_latency' : 'worst_latency'} radius={[4, 4, 0, 0]}>
                {data.map((entry, i) => (<Cell key={i} fill={getLatencyColor(entry.avg_latency)} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header"><span>EXECUTION DATA — REAL-TIME</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 80px 80px 80px 80px',
            padding: '8px 14px', borderBottom: '1px solid #1a2236',
            fontSize: 9, color: '#6b7280', letterSpacing: 1, fontWeight: 600 }}>
            <div>#</div><div>BOT ID</div>
            <div style={{ textAlign: 'right' }}>AVG</div>
            <div style={{ textAlign: 'right' }}>BEST</div>
            <div style={{ textAlign: 'right' }}>WORST</div>
            <div style={{ textAlign: 'right' }}>ORDERS</div>
            <div style={{ textAlign: 'right' }}>TIER</div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {sortedAsc.map((bot, i) => {
              const tier = getLatencyTier(bot.avg_latency);
              const prev = previousData[bot.bot_id];
              const rankChange = prev ? prev.rank - i : 0;
              return (
                <div key={bot.bot_id} className="data-row"
                  style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 80px 80px 80px 80px',
                    padding: '10px 14px', borderBottom: '1px solid #131b2c', fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#6b7280', fontWeight: 700 }}>{i + 1}</span>
                    {rankChange > 0 && <ChevronUp size={10} color="#10b981" />}
                    {rankChange < 0 && <ChevronDown size={10} color="#ef4444" />}
                  </div>
                  <div style={{ color: '#e5e7eb', fontWeight: 600 }}>{bot.bot_id}</div>
                  <div style={{ textAlign: 'right', color: tier.color, fontWeight: 700 }}>{bot.avg_latency}µs</div>
                  <div style={{ textAlign: 'right', color: '#10b981' }}>{bot.best_latency}µs</div>
                  <div style={{ textAlign: 'right', color: '#ef4444' }}>{bot.worst_latency}µs</div>
                  <div style={{ textAlign: 'right', color: '#9ca3af' }}>{bot.total_orders}</div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="label-tag" style={{ background: tier.color + '22', color: tier.color }}>{tier.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="panel">
          <div className="panel-header"><span>LEADERBOARD</span><span className="label-tag label-live">LIVE</span></div>
          {sortedDesc.slice(0, 3).map(bot => (
            <div key={bot.bot_id} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '8px 14px', borderBottom: '1px solid #131b2c', background: 'rgba(239,68,68,0.05)' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{bot.avg_latency}µs</span>
              <span style={{ color: '#9ca3af', fontSize: 11 }}>T_{bot.bot_id.replace('thread_', '')}</span>
            </div>
          ))}
          <div style={{ padding: '8px 14px', textAlign: 'center', borderTop: '1px solid #1a2236',
            borderBottom: '1px solid #1a2236', background: '#050810', fontSize: 10, color: '#6b7280' }}>
            SPREAD — <span style={{ color: '#f59e0b', fontWeight: 700 }}>{spread}µs</span>
          </div>
          {sortedAsc.slice(0, 3).map(bot => (
            <div key={bot.bot_id} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '8px 14px', borderBottom: '1px solid #131b2c', background: 'rgba(16,185,129,0.05)' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{bot.avg_latency}µs</span>
              <span style={{ color: '#9ca3af', fontSize: 11 }}>T_{bot.bot_id.replace('thread_', '')}</span>
            </div>
          ))}
        </div>

        <div className="panel" style={{ padding: 12 }}>
          <div style={{ color: '#6b7280', fontSize: 10, letterSpacing: 1.5, marginBottom: 8 }}>FASTEST — TIMELINE</div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={history}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient></defs>
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#g1)" />
              <Tooltip contentStyle={{ background: '#050810', border: '1px solid #1a2236', fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ padding: 12 }}>
          <div style={{ color: '#6b7280', fontSize: 10, letterSpacing: 1.5, marginBottom: 10 }}>SYSTEM RESOURCES</div>
          <SystemMeter label="CPU" value={systemMetrics.cpu} icon={<Cpu size={11} />} color="#06b6d4" />
          <SystemMeter label="MEMORY" value={systemMetrics.memory} icon={<Database size={11} />} color="#a78bfa" />
          <SystemMeter label="NETWORK" value={systemMetrics.network} icon={<Wifi size={11} />} color="#10b981" />
        </div>

        <div className="panel" style={{ padding: 12, flex: 1 }}>
          <div style={{ color: '#6b7280', fontSize: 10, letterSpacing: 1.5, marginBottom: 8 }}>THROUGHPUT</div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={throughputHistory}>
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Tooltip contentStyle={{ background: '#050810', border: '1px solid #1a2236', fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VIEW COMPONENTS
// ═══════════════════════════════════════════════════════════
function AnalyticsView({ data, history }) {
  const radarData = data.slice(0, 6).map(b => ({
    bot: b.bot_id.replace('thread_', 'T'),
    avg: 100 - (b.avg_latency / 10),
    best: 100 - (b.best_latency / 10),
  }));

  return (
    <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div className="panel" style={{ padding: 16 }}>
        <div className="panel-header" style={{ padding: '0 0 10px 0' }}>PERFORMANCE RADAR</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1a2236" />
            <PolarAngleAxis dataKey="bot" stroke="#6b7280" style={{ fontSize: 10 }} />
            <Radar name="Avg" dataKey="avg" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            <Radar name="Best" dataKey="best" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel" style={{ padding: 16 }}>
        <div className="panel-header" style={{ padding: '0 0 10px 0' }}>LATENCY DISTRIBUTION</div>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="2 2" stroke="#1a2236" />
            <XAxis dataKey="avg_latency" name="avg" stroke="#6b7280" />
            <YAxis dataKey="best_latency" name="best" stroke="#6b7280" />
            <Tooltip contentStyle={{ background: '#050810', border: '1px solid #1a2236' }} />
            <Scatter name="Bots" data={data} fill="#10b981" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="panel" style={{ padding: 16, gridColumn: 'span 2' }}>
        <div className="panel-header" style={{ padding: '0 0 10px 0' }}>HISTORICAL TIMELINE</div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="#1a2236" />
            <XAxis stroke="#6b7280" style={{ fontSize: 10 }} />
            <YAxis stroke="#6b7280" style={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#050810', border: '1px solid #1a2236' }} />
            <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#ag)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BotsView({ data }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#e5e7eb', fontSize: 16 }}>Bot Manager</h2>
        <button className="btn btn-primary"><Plus size={12} /> ADD BOT</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {data.map(bot => {
          const tier = getLatencyTier(bot.avg_latency);
          return (
            <div key={bot.bot_id} className="panel" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#e5e7eb', fontWeight: 700, fontSize: 14 }}>{bot.bot_id}</div>
                  <div style={{ color: '#6b7280', fontSize: 10 }}>ID: {bot.bot_id}</div>
                </div>
                <span className="label-tag" style={{ background: tier.color + '22', color: tier.color }}>{tier.label}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div><div style={{ fontSize: 9, color: '#6b7280' }}>AVG</div><div style={{ color: tier.color, fontWeight: 700 }}>{bot.avg_latency}µs</div></div>
                <div><div style={{ fontSize: 9, color: '#6b7280' }}>BEST</div><div style={{ color: '#10b981', fontWeight: 700 }}>{bot.best_latency}µs</div></div>
                <div><div style={{ fontSize: 9, color: '#6b7280' }}>WORST</div><div style={{ color: '#ef4444', fontWeight: 700 }}>{bot.worst_latency}µs</div></div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 4 }}>
                <button className="btn" style={{ flex: 1 }}>VIEW</button>
                <button className="btn" style={{ flex: 1 }}>CONFIG</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersView({ data }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>Order Book</h2>
      <div className="panel" style={{ padding: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a2236' }}>
              <th style={{ padding: 10, textAlign: 'left', color: '#6b7280', fontSize: 10 }}>ORDER ID</th>
              <th style={{ padding: 10, textAlign: 'left', color: '#6b7280', fontSize: 10 }}>BOT</th>
              <th style={{ padding: 10, textAlign: 'right', color: '#6b7280', fontSize: 10 }}>LATENCY</th>
              <th style={{ padding: 10, textAlign: 'right', color: '#6b7280', fontSize: 10 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bot, i) => (
              <tr key={i} className="data-row" style={{ borderBottom: '1px solid #131b2c' }}>
                <td style={{ padding: 10, color: '#06b6d4' }}>#HFT_{1000 + i}</td>
                <td style={{ padding: 10, color: '#e5e7eb' }}>{bot.bot_id}</td>
                <td style={{ padding: 10, textAlign: 'right', color: '#10b981' }}>{bot.avg_latency}µs</td>
                <td style={{ padding: 10, textAlign: 'right' }}>
                  <span className="label-tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>FILLED</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NetworkView({ systemMetrics }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>Network Status</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { name: 'Kafka Cluster', status: 'Healthy', value: '99.9%', color: '#10b981' },
          { name: 'TimescaleDB', status: 'Healthy', value: '100%', color: '#10b981' },
          { name: 'WebSocket', status: 'Healthy', value: '99.8%', color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="panel" style={{ padding: 16 }}>
            <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>{s.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="status-dot status-online" />
              <span style={{ color: s.color, fontSize: 11 }}>{s.status}</span>
            </div>
            <div style={{ color: '#06b6d4', fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: '#6b7280', fontSize: 10 }}>Uptime (30d)</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogsView({ logs }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>System Logs</h2>
      <div className="panel" style={{ padding: 16, maxHeight: '70vh', overflowY: 'auto' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #131b2c', display: 'flex', gap: 12, fontSize: 11 }}>
            <span style={{ color: '#6b7280', minWidth: 80 }}>{log.time.toLocaleTimeString()}</span>
            <span className="label-tag" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}>{log.level}</span>
            <span style={{ color: '#e5e7eb' }}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsView({ notifications }) {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>Alerts & Notifications</h2>
      {notifications.map(notif => (
        <div key={notif.id} className="panel" style={{ padding: 14, marginBottom: 8, display: 'flex', gap: 12 }}>
          <div style={{ color: notif.type === 'success' ? '#10b981' : notif.type === 'warning' ? '#f59e0b' : '#06b6d4' }}>
            {notif.type === 'success' ? <CheckCircle2 /> : notif.type === 'warning' ? <AlertTriangle /> : <Info />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#e5e7eb', fontWeight: 600 }}>{notif.message}</div>
            <div style={{ color: '#6b7280', fontSize: 10 }}>{notif.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileView({ user }) {
  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>User Profile</h2>
      <div className="panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 32, color: 'white' }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 700 }}>{user.name}</div>
            <div style={{ color: '#6b7280', fontSize: 12 }}>{user.email}</div>
            <span className="label-tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', marginTop: 6, display: 'inline-block' }}>VERIFIED</span>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div><div style={{ color: '#6b7280', fontSize: 10 }}>USER ID</div><div style={{ color: '#e5e7eb' }}>USR_{Math.floor(Math.random() * 100000)}</div></div>
          <div><div style={{ color: '#6b7280', fontSize: 10 }}>ROLE</div><div style={{ color: '#e5e7eb' }}>Trader / Administrator</div></div>
          <div><div style={{ color: '#6b7280', fontSize: 10 }}>JOINED</div><div style={{ color: '#e5e7eb' }}>March 15, 2026</div></div>
          <div><div style={{ color: '#6b7280', fontSize: 10 }}>LAST LOGIN</div><div style={{ color: '#e5e7eb' }}>Just now</div></div>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ soundEnabled, setSoundEnabled, theme, setTheme }) {
  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>Settings</h2>
      <div className="panel" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
          <div><div style={{ color: '#e5e7eb' }}>Sound Notifications</div><div style={{ color: '#6b7280', fontSize: 10 }}>Play sound on alerts</div></div>
          <button className={`btn ${soundEnabled ? 'btn-active' : ''}`} onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #1a2236' }}>
          <div><div style={{ color: '#e5e7eb' }}>Theme</div><div style={{ color: '#6b7280', fontSize: 10 }}>UI color theme</div></div>
          <button className="btn"> {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />} DARK</button>
        </div>
      </div>
    </div>
  );
}

function HelpView() {
  return (
    <div style={{ padding: 16, maxWidth: 800 }}>
      <h2 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>Help & Documentation</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { icon: <BookOpen />, title: 'Documentation', desc: 'Read the full API docs' },
          { icon: <MessageSquare />, title: 'Support Chat', desc: '24/7 live support' },
          { icon: <Mail />, title: 'Email Support', desc: 'support@iicpc.com' },
          { icon: <Globe />, title: 'Community', desc: 'Join our Discord' },
        ].map((item, i) => (
          <div key={i} className="panel" style={{ padding: 16, cursor: 'pointer' }}>
            <div style={{ color: '#10b981', marginBottom: 8 }}>{item.icon}</div>
            <div style={{ color: '#e5e7eb', fontWeight: 700 }}>{item.title}</div>
            <div style={{ color: '#6b7280', fontSize: 11 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════
function MetricCard({ label, value, sub, color, icon, trend }) {
  const isUp = trend?.startsWith('+');
  const isDown = trend?.startsWith('-');
  return (
    <motion.div whileHover={{ y: -2 }} style={{
      background: '#0f1623', border: '1px solid #1a2236',
      padding: 12, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1, fontWeight: 600 }}>{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div style={{ fontSize: 22, color, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
        <span style={{ color: '#6b7280' }}>{sub}</span>
        {trend && <span style={{ color: isUp ? '#10b981' : isDown ? '#ef4444' : '#06b6d4', fontWeight: 600 }}>{trend}</span>}
      </div>
    </motion.div>
  );
}

function SystemMeter({ label, value, icon, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#9ca3af', fontSize: 10, display: 'flex', alignItems: 'center', gap: 5 }}>{icon}{label}</span>
        <span style={{ color, fontSize: 11, fontWeight: 700 }}>{Math.round(value)}%</span>
      </div>
      <div className="progress-bar">
        <motion.div className="progress-fill" animate={{ width: `${value}%` }} style={{ background: color }} />
      </div>
    </div>
  );
}

function StatusBar({ data, connectionStatus, systemMetrics }) {
  return (
    <div style={{ background: '#0a0f1a', borderTop: '1px solid #1a2236',
      padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 24,
      fontSize: 10, color: '#6b7280' }}>
      <span><Server size={11} style={{ display: 'inline', marginRight: 4 }} /> KAFKA: <span style={{ color: '#10b981', fontWeight: 700 }}>CONNECTED</span></span>
      <span><Database size={11} style={{ display: 'inline', marginRight: 4 }} /> DB: <span style={{ color: '#10b981', fontWeight: 700 }}>ONLINE</span></span>
      <span><Wifi size={11} style={{ display: 'inline', marginRight: 4 }} /> WS: <span style={{ color: '#10b981', fontWeight: 700 }}>{connectionStatus.toUpperCase()}</span></span>
      <div style={{ flex: 1 }} />
      <span>BOTS: <span style={{ color: '#06b6d4', fontWeight: 700 }}>{data.length}</span></span>
      <span>LATENCY: <span style={{ color: '#f59e0b', fontWeight: 700 }}>{systemMetrics.latency}µs</span></span>
      <span style={{ color: '#10b981', fontWeight: 700 }}>v2.0.1</span>
    </div>
  );
}

function NotificationsPanel({ notifications, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="modal"
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ color: '#e5e7eb' }}>Notifications</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
        {notifications.map(n => (
          <div key={n.id} style={{ padding: 12, borderBottom: '1px solid #1a2236', marginBottom: 8 }}>
            <div style={{ color: '#e5e7eb', fontSize: 12 }}>{n.message}</div>
            <div style={{ color: '#6b7280', fontSize: 10 }}>{n.time}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function SettingsModal({ onClose }) {
  return <NotificationsPanel notifications={[]} onClose={onClose} />;
}