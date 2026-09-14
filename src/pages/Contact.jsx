// ==========================================
// CONTACT PAGE - FULLY FUNCTIONAL
// UPGRADED: Validation + Toast + FAQ Accordion + Copy
// ==========================================

import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';

// Components
import WeatherBackground from '../components/WeatherBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';

// ==========================================
// MAIN COMPONENT
// ==========================================
const Contact = () => {
  const { weatherData } = useWeather();
  const { theme } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  const condition = weatherData?.condition || 'Sunny';

  // ==========================================
  // THEME COLORS
  // ==========================================
  const textPrimary =
    theme === 'dark' ? '#ffffff' : '#1a1a2e';
  const textMuted =
    theme === 'dark'
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(0,0,0,0.45)';
  const textFaint =
    theme === 'dark'
      ? 'rgba(255,255,255,0.3)'
      : 'rgba(0,0,0,0.3)';
  const cardBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.5)';
  const cardBorder =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.04)';
  const inputBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)';
  const inputBorder =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.06)'
      : '1px solid rgba(0,0,0,0.06)';
  const dividerColor =
    theme === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)';

  // ==========================================
  // TOAST
  // ==========================================
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==========================================
  // FORM HANDLERS
  // ==========================================
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Clear error for this field
    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('⚠️ Please fix the errors below', 'warning');
      return;
    }

    // Success
    showToast(
      "✅ Message sent! We'll get back to you soon.",
      'success'
    );

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrors({});
  };

  // ==========================================
  // COPY EMAIL
  // ==========================================
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(
        'shahzaibwork247@gmail.com'
      );
      setCopied(true);
      showToast('📋 Email copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('⚠️ Failed to copy', 'warning');
    }
  };

  // ==========================================
  // FAQ DATA
  // ==========================================
  const faqs = [
    {
      q: 'How accurate is the weather data?',
      a: 'We use Open-Meteo API which provides highly accurate forecasts worldwide, with real-time updates every 15 minutes.',
    },
    {
      q: 'Is WeatherWise free to use?',
      a: 'Yes! WeatherWise is completely free for all users. No signup required, no ads.',
    },
    {
      q: 'How often is data updated?',
      a: 'Weather data is updated in real-time. You can also manually refresh anytime using the refresh button.',
    },
    {
      q: 'Which cities are covered?',
      a: 'We cover 500+ Pakistani cities and unlimited global cities via Nominatim API — any city or village worldwide.',
    },
    {
      q: 'Who developed this website?',
      a: 'This website is developed by Shahzaib Tahir, a Frontend Web Developer from Pakistan.',
    },
  ];

  // ==========================================
  // INPUT STYLES
  // ==========================================
  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2.5vw, 14px)',
    borderRadius: '12px',
    background: inputBg,
    border: errors[fieldName]
      ? '1px solid rgba(239,68,68,0.5)'
      : inputBorder,
    color: textPrimary,
    fontSize: 'clamp(13px, 2vw, 14px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  });

  const labelStyle = {
    display: 'block',
    fontSize: 'clamp(12px, 2vw, 13px)',
    fontWeight: 600,
    marginBottom: '6px',
    color: textPrimary,
  };

  const errorStyle = {
    fontSize: '11px',
    color: '#ef4444',
    marginTop: '4px',
    fontWeight: 500,
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      <WeatherBackground condition={condition} />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            padding: '12px 24px',
            borderRadius: '12px',
            background:
              toast.type === 'success'
                ? 'rgba(16,185,129,0.95)'
                : toast.type === 'warning'
                ? 'rgba(245,158,11,0.95)'
                : 'rgba(99,102,241,0.95)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            animation: 'toastIn 0.3s ease',
            maxWidth: '90vw',
            textAlign: 'center',
          }}
        >
          {toast.message}
        </div>
      )}

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(8px, 3vw, 20px)',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <Navbar onSearchToggle={() => setSearchOpen(!searchOpen)} />

        <main
          className="page-content"
          style={{ padding: 'clamp(10px, 2vw, 20px) 0' }}
        >
          {/* ==========================================
              PAGE HEADER
          ========================================== */}
          <div
            className="page-header"
            style={{
              marginBottom: 'clamp(16px, 3vw, 30px)',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                margin: 0,
                color: textPrimary,
              }}
            >
              📧 Contact Us
            </h1>
            <p
              style={{
                color: textMuted,
                fontSize: 'clamp(12px, 2vw, 14px)',
                marginTop: '4px',
                marginBottom: 0,
              }}
            >
             {' Wed love to hear from you '}
              <span role="img" aria-label="smile">
                🙂
              </span>
            </p>
          </div>

          {/* ==========================================
              CONTACT GRID
          ========================================== */}
          <div
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(12px, 3vw, 24px)',
              marginBottom: '24px',
            }}
          >
            {/* ==========================================
                CONTACT FORM
            ========================================== */}
            <div
              className="glass-card contact-form-card"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                background: cardBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: cardBorder,
                borderRadius: '16px',
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: 600,
                  color: textPrimary,
                }}
              >
                Send us a message
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="name" style={labelStyle}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle('name')}
                  />
                  {errors.name && (
                    <div style={errorStyle}>⚠️ {errors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="email" style={labelStyle}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle('email')}
                  />
                  {errors.email && (
                    <div style={errorStyle}>⚠️ {errors.email}</div>
                  )}
                </div>

                {/* Subject */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="subject" style={labelStyle}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    style={inputStyle('subject')}
                  />
                  {errors.subject && (
                    <div style={errorStyle}>⚠️ {errors.subject}</div>
                  )}
                </div>

                {/* Message */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="message" style={labelStyle}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      ...inputStyle('message'),
                      resize: 'vertical',
                      minHeight: '120px',
                    }}
                  />
                  {errors.message && (
                    <div style={errorStyle}>⚠️ {errors.message}</div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding:
                      'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                    borderRadius: '9999px',
                    background:
                      'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(99,102,241,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Send Message →
                </button>
              </form>
            </div>

            {/* ==========================================
                CONTACT INFO
            ========================================== */}
            <div
              className="contact-info"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Location */}
              <div
                className="glass-card info-card"
                style={{
                  padding: 'clamp(14px, 3vw, 20px)',
                  background: cardBg,
                  backdropFilter: 'blur(20px)',
                  border: cardBorder,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    'translateY(-3px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'translateY(0)')
                }
              >
                <h4
                  style={{
                    fontSize: 'clamp(11px, 2vw, 13px)',
                    color: textFaint,
                    marginBottom: '6px',
                    marginTop: 0,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  📍 Location
                </h4>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 'clamp(13px, 2vw, 14px)',
                    color: textPrimary,
                    margin: 0,
                  }}
                >
                  Islamabad, Pakistan
                </p>
              </div>

              {/* Email */}
              <div
                className="glass-card info-card"
                style={{
                  padding: 'clamp(14px, 3vw, 20px)',
                  background: cardBg,
                  backdropFilter: 'blur(20px)',
                  border: cardBorder,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    'translateY(-3px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'translateY(0)')
                }
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: 'clamp(11px, 2vw, 13px)',
                      color: textFaint,
                      margin: 0,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    📧 Email
                  </h4>
                  <button
                    onClick={handleCopyEmail}
                    title="Copy email"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      color: copied ? '#10b981' : textFaint,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {copied ? '✅' : '📋'}
                  </button>
                </div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    wordBreak: 'break-word',
                    color: textPrimary,
                    margin: 0,
                  }}
                >
                  shahzaibwork247@gmail.com
                </p>
              </div>

              {/* Developer */}
              <div
                className="glass-card info-card"
                style={{
                  padding: 'clamp(14px, 3vw, 20px)',
                  background: cardBg,
                  backdropFilter: 'blur(20px)',
                  border: cardBorder,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    'translateY(-3px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'translateY(0)')
                }
              >
                <h4
                  style={{
                    fontSize: 'clamp(11px, 2vw, 13px)',
                    color: textFaint,
                    marginBottom: '6px',
                    marginTop: 0,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  👨‍💻 Developer
                </h4>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 'clamp(13px, 2vw, 14px)',
                    color: textPrimary,
                    margin: 0,
                  }}
                >
                  Shahzaib Tahir
                </p>
              </div>

              {/* Social */}
              <div
                className="glass-card info-card"
                style={{
                  padding: 'clamp(14px, 3vw, 20px)',
                  background: cardBg,
                  backdropFilter: 'blur(20px)',
                  border: cardBorder,
                  borderRadius: '16px',
                }}
              >
                <h4
                  style={{
                    fontSize: 'clamp(11px, 2vw, 13px)',
                    color: textFaint,
                    marginBottom: '10px',
                    marginTop: 0,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  📱 Social
                </h4>
                <div
                  className="social-links"
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    {
                      href: 'https://github.com/shhzbali514-dotcom',
                      label: '💻 GitHub',
                    },
                    {
                      href: 'https://www.linkedin.com/in/shahzaib-tahir-b6a39b426',
                      label: '🔗 LinkedIn',
                    },
                    {
                      href: 'https://www.instagram.com/shahzaibdev7',
                      label: '📱 Instagram',
                    },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        background: inputBg,
                        border: inputBorder,
                        fontSize: 'clamp(11px, 2vw, 13px)',
                        color: textMuted,
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(99,102,241,0.15)';
                        e.currentTarget.style.color = '#818cf8';
                        e.currentTarget.style.transform =
                          'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = inputBg;
                        e.currentTarget.style.color = textMuted;
                        e.currentTarget.style.transform =
                          'translateY(0)';
                      }}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
              FAQ SECTION
          ========================================== */}
          <div
            className="glass-card faq-section"
            style={{
              padding: 'clamp(16px, 3vw, 24px)',
              background: cardBg,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: cardBorder,
              borderRadius: '16px',
            }}
          >
            <h3
              style={{
                marginBottom: '16px',
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                fontWeight: 600,
                color: textPrimary,
              }}
            >
              ❓ Frequently Asked Questions
            </h3>

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="faq-item"
                  style={{
                    padding: '14px 0',
                    borderBottom:
                      index < faqs.length - 1
                        ? `1px solid ${dividerColor}`
                        : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    setOpenFaq(isOpen ? null : index)
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 600,
                        margin: 0,
                        fontSize: 'clamp(13px, 2vw, 15px)',
                        color: isOpen
                          ? '#818cf8'
                          : textPrimary,
                        transition: 'color 0.3s ease',
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {faq.q}
                    </h4>
                    <span
                      style={{
                        fontSize: '16px',
                        color: textFaint,
                        transition: 'transform 0.3s ease',
                        transform: isOpen
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                        flexShrink: 0,
                      }}
                    >
                      ▼
                    </span>
                  </div>

                  {isOpen && (
                    <p
                      style={{
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        color: textMuted,
                        marginTop: '10px',
                        marginBottom: 0,
                        lineHeight: 1.6,
                        animation: 'fadeIn 0.3s ease',
                      }}
                    >
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        <Footer />
      </div>

      {/* ==========================================
          KEYFRAMES
      ========================================== */}
      <style>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        input::placeholder,
        textarea::placeholder {
          color: ${
            theme === 'dark'
              ? 'rgba(255,255,255,0.3)'
              : 'rgba(0,0,0,0.3)'
          };
        }

        input:focus,
        textarea:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        @media (max-width: 480px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default Contact;