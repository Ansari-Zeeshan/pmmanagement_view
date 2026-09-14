import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { LayoutDashboard, Bell, FileText, FolderKanban, BarChart3, Search, HelpCircle, User } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuthStore();
  const { setNotificationDrawerOpen } = useWorkspaceStore();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const isRequests = location.pathname.startsWith('/requests');
  const isProjects = location.pathname.startsWith('/projects');
  const isTasks = location.pathname === '/my-tasks';
  const isProfile = location.pathname === '/profile' || location.pathname === '/userprofile';

  return (
    <nav style={{ zIndex: 100, position: 'relative' }}>
      <div
        className="div1 d-flex flex-column align-items-center py-3"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          height: '100vh',
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
        }}
      >
        {/* Brand Header */}
        <div className="text-center w-100 mb-2">
          <div
            className="text-white fw-medium tracking-wider mb-2"
            style={{
              fontSize: '15px',
              fontFamily: "'Lato', 'Inter', sans-serif",
              letterSpacing: '1.5px',
              fontWeight: 600,
            }}
          >
            EMAAR
          </div>
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              width: '60%',
              margin: '0 auto',
            }}
          ></div>
        </div>

        {/* Navigation Items Stack */}
        <ul
          className="list-unstyled w-100 d-flex flex-column align-items-center gap-3 my-auto p-0 m-0"
          style={{ width: '100%' }}
        >
          {/* Item 1: Dashboard */}
          <li className="d-flex justify-content-center w-100 position-relative">
            <NavLink
              to="/dashboard"
              className="d-flex align-items-center justify-content-center text-decoration-none"
              title="Dashboard"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: isDashboard ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <LayoutDashboard size={20} color={isDashboard ? '#4868DD' : 'rgba(255, 255, 255, 0.85)'} />
            </NavLink>
          </li>

          {/* Item 2: Notifications */}
          <li className="d-flex justify-content-center w-100 position-relative">
            <button
              type="button"
              className="btn p-0 d-flex align-items-center justify-content-center border-0"
              title="Notifications"
              onClick={() => setNotificationDrawerOpen(true)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Bell size={20} color="rgba(255, 255, 255, 0.85)" />
            </button>
          </li>

          {/* Item 3: Requests */}
          <li className="d-flex justify-content-center w-100 position-relative">
            <NavLink
              to="/requests"
              className="d-flex align-items-center justify-content-center text-decoration-none"
              title="Requests"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: isRequests ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <FileText size={20} color={isRequests ? '#4868DD' : 'rgba(255, 255, 255, 0.85)'} />
            </NavLink>
          </li>

          {/* Item 4: Projects */}
          <li className="d-flex justify-content-center w-100 position-relative">
            <NavLink
              to="/projects"
              className="d-flex align-items-center justify-content-center text-decoration-none"
              title="Projects"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: isProjects ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <FolderKanban size={20} color={isProjects ? '#4868DD' : 'rgba(255, 255, 255, 0.85)'} />
            </NavLink>
          </li>

          {/* Item 5: View Progress / Analytics */}
          <li className="d-flex justify-content-center w-100 position-relative">
            <NavLink
              to="/my-tasks"
              className="d-flex align-items-center justify-content-center text-decoration-none"
              title="View Progress"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: isTasks ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <BarChart3 size={20} color={isTasks ? '#4868DD' : 'rgba(255, 255, 255, 0.85)'} />
            </NavLink>
          </li>

          {/* Item 6: Search */}
          <li className="d-flex justify-content-center w-100 position-relative">
            <NavLink
              to="/search"
              className="d-flex align-items-center justify-content-center text-decoration-none"
              title="Search"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: location.pathname === '/search' ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Search size={20} color={location.pathname === '/search' ? '#4868DD' : 'rgba(255, 255, 255, 0.85)'} />
            </NavLink>
          </li>

          {/* Item 7: Help */}
          <li className="d-flex justify-content-center w-100 position-relative">
            <a
              href="#help"
              onClick={(e) => e.preventDefault()}
              className="d-flex align-items-center justify-content-center text-decoration-none"
              title="Help"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <HelpCircle size={20} color="rgba(255, 255, 255, 0.85)" />
            </a>
          </li>
        </ul>

        {/* Bottom Profile Avatar */}
        <div className="mt-auto pb-2 text-center w-100">
          <NavLink
            to="/profile"
            className="d-inline-block rounded-circle overflow-hidden border border-2 border-white"
            title="Profile"
            style={{
              width: '38px',
              height: '38px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              backgroundColor: '#FFFFFF',
            }}
          >
            {user?.avatarUrl ? (
              <img
                src={`/${user.avatarUrl}`}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center fw-bold text-primary" style={{ fontSize: '14px', backgroundColor: '#FFFFFF', color: '#4868DD' }}>
                S
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
