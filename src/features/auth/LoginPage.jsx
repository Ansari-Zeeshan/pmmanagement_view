import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Building2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import './LoginPage.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@emaar.ae');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    if (localStorage.getItem('auth_token') || isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const reason = sessionStorage.getItem('logout_reason');
    if (reason) {
      setInfoMessage(reason);
      sessionStorage.removeItem('logout_reason');
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      await fetchCurrentUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      await fetchCurrentUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google sign in failed.');
    }
  };

  return (
    <section className="luxury-login-section">
      <div className="luxury-video-background">
        <video autoPlay muted loop playsInline>
          <source src="/video/hero-landscape.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="luxury-video-overlay"></div>

      <div className="luxury-login-container">
        <div className="luxury-glass-card">
          <div className="row g-0">
            {/* Left Hero Panel */}
            <div className="col-lg-6">
              <div className="luxury-hero-panel">
                <div>
                  <div className="luxury-hero-header">
                    <img 
                      src="/icons/EmmarSignIn.svg" 
                      alt="Emaar PM Connect" 
                      className="luxury-logo-img d-none d-md-block" 
                    />
                    <img 
                      src="/icons/Emarlogo_mobileversion.svg" 
                      alt="Emaar Logo" 
                      className="luxury-logo-img d-md-none" 
                    />
                  </div>

                  <div className="luxury-badge">
                    <Sparkles size={14} /> Enterprise Portfolio Intelligence
                  </div>

                  <h2 className="luxury-hero-title">
                    Architecting Dubai's Skyline with <span>Executive Precision</span>
                  </h2>

                  <p className="luxury-hero-subtitle">
                    Empowering Emaar leadership with real-time portfolio tracking, intelligent milestones, and seamless project execution.
                  </p>

                  <div className="luxury-stats-grid">
                    <div className="luxury-stat-card">
                      <div className="luxury-stat-icon-wrapper">
                        <TrendingUp size={20} />
                      </div>
                      <div className="luxury-stat-value">AED 45B+</div>
                      <div className="luxury-stat-label">Active Portfolio</div>
                    </div>

                    <div className="luxury-stat-card">
                      <div className="luxury-stat-icon-wrapper">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="luxury-stat-value">99.4%</div>
                      <div className="luxury-stat-label">On-Time Completion</div>
                    </div>
                  </div>
                </div>

                <div className="luxury-pill-tags">
                  <span className="luxury-pill-tag">
                    <Building2 size={13} /> 180+ Active Projects
                  </span>
                  <span className="luxury-pill-tag">
                    <BarChart3 size={13} /> Live Gantt Sync
                  </span>
                  <span className="luxury-pill-tag">
                    <ShieldCheck size={13} /> Enterprise Security
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sign-In Form Panel */}
            <div className="col-lg-6">
              <div className="luxury-form-panel">
                <div className="luxury-form-header">
                  <h1>Sign In</h1>
                  <p>Access your Emaar PM Connect workspace</p>
                </div>

                {infoMessage && (
                  <div className="alert alert-warning border-0 rounded-3 text-dark py-2 px-3 small mb-3">
                    {infoMessage}
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger border-0 rounded-3 py-2 px-3 small mb-3">
                    {error}
                  </div>
                )}

                <form onSubmit={handleEmailLogin}>
                  <div className="luxury-input-group">
                    <label className="luxury-input-label">Corporate Email</label>
                    <div className="luxury-input-wrapper">
                      <Mail className="luxury-input-icon" size={18} />
                      <input
                        type="email"
                        className="luxury-input-field"
                        placeholder="name@emaar.ae"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="luxury-input-group">
                    <label className="luxury-input-label">Password</label>
                    <div className="luxury-input-wrapper">
                      <Lock className="luxury-input-icon" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="luxury-input-field"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="luxury-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="luxury-controls-row">
                    <label className="luxury-checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="luxury-checkbox-label">Keep me signed in</span>
                    </label>
                    <a href="#forgot" className="luxury-forgot-link">
                      Forgot password?
                    </a>
                  </div>

                  <button 
                    type="submit" 
                    className="luxury-primary-btn" 
                    disabled={loading}
                  >
                    {loading ? (
                      'Signing In...'
                    ) : (
                      <>
                        Sign In to PM Connect <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="luxury-google-btn"
                    onClick={handleGoogleLogin}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Sign in with Google
                  </button>
                </form>

                <div className="luxury-security-note">
                  <ShieldCheck size={14} />
                  <span>Encrypted Enterprise Authentication Protocol</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
