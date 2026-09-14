// ==========================================
// WEATHERWISE REACT - APP
// WITH PAGE TRANSITIONS + OCCLUSION EFFECT
// FIXED: React Router v7 Future Flags (Local Dev)
// ==========================================

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';

// Pages
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Hourly from './pages/Hourly';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Map from './pages/Map';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Components
import PageTransition from './components/PageTransition';

// Styles
import './index.css';

// ==========================================
// THEME WRAPPER
// ==========================================
const ThemeWrapper = ({ children }) => {
  const { theme, accentColor } = useSettings();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty(
      '--primary',
      accentColor
    );
    document.documentElement.style.setProperty(
      '--primary-light',
      accentColor + 'cc'
    );
    document.documentElement.style.setProperty(
      '--primary-dark',
      accentColor + '88'
    );
    document.body.style.background =
      theme === 'dark' ? '#0a0a12' : '#f5f3ff';
  }, [theme, accentColor]);

  return <>{children}</>;
};

// ==========================================
// ANIMATED ROUTES (with Page Transition)
// ==========================================
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <PageTransition variant="occlusion">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/hourly" element={<Hourly />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/map" element={<Map />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

// ==========================================
// APP
// ==========================================
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SettingsProvider>
        <WeatherProvider>
          <ThemeWrapper>
            <AnimatedRoutes />
          </ThemeWrapper>
        </WeatherProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;