import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuthStore();
  const {
    searchQuery,
    setSearchQuery,
    setNotificationDrawerOpen,
    setChatDrawerOpen,
    setHelpModalOpen,
  } = useWorkspaceStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className="navbar navbar-expand-lg bg-white border-bottom px-4 py-2 sticky-top d-flex justify-content-between align-items-center"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1020,
        backgroundColor: '#ffffff',
        width: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Left Brand Identity */}
      <div className="d-flex align-items-center gap-3">
        <img
          src="/icons/Emarlogo_mobileversion.svg"
          alt="Emaar Logo"
          style={{ height: '36px', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        />
        <span className="fw-bold fs-5 text-dark ms-2 d-none d-md-inline">
          PM CONNECT <span className="badge bg-secondary fs-6 ms-1">Emaar Enterprise</span>
        </span>
      </div>

      {/* Center Search Everything Box */}
      <div className="flex-grow-1 mx-4 d-none d-md-block" style={{ maxWidth: '480px' }}>
        <div className="position-relative">
          <input
            type="text"
            className="form-control rounded-pill ps-4 pe-5"
            placeholder="Search projects, tasks, requests, files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            style={{ backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0' }}
          />
          <span
            className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
            style={{ cursor: 'pointer' }}
            onClick={() => searchQuery.trim() && navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
          >
            <i className="material-icons fs-5 align-middle">search</i>
          </span>
        </div>
      </div>

      {/* Right Controls (Notifications, Chat, Help, User Profile) */}
      <div className="d-flex align-items-center gap-2 gap-md-3">
        {/* Help & Support Toggle */}
        <button
          className="btn btn-light btn-sm rounded-circle p-2 position-relative"
          onClick={() => setHelpModalOpen(true, 'VIDEOS')}
          title="Help & Support"
        >
          <HelpCircle size={19} className="text-secondary align-middle" />
        </button>
        {/* Chat Drawer Toggle */}
        <button
          className="btn btn-light btn-sm rounded-circle p-2 position-relative"
          onClick={() => setChatDrawerOpen(true)}
          title="Live Chat"
        >
          <img src="/icons/3linemail.svg" alt="Chat" style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Notification Bell */}
        <button
          className="btn btn-light btn-sm rounded-circle p-2 position-relative"
          onClick={() => setNotificationDrawerOpen(true)}
          title="Notifications"
        >
          <i className="material-icons text-secondary fs-5 align-middle">notifications</i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>

        {/* User Profile Dropdown */}
        <div className="position-relative">
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={`/${user?.avatarUrl || 'icons/avatar1.svg'}`}
              alt={user?.name || 'User'}
              className="rounded-circle border"
              style={{ width: '38px', height: '38px', objectFit: 'cover' }}
            />
            <div className="d-none d-lg-block text-start lh-1">
              <div className="fw-semibold text-dark fs-6">{user?.name || 'John Doe'}</div>
              <small className="text-muted" style={{ fontSize: '11px' }}>
                {user?.role || 'ORG_ADMIN'}
              </small>
            </div>
            <i className="material-icons text-muted fs-6">arrow_drop_down</i>
          </div>

          {showProfileMenu && (
            <div
              className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm py-2"
              style={{ width: '200px', zIndex: 1050 }}
            >
              <div className="px-3 py-2 border-bottom">
                <div className="fw-bold text-dark">{user?.name}</div>
                <small className="text-muted d-block">{user?.email}</small>
              </div>
              <button
                className="dropdown-item px-3 py-2 d-flex align-items-center gap-2"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
              >
                <i className="material-icons fs-5">person</i> Profile Settings
              </button>
              <button
                className="dropdown-item px-3 py-2 d-flex align-items-center gap-2"
                onClick={() => {
                  setShowProfileMenu(false);
                  setHelpModalOpen(true, 'VIDEOS');
                }}
              >
                <i className="material-icons fs-5">help_outline</i> Help & Support
              </button>
              <div className="dropdown-divider my-1"></div>
              <button
                className="dropdown-item px-3 py-2 text-danger d-flex align-items-center gap-2"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <i className="material-icons fs-5">exit_to_app</i> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
