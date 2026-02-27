import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import './App.css';

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

export default function App() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadDailyQuote();
    initNotifications();
  }, []);

  const loadDailyQuote = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('lastQuoteDate');
    
    if (stored !== today) {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setCurrentQuote(QUOTES[randomIndex]);
      localStorage.setItem('lastQuoteDate', today);
      localStorage.setItem('lastQuote', JSON.stringify(QUOTES[randomIndex]));
    } else {
      const stored = localStorage.getItem('lastQuote');
      if (stored) {
        setCurrentQuote(JSON.parse(stored));
      }
    }
  };

  const initNotifications = async () => {
    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display === 'granted') {
        setNotificationsEnabled(true);
        scheduleNotification();
      }
    } catch (err) {
      console.log('Notifications not available:', err);
    }
  };

  const scheduleNotification = async () => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: "Daily Quote Time",
            body: "Your daily quote is ready. Open Daily Quotes!",
            schedule: { on: { hour: 9, minute: 0 } },
          },
        ],
      });
    } catch (err) {
      console.log('Could not schedule notification:', err);
    }
  };

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setCurrentQuote(QUOTES[randomIndex]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-symbol">✧</span>
          <h1>Daily Quotes</h1>
          <span className="logo-symbol">✧</span>
        </div>
        <p className="tagline">Energized by ENERGENAI</p>
      </header>

      <main className="app-content">
        <div className="quote-container">
          {currentQuote ? (
            <>
              <blockquote className="quote-text">
                "{currentQuote.text}"
              </blockquote>
              <p className="quote-author">— {currentQuote.author}</p>
            </>
          ) : (
            <p className="loading">Loading your daily quote...</p>
          )}
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={getNewQuote}>
            Get Another Quote
          </button>
          <button 
            className={`btn btn-secondary ${notificationsEnabled ? 'active' : ''}`}
            onClick={() => scheduleNotification()}
            disabled={!notificationsEnabled}
          >
            {notificationsEnabled ? '🔔 Notifications On' : '🔕 Notifications'}
          </button>
        </div>

        <footer className="app-footer">
          <p>Powered by ENERGENAI • Always learning, always growing.</p>
        </footer>
      </main>
    </div>
  );
}