import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';

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
    <section className="main signIn">
      <div className="back_overlay"></div>
      <div className="video_div">
        <video autoPlay muted loop>
          <source src="/video/hero-landscape.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="div-left">
            <h2>
              <img className="d-none d-md-block" src="/icons/EmmarSignIn.svg" alt="Emaar PM Connect" />
            </h2>
            <center>
              <img src="/icons/Emarlogo_mobileversion.svg" className="d-md-none" alt="logo" />
            </center>
            <div className="con_div">
              <img src="/icons/BG-signup.svg" alt="Background" />
              <div className="div_center">
                <p>
                  Manage Your <span>Projects</span> Like Never before
                </p>
              </div>
            </div>
          </div>
          <div className="div-right">
            <form onSubmit={handleEmailLogin}>
              <h1>Sign In</h1>
              <p>Enter your details below</p>
              {infoMessage && <div className="alert alert-warning py-2 small mb-3">{infoMessage}</div>}
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <p>Email address</p>
              <input
                type="email"
                placeholder="Companyname@info.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p>Password</p>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="myInput"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eyes2 border-0 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '15px', top: '12px' }}
                >
                  <img src="/icons/eyewhite.svg" alt="Toggle Password" />
                </button>
              </div>
              <div className="checkbox_div">
                <div className="align_check">
                  <input type="checkbox" id="vehicle1" name="vehicle1" defaultChecked />
                  <label htmlFor="vehicle1"> Remember me</label>
                </div>
                <p>
                  <a href="#forgot">Forgot your Password?</a>
                </p>
              </div>
              <button className="btn w-100 mb-3" type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <button
                type="button"
                className="btn w-100 bg-white text-dark border d-flex align-items-center justify-content-center gap-2"
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
          </div>
        </div>
      </div>
    </section>
  );
};
