// ==========================================
// FOOTER COMPONENT
// UPGRADED: Global wording + Year + Hover + Responsive
// ==========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { theme } = useSettings();
  const currentYear = new Date().getFullYear();

  // ==========================================
  // THEME COLORS
  // ==========================================
  const textMuted =
    theme === 'dark'
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(0,0,0,0.5)';

  const textFaint =
    theme === 'dark'
      ? 'rgba(255,255,255,0.25)'
      : 'rgba(0,0,0,0.35)';

  const linkHover = '#818cf8';

  const footerBg =
    theme === 'dark'
      ? 'rgba(10,10,18,0.5)'
      : 'rgba(255,255,255,0.5)';

  const footerBorder =
    theme === 'dark'
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.06)';

  // ==========================================
  // NAV LINKS
  // ==========================================
  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/privacy', label: 'Privacy' },
  ];

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <footer
      className="footer"
      style={{
        position: 'relative',
        zIndex: 9999,
        marginTop: '60px',
        padding: '20px 30px',
        background: footerBg,
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderTop: `1px solid ${footerBorder}`,
        width: '100%',
      }}
    >
      <div
        className="footer-container"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* ==========================================
            BRAND
        ========================================== */}
        <div className="footer-brand" style={{ minWidth: 0 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: '16px',
              background:
                'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🌤️ WeatherWise
          </span>
          <p
            style={{
              fontSize: '13px',
              color: textMuted,
              marginTop: '4px',
              marginBottom: 0,
              lineHeight: 1.5,
            }}
          >
            Weather intelligence for Pakistan & the world.
          </p>
        </div>

        {/* ==========================================
            LINKS
        ========================================== */}
        <div
          className="footer-links"
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="footer-link"
              style={{
                color: textMuted,
                fontSize: '13px',
                transition: 'color 0.3s ease',
                textDecoration: 'none',
                fontWeight: 500,
                position: 'relative',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = linkHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = textMuted)
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ==========================================
            COPYRIGHT
        ========================================== */}
        <div
          className="footer-copyright"
          style={{
            fontSize: '12px',
            color: textFaint,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          <span>© {currentYear} WeatherWise</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            Made By
            <span
              style={{
                display: 'inline-block',
                animation: 'heartBeat 1.5s ease-in-out infinite',
                color: '#ef4444',
              }}
            >
              ❤️
            </span>
            Shahzaib Tahir
          </span>
        </div>
      </div>

      {/* ==========================================
          ANIMATIONS + RESPONSIVE
      ========================================== */}
      <style>{`
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.15); }
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #818cf8;
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column !important;
            text-align: center !important;
            gap: 20px !important;
          }
          .footer-brand {
            text-align: center !important;
          }
          .footer-links {
            justify-content: center !important;
            width: 100% !important;
          }
          .footer-copyright {
            justify-content: center !important;
            text-align: center !important;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 16px 20px !important;
            margin-top: 40px !important;
          }
          .footer-links {
            gap: 14px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;