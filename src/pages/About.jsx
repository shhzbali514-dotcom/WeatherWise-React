// ==========================================
// ABOUT PAGE - FIXED + MOBILE RESPONSIVE
// ==========================================

import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';

// Components
import WeatherBackground from '../components/WeatherBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';

const About = () => {
  const { weatherData } = useWeather();
  const { theme } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);

  const condition = weatherData?.condition || 'Sunny';

  const skills = [
    { icon: '🌐', name: 'HTML5' },
    { icon: '🎨', name: 'CSS3' },
    { icon: '⚡', name: 'JavaScript (ES6+)' },
    { icon: '⚛️', name: 'React.js' },
    { icon: '📱', name: 'Responsive Web Design' },
    { icon: '📐', name: 'Flexbox & CSS Grid' },
    { icon: '✨', name: 'CSS Animations' },
    { icon: '🔮', name: 'Glassmorphism UI' },
    { icon: '🎨', name: 'Modern UI/UX Design' },
    { icon: '📦', name: 'Git & GitHub' },
    { icon: '🔗', name: 'REST API Integration' },
    { icon: '🌍', name: 'Cross-Browser Compatibility' }
  ];

  const softSkills = [
    '🧩 Problem Solving',
    '🔍 Attention to Detail',
    '🚀 Quick Learner',
    '⏰ Time Management',
    '🤝 Teamwork',
    '💬 Communication Skills',
    '🔥 Self-Motivated',
    '📚 Continuous Learning'
  ];

  const interests = [
    '💻 Frontend Web Development',
    '🎨 UI/UX Design',
    '✨ Web Animations',
    '⚡ Technology',
    '🎮 Gaming',
    '📝 Content Creation'
  ];

  const techStack = [
    '🌐 HTML5',
    '🎨 CSS3',
    '⚡ JavaScript',
    '⚛️ React',
    '📦 Git',
    '💻 GitHub',
    '📱 Responsive Design',
    '✨ Modern CSS',
    '🔮 Glassmorphism',
    '🔗 API Integration'
  ];

  return (
    <>
      <WeatherBackground condition={condition} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(8px, 3vw, 20px)',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        <Navbar onSearchToggle={() => setSearchOpen(!searchOpen)} />

        <main className="page-content" style={{ padding: 'clamp(10px, 2vw, 20px) 0' }}>
          <div className="page-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'clamp(16px, 3vw, 30px)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, letterSpacing: '-0.5px' }}>🌤️ About WeatherWise</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(12px, 2vw, 14px)' }}>Weather intelligence redefined for Pakistan</p>
            </div>
          </div>

          {/* Hero */}
          <div className="glass-card about-hero" style={{
            padding: 'clamp(20px, 4vw, 40px)',
            textAlign: 'center',
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px'
          }}>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, marginBottom: '12px' }}>{"🇵🇰 Pakistan's Premium Weather Platform"}</h2>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '600px',
              margin: '0 auto 24px',
              fontSize: 'clamp(13px, 2vw, 15px)',
              lineHeight: 1.7
            }}>
              {"WeatherWise Pakistan brings you real-time weather intelligence with beautiful glass-morphism design."}
             {" We cover all major cities across Pakistan's provinces with 99.9% accuracy."}
            </p>
            <div className="about-stats" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(16px, 5vw, 40px)',
              flexWrap: 'wrap'
            }}>
              <div className="about-stat" style={{ textAlign: 'center' }}>
                <span className="stat-number" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, display: 'block' }}>150+</span>
                <span className="stat-label" style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: 'rgba(255,255,255,0.3)' }}>Cities Covered</span>
              </div>
              <div className="about-stat" style={{ textAlign: 'center' }}>
                <span className="stat-number" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, display: 'block' }}>7</span>
                <span className="stat-label" style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: 'rgba(255,255,255,0.3)' }}>Provinces</span>
              </div>
              <div className="about-stat" style={{ textAlign: 'center' }}>
                <span className="stat-number" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, display: 'block' }}>99.9%</span>
                <span className="stat-label" style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: 'rgba(255,255,255,0.3)' }}>Accuracy</span>
              </div>
            </div>
          </div>

          {/* Developer Card */}
          <div className="developer-card" style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.1)',
            borderRadius: '24px',
            padding: 'clamp(16px, 3vw, 32px)',
            marginTop: '24px',
            transition: 'all 0.4s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 32px)',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            <div className="developer-avatar" style={{
              width: 'clamp(80px, 15vw, 120px)',
              height: 'clamp(80px, 15vw, 120px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(32px, 6vw, 48px)',
              flexShrink: 0,
              boxShadow: '0 0 60px rgba(99,102,241,0.2)',
              animation: 'avatarPulse 3s ease-in-out infinite',
              margin: '0 auto'
            }}>
              👨‍💻
            </div>
            <div className="developer-info" style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 700,
                marginBottom: '4px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Shahzaib Tahir</h3>
              <div className="role" style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: 'clamp(12px, 2vw, 14px)',
                fontWeight: 500,
                marginBottom: '4px'
              }}>🚀 Frontend Web Developer &amp; UI Designer</div>
              <div className="bio" style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 'clamp(12px, 2vw, 14px)',
                lineHeight: 1.8,
                marginBottom: '12px',
                maxWidth: '600px'
              }}>
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Assalam-o-Alaikum! 👋</strong><br /><br />
                {"I'm "}<strong style={{ color: 'rgba(255,255,255,0.8)' }}>Shahzaib Tahir</strong>, a passionate <span style={{ color: '#818cf8' }}>Frontend Web Developer</span> from Pakistan.
                I specialize in creating <strong style={{ color: 'rgba(255,255,255,0.8)' }}>modern, responsive, fast, and visually attractive</strong> websites
                using the latest frontend technologies.<br /><br />
                I enjoy building <span style={{ color: '#818cf8' }}>premium user interfaces, smooth animations, clean layouts, and responsive web experiences</span>.
                I always focus on writing <strong style={{ color: 'rgba(255,255,255,0.8)' }}>clean, organized, and maintainable</strong> code while following modern web development standards.<br /><br />
                <span style={{ color: '#818cf8' }}>🎯 Career Goal:</span> Become a world-class Frontend Web Developer and build modern, premium-quality web applications.
              </div>
              <div className="developer-social" style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <a href="https://github.com/shhzbali514-dotcom" target="_blank" rel="noopener noreferrer" style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>💻 GitHub</a>
                <a href="https://www.linkedin.com/in/shahzaib-tahir-b6a39b426" target="_blank" rel="noopener noreferrer" style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>🔗 LinkedIn</a>
                <a href="https://www.instagram.com/shahzaibdev7" target="_blank" rel="noopener noreferrer" style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>📱 Instagram</a>
                <a href="/contact" style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}>📧 Email</a>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="glass-card about-team" style={{
            padding: 'clamp(16px, 3vw, 24px)',
            textAlign: 'center',
            marginTop: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px'
          }}>
            <h3 style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 600 }}>💡 Development Philosophy</h3>
            <div className="philosophy-card" style={{
              background: 'rgba(99,102,241,0.04)',
              border: '1px solid rgba(99,102,241,0.08)',
              borderRadius: '16px',
              padding: 'clamp(16px, 3vw, 24px)',
              marginTop: '16px',
              textAlign: 'left'
            }}>
              <h4 style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 600, marginBottom: '8px', color: '#818cf8' }}>My Approach to Web Development</h4>
              <p style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                I believe that a great website is not only <strong style={{ color: 'rgba(255,255,255,0.8)' }}>beautiful</strong> but also <strong style={{ color: 'rgba(255,255,255,0.8)' }}>fast, responsive, user-friendly, accessible, and well-structured</strong>.
                Every project I build should provide an <span style={{ color: '#818cf8' }}>excellent user experience</span> across all devices.
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card about-team" style={{
            padding: 'clamp(16px, 3vw, 24px)',
            textAlign: 'center',
            marginTop: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px'
          }}>
            <h3 style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 600 }}>🛠️ Technical Skills</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '16px', fontSize: 'clamp(12px, 2vw, 14px)' }}>Frontend technologies I work with</p>
            <div className="skills-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '10px',
              marginTop: '12px'
            }}>
              {skills.map((skill, index) => (
                <div key={index} className="skill-item" style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)'
                }}>
                  <span className="skill-icon" style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>{skill.icon}</span>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="glass-card about-team" style={{
            padding: 'clamp(16px, 3vw, 24px)',
            textAlign: 'center',
            marginTop: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px'
          }}>
            <h3 style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 600 }}>💪 Soft Skills</h3>
            <div className="skills-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '10px',
              marginTop: '12px'
            }}>
              {softSkills.map((skill, index) => (
                <div key={index} className="skill-item" style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)'
                }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="glass-card about-team" style={{
            padding: 'clamp(16px, 3vw, 24px)',
            textAlign: 'center',
            marginTop: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px'
          }}>
            <h3 style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 600 }}>❤️ My Interests</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '16px', fontSize: 'clamp(12px, 2vw, 14px)' }}>{"Things I'm passionate about"}</p>
            <div className="interests-grid" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '12px',
              justifyContent: 'center'
            }}>
              {interests.map((interest, index) => (
                <span key={index} className="interest-item" style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease'
                }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="about-features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '24px'
          }}>
            <div className="glass-card about-feature" style={{
              padding: '20px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px'
            }}>
              <h3 style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', marginBottom: '8px' }}>🌤️ Real-Time Data</h3>
              <p style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: 'rgba(255,255,255,0.4)' }}>Live weather updates for every Pakistani city</p>
            </div>
            <div className="glass-card about-feature" style={{
              padding: '20px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px'
            }}>
              <h3 style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', marginBottom: '8px' }}>🎨 Adaptive UI</h3>
              <p style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: 'rgba(255,255,255,0.4)' }}>Dynamic interface that changes with weather</p>
            </div>
            <div className="glass-card about-feature" style={{
              padding: '20px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px'
            }}>
              <h3 style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', marginBottom: '8px' }}>📊 Advanced Analytics</h3>
              <p style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: 'rgba(255,255,255,0.4)' }}>Beautiful visualizations and trends</p>
            </div>
            <div className="glass-card about-feature" style={{
              padding: '20px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px'
            }}>
              <h3 style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', marginBottom: '8px' }}>🇵🇰 Pakistan Focused</h3>
              <p style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: 'rgba(255,255,255,0.4)' }}>Tailored for Pakistani weather patterns</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-card about-team" style={{
            padding: 'clamp(16px, 3vw, 24px)',
            textAlign: 'center',
            marginTop: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px'
          }}>
            <h3 style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 600 }}>🛠️ Tech Stack</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '16px', fontSize: 'clamp(12px, 2vw, 14px)' }}>Technologies used in this project</p>
            <div className="tech-stack-grid" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '12px',
              justifyContent: 'center'
            }}>
              {techStack.map((tech, index) => (
                <span key={index} className="tech-item" style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Version */}
          <div className="glass-card about-team" style={{
            padding: 'clamp(16px, 3vw, 24px)',
            textAlign: 'center',
            marginTop: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.1)',
            borderRadius: '16px'
          }}>
            <h3 style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 600 }}>📦 Version</h3>
            <p style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Current Version</p>
            <p style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700, color: '#818cf8' }}>v7.0.0</p>
            <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>© 2024 WeatherWise Pakistan. All rights reserved.</p>
            <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: 'rgba(255,255,255,0.15)', marginTop: '2px' }}>
              Developed with ❤️ by <strong style={{ color: '#818cf8' }}>Shahzaib Tahir</strong>
            </p>
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @keyframes avatarPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(99,102,241,0.2); }
          50% { box-shadow: 0 0 80px rgba(99,102,241,0.4); }
        }

        [data-theme="light"] .glass-card {
          background: rgba(255,255,255,0.5) !important;
          border: 1px solid rgba(0,0,0,0.04) !important;
        }
        [data-theme="light"] .developer-card {
          background: rgba(99,102,241,0.04) !important;
          border-color: rgba(99,102,241,0.08) !important;
        }
        [data-theme="light"] .developer-card:hover {
          background: rgba(99,102,241,0.06) !important;
        }
        [data-theme="light"] .developer-info h3 {
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        [data-theme="light"] .developer-info .bio {
          color: rgba(0,0,0,0.5) !important;
        }
        [data-theme="light"] .developer-info .bio strong {
          color: rgba(0,0,0,0.8) !important;
        }
        [data-theme="light"] .developer-info .role {
          color: rgba(0,0,0,0.3) !important;
        }
        [data-theme="light"] .developer-social a {
          background: rgba(0,0,0,0.02) !important;
          border-color: rgba(0,0,0,0.04) !important;
          color: rgba(0,0,0,0.3) !important;
        }
        [data-theme="light"] .developer-social a:hover {
          background: rgba(99,102,241,0.05) !important;
          color: #6366f1 !important;
        }
        [data-theme="light"] .philosophy-card {
          background: rgba(99,102,241,0.04) !important;
          border-color: rgba(99,102,241,0.06) !important;
        }
        [data-theme="light"] .philosophy-card p {
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .skill-item {
          background: rgba(0,0,0,0.02) !important;
          border-color: rgba(0,0,0,0.04) !important;
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .skill-item:hover {
          background: rgba(99,102,241,0.05) !important;
          color: #6366f1 !important;
        }
        [data-theme="light"] .interest-item {
          background: rgba(0,0,0,0.02) !important;
          border-color: rgba(0,0,0,0.04) !important;
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .interest-item:hover {
          background: rgba(99,102,241,0.05) !important;
          color: #6366f1 !important;
        }
        [data-theme="light"] .about-stat .stat-number {
          color: #1a1a2e !important;
        }
        [data-theme="light"] .about-stat .stat-label {
          color: rgba(0,0,0,0.3) !important;
        }
        [data-theme="light"] .about-hero h2 {
          color: #1a1a2e !important;
        }
        [data-theme="light"] .about-hero p {
          color: rgba(0,0,0,0.5) !important;
        }
        [data-theme="light"] .page-header h1 {
          color: #1a1a2e !important;
        }
        [data-theme="light"] .page-header p {
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .tech-item {
          background: rgba(0,0,0,0.02) !important;
          border-color: rgba(0,0,0,0.04) !important;
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .tech-item:hover {
          background: rgba(99,102,241,0.05) !important;
          color: #6366f1 !important;
        }

        /* ==========================================
           MOBILE RESPONSIVE
           ========================================== */
        @media (max-width: 768px) {
          .developer-card {
            flex-direction: column !important;
            text-align: center !important;
            padding: 20px !important;
            gap: 16px !important;
          }
          .developer-info .bio {
            max-width: 100% !important;
            margin: 0 auto !important;
          }
          .developer-social {
            justify-content: center !important;
          }
          .about-features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .about-stats {
            gap: 20px !important;
          }
          .skills-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .developer-avatar {
            width: 80px !important;
            height: 80px !important;
            font-size: 32px !important;
          }
          .developer-info h3 {
            font-size: 22px !important;
          }
          .developer-card {
            padding: 16px !important;
          }
          .about-hero {
            padding: 20px !important;
          }
          .about-hero h2 {
            font-size: 20px !important;
          }
          .skills-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .about-features-grid {
            grid-template-columns: 1fr !important;
          }
          .about-stats {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default About;