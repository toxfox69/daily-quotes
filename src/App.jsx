import React, { useState, useEffect, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import './App.css';

/* ─── Quote Database (30+ quotes, 5 categories) ─── */
const QUOTES = [
  // Motivation
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Motivation" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Motivation" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Motivation" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Motivation" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "Motivation" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Motivation" },

  // Philosophy
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Philosophy" },
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "Philosophy" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Philosophy" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", category: "Philosophy" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "Philosophy" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle", category: "Philosophy" },
  { text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.", author: "Jean-Paul Sartre", category: "Philosophy" },

  // Science
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein", category: "Science" },
  { text: "The important thing is to not stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein", category: "Science" },
  { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie", category: "Science" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan", category: "Science" },
  { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson", category: "Science" },
  { text: "If I have seen further it is by standing on the shoulders of giants.", author: "Isaac Newton", category: "Science" },
  { text: "An expert is a person who has made all the mistakes that can be made in a very narrow field.", author: "Niels Bohr", category: "Science" },

  // Humor
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "Humor" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Humor" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", category: "Humor" },
  { text: "Behind every great man is a woman rolling her eyes.", author: "Jim Carrey", category: "Humor" },
  { text: "People say nothing is impossible, but I do nothing every day.", author: "A.A. Milne", category: "Humor" },
  { text: "Light travels faster than sound. This is why some people appear bright until you hear them speak.", author: "Alan Dundes", category: "Humor" },

  // Wisdom
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Wisdom" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Wisdom" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Wisdom" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Wisdom" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Wisdom" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "Wisdom" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Wisdom" },
];

/* ─── Theme Definitions ─── */
const THEMES = {
  dark: {
    label: 'Dark',
    icon: '\u{1F30C}',
    colors: {
      '--bg-primary': '#1a1a2e',
      '--bg-secondary': '#0f3460',
      '--accent': '#00d4ff',
      '--accent-alt': '#00a8cc',
      '--text-primary': '#ffffff',
      '--text-muted': '#a0a0b8',
      '--card-bg': 'rgba(255,255,255,0.05)',
      '--card-border': 'rgba(0,212,255,0.15)',
      '--overlay-bg': 'rgba(10,10,30,0.95)',
      '--btn-text': '#0a0a1e',
      '--shadow-color': 'rgba(0,212,255,0.15)',
    },
  },
  light: {
    label: 'Light',
    icon: '\u2600\uFE0F',
    colors: {
      '--bg-primary': '#f0f2f5',
      '--bg-secondary': '#dce1e8',
      '--accent': '#2563eb',
      '--accent-alt': '#1d4ed8',
      '--text-primary': '#1a1a2e',
      '--text-muted': '#6b7280',
      '--card-bg': 'rgba(255,255,255,0.85)',
      '--card-border': 'rgba(37,99,235,0.2)',
      '--overlay-bg': 'rgba(240,242,245,0.97)',
      '--btn-text': '#ffffff',
      '--shadow-color': 'rgba(37,99,235,0.12)',
    },
  },
  amoled: {
    label: 'AMOLED',
    icon: '\u{1F5A4}',
    colors: {
      '--bg-primary': '#000000',
      '--bg-secondary': '#050505',
      '--accent': '#00ff88',
      '--accent-alt': '#00d4ff',
      '--text-primary': '#e8e8e8',
      '--text-muted': '#707070',
      '--card-bg': 'rgba(255,255,255,0.03)',
      '--card-border': 'rgba(0,255,136,0.15)',
      '--overlay-bg': 'rgba(0,0,0,0.98)',
      '--btn-text': '#000000',
      '--shadow-color': 'rgba(0,255,136,0.1)',
    },
  },
  nature: {
    label: 'Nature',
    icon: '\u{1F33F}',
    colors: {
      '--bg-primary': '#1a2e1a',
      '--bg-secondary': '#0f2e1a',
      '--accent': '#d4a017',
      '--accent-alt': '#c49000',
      '--text-primary': '#e8e4d8',
      '--text-muted': '#a09880',
      '--card-bg': 'rgba(255,255,255,0.04)',
      '--card-border': 'rgba(212,160,23,0.2)',
      '--overlay-bg': 'rgba(18,30,18,0.97)',
      '--btn-text': '#1a1a0e',
      '--shadow-color': 'rgba(212,160,23,0.12)',
    },
  },
};

const CATEGORIES = ['All', 'Motivation', 'Philosophy', 'Science', 'Humor', 'Wisdom'];

const CATEGORY_COLORS = {
  Motivation: '#ff6b6b',
  Philosophy: '#a78bfa',
  Science: '#34d399',
  Humor: '#fbbf24',
  Wisdom: '#60a5fa',
};

/* ─── Helper: pad number to 2 digits ─── */
const pad = (n) => String(n).padStart(2, '0');

/* ─── Settings Modal Component ─── */
function SettingsModal({
  isOpen,
  onClose,
  theme,
  setTheme,
  notifEnabled,
  setNotifEnabled,
  notifHour,
  setNotifHour,
  notifMinute,
  setNotifMinute,
  onSaveNotif,
}) {
  if (!isOpen) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close settings">
            &times;
          </button>
        </div>

        {/* Theme Section */}
        <section className="settings-section">
          <h3 className="settings-label">Theme</h3>
          <div className="theme-grid">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                className={`theme-swatch ${theme === key ? 'active' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${t.colors['--bg-primary']}, ${t.colors['--bg-secondary']})`,
                  borderColor: theme === key ? t.colors['--accent'] : 'transparent',
                }}
                onClick={() => setTheme(key)}
              >
                <span className="swatch-icon">{t.icon}</span>
                <span className="swatch-label" style={{ color: t.colors['--text-primary'] }}>
                  {t.label}
                </span>
                <span
                  className="swatch-accent"
                  style={{ background: t.colors['--accent'] }}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Notification Section */}
        <section className="settings-section">
          <h3 className="settings-label">Notifications</h3>

          <div className="notif-toggle-row">
            <span className="notif-toggle-label">Daily Quote Reminder</span>
            <button
              className={`toggle-switch ${notifEnabled ? 'on' : ''}`}
              onClick={() => setNotifEnabled(!notifEnabled)}
              role="switch"
              aria-checked={notifEnabled}
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          {notifEnabled && (
            <div className="time-picker-section">
              <span className="time-picker-label">Notification Time</span>
              <div className="time-picker">
                <div className="time-select-group">
                  <label className="time-select-label">Hour</label>
                  <select
                    className="time-select"
                    value={notifHour}
                    onChange={(e) => setNotifHour(Number(e.target.value))}
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {pad(h)}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="time-colon">:</span>
                <div className="time-select-group">
                  <label className="time-select-label">Min</label>
                  <select
                    className="time-select"
                    value={notifMinute}
                    onChange={(e) => setNotifMinute(Number(e.target.value))}
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {pad(m)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="btn btn-small btn-accent" onClick={onSaveNotif}>
                Save &amp; Schedule
              </button>
            </div>
          )}
        </section>

        <div className="modal-footer">
          <p>Daily Quotes v2.0 &middot; Powered by ENERGENAI</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Theme
  const [theme, setThemeState] = useState(() => localStorage.getItem('dq_theme') || 'dark');

  // Notifications
  const [notifEnabled, setNotifEnabledState] = useState(
    () => localStorage.getItem('dq_notif_enabled') !== 'false'
  );
  const [notifHour, setNotifHour] = useState(
    () => Number(localStorage.getItem('dq_notif_hour') ?? 9)
  );
  const [notifMinute, setNotifMinute] = useState(
    () => Number(localStorage.getItem('dq_notif_minute') ?? 0)
  );

  /* ─── Apply theme to :root ─── */
  const applyTheme = useCallback((themeKey) => {
    const t = THEMES[themeKey];
    if (!t) return;
    const root = document.documentElement;
    Object.entries(t.colors).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });
  }, []);

  const setTheme = useCallback(
    (key) => {
      setThemeState(key);
      localStorage.setItem('dq_theme', key);
      applyTheme(key);
    },
    [applyTheme]
  );

  /* ─── Notification helpers ─── */
  const setNotifEnabled = useCallback((val) => {
    setNotifEnabledState(val);
    localStorage.setItem('dq_notif_enabled', String(val));
    if (!val) {
      cancelNotification();
    }
  }, []);

  const cancelNotification = async () => {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    } catch (err) {
      console.log('Could not cancel notification:', err);
    }
  };

  const scheduleNotification = async (hour, minute) => {
    try {
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Daily Quote Time',
            body: 'Your daily dose of inspiration is ready!',
            schedule: { on: { hour, minute } },
            sound: null,
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: THEMES[theme]?.colors['--accent'] || '#00d4ff',
          },
        ],
      });
      console.log(`Notification scheduled for ${pad(hour)}:${pad(minute)}`);
    } catch (err) {
      console.log('Could not schedule notification:', err);
    }
  };

  const handleSaveNotif = () => {
    localStorage.setItem('dq_notif_hour', String(notifHour));
    localStorage.setItem('dq_notif_minute', String(notifMinute));
    scheduleNotification(notifHour, notifMinute);
  };

  /* ─── Quote logic ─── */
  const filteredQuotes =
    activeCategory === 'All'
      ? QUOTES
      : QUOTES.filter((q) => q.category === activeCategory);

  const loadDailyQuote = useCallback(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('lastQuoteDate');

    if (storedDate !== today) {
      const idx = Math.floor(Math.random() * QUOTES.length);
      const quote = QUOTES[idx];
      setCurrentQuote(quote);
      localStorage.setItem('lastQuoteDate', today);
      localStorage.setItem('lastQuote', JSON.stringify(quote));
    } else {
      const stored = localStorage.getItem('lastQuote');
      if (stored) {
        setCurrentQuote(JSON.parse(stored));
      } else {
        const idx = Math.floor(Math.random() * QUOTES.length);
        setCurrentQuote(QUOTES[idx]);
      }
    }
  }, []);

  const getNewQuote = () => {
    const pool = filteredQuotes.length > 0 ? filteredQuotes : QUOTES;
    let next;
    do {
      next = pool[Math.floor(Math.random() * pool.length)];
    } while (pool.length > 1 && next.text === currentQuote?.text);
    setCurrentQuote(next);
  };

  /* ─── Init ─── */
  useEffect(() => {
    applyTheme(theme);
    loadDailyQuote();

    // Schedule notification on startup if enabled
    if (notifEnabled) {
      scheduleNotification(notifHour, notifMinute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Swipe to get new quote ─── */
  const [touchStart, setTouchStart] = useState(null);
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 60) getNewQuote();
    setTouchStart(null);
  };

  /* ─── Render ─── */
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div className="logo">
            <span className="logo-symbol">&#10023;</span>
            <h1>Daily Quotes</h1>
            <span className="logo-symbol">&#10023;</span>
          </div>
          <button
            className="settings-btn"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
        <p className="tagline">Energized by ENERGENAI</p>
      </header>

      {/* Category filter pills */}
      <nav className="category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <main
        className="app-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="quote-container">
          {currentQuote ? (
            <>
              <span
                className="category-tag"
                style={{ color: CATEGORY_COLORS[currentQuote.category] || 'var(--accent)' }}
              >
                {currentQuote.category}
              </span>
              <blockquote className="quote-text">
                &ldquo;{currentQuote.text}&rdquo;
              </blockquote>
              <p className="quote-author">&mdash; {currentQuote.author}</p>
            </>
          ) : (
            <p className="loading">Loading your daily quote...</p>
          )}
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={getNewQuote}>
            New Quote
          </button>
        </div>

        <p className="swipe-hint">Swipe or tap for a new quote</p>

        <footer className="app-footer">
          <p>Powered by ENERGENAI &middot; Always learning, always growing.</p>
        </footer>
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        notifEnabled={notifEnabled}
        setNotifEnabled={setNotifEnabled}
        notifHour={notifHour}
        setNotifHour={setNotifHour}
        notifMinute={notifMinute}
        setNotifMinute={setNotifMinute}
        onSaveNotif={handleSaveNotif}
      />
    </div>
  );
}
