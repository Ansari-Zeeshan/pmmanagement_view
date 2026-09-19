import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import {
  Tooltip,
  Menu,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Divider,
  Fade,
} from '@mui/material';
import {
  LayoutGrid,
  Bell,
  FileText,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Search,
  HelpCircle,
  User,
  LogOut,
  ListFilter,
  FileSpreadsheet,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { setNotificationDrawerOpen } = useWorkspaceStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Profile Menu Popover Anchor State
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  // Project Submenu Popover Anchor State
  const [projectAnchorEl, setProjectAnchorEl] = useState(null);
  const isProjectMenuOpen = Boolean(projectAnchorEl);

  const handleOpenProfileMenu = (e) => {
    setProfileAnchorEl(e.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const handleOpenProjectMenu = (e) => {
    e.preventDefault();
    setProjectAnchorEl(e.currentTarget);
  };

  const handleCloseProjectMenu = () => {
    setProjectAnchorEl(null);
  };

  const handleNavigateProfile = () => {
    handleCloseProfileMenu();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleCloseProfileMenu();
    logout();
    navigate('/login');
  };

  // Active route checking
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';
  const isProject =
    location.pathname.startsWith('/projects') ||
    location.pathname.startsWith('/project-list') ||
    location.pathname.startsWith('/requests');
  const isViewProgress = location.pathname === '/my-tasks';
  const isReports = location.pathname === '/reports';
  const isSearch = location.pathname === '/search';

  // Helper for Nav Item Button styling & hover state
  const renderNavButton = ({
    to,
    onClick,
    onContextMenu,
    isActive,
    title,
    icon: IconComponent,
  }) => {
    const buttonContent = (
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isActive ? '#FFFFFF' : 'transparent',
          boxShadow: isActive ? '0 4px 14px rgba(15, 23, 42, 0.18)' : 'none',
          color: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.9)',
          transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
            color: isActive ? '#1d4ed8' : '#FFFFFF',
            transform: 'scale(1.06)',
            boxShadow: isActive
              ? '0 6px 18px rgba(15, 23, 42, 0.22)'
              : '0 4px 12px rgba(0, 0, 0, 0.12)',
          },
          '&:active': {
            transform: 'scale(0.96)',
          },
        }}
      >
        <IconComponent size={21} strokeWidth={2.1} />
      </Box>
    );

    return (
      <Tooltip title={title} placement="right" arrow transitionComponent={Fade}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {to ? (
            <NavLink
              to={to}
              onContextMenu={onContextMenu}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {buttonContent}
            </NavLink>
          ) : (
            <Box onClick={onClick} onContextMenu={onContextMenu}>
              {buttonContent}
            </Box>
          )}
        </Box>
      </Tooltip>
    );
  };

  return (
    <nav style={{ zIndex: 1000, position: 'relative' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 72,
          height: '100vh',
          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
          borderTopRightRadius: '24px',
          boxShadow: '4px 0 20px rgba(37, 99, 235, 0.15), 2px 0 8px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2.5,
          userSelect: 'none',
        }}
      >
        {/* Brand Header */}
        <Box sx={{ width: '100%', textAlign: 'center', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#ffffff',
              fontFamily: "'Lato', 'Heebo', sans-serif",
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '2.5px',
              lineHeight: 1.2,
            }}
          >
            EMAAR
          </Typography>
          <Box
            sx={{
              height: '1px',
              width: '42px',
              backgroundColor: 'rgba(255, 255, 255, 0.28)',
              mx: 'auto',
              mt: 1.5,
              mb: 1.5,
            }}
          />
        </Box>

        {/* Top Group: Options 1 to 4 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.8,
            width: '100%',
          }}
        >
          {/* 1st option: Dashboard */}
          {renderNavButton({
            to: '/dashboard',
            isActive: isDashboard,
            title: 'Dashboard',
            icon: LayoutGrid,
          })}

          {/* 2nd option: Notifications */}
          {renderNavButton({
            onClick: () => setNotificationDrawerOpen(true),
            isActive: false,
            title: 'Notifications',
            icon: Bell,
          })}

          {/* 3rd option: Project (Opens Projects Workspace with List, Gantt, Calendar, Kanban) */}
          {renderNavButton({
            to: '/projects',
            onContextMenu: handleOpenProjectMenu,
            isActive: isProject,
            title: 'Project (List, Gantt, Calendar, Kanban Views)',
            icon: FileText,
          })}

          {/* Project Submenu Popover */}
          <Menu
            anchorEl={projectAnchorEl}
            open={isProjectMenuOpen}
            onClose={handleCloseProjectMenu}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                ml: 1.5,
                minWidth: 230,
                borderRadius: '12px',
                boxShadow: '0 15px 25px -5px rgba(15, 23, 42, 0.2)',
                border: '1px solid #e2e8f0',
                p: 0.5,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleCloseProjectMenu();
                navigate('/projects');
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: location.pathname === '/projects' ? '#2563eb' : '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <FolderKanban size={17} color="#2563eb" />
              Projects Workspace (List, Gantt, Calendar, Kanban)
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseProjectMenu();
                navigate('/project-list');
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                color: location.pathname === '/project-list' ? '#2563eb' : '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <ListFilter size={17} color="#2563eb" />
              Project List View
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseProjectMenu();
                navigate('/requests');
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                color: location.pathname.startsWith('/requests') ? '#2563eb' : '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <FileSpreadsheet size={17} color="#2563eb" />
              Project Requests
            </MenuItem>
          </Menu>

          {/* 4th option: View Progress */}
          {renderNavButton({
            to: '/my-tasks',
            isActive: isViewProgress,
            title: 'View Progress',
            icon: CheckSquare,
          })}
        </Box>

        {/* Section Separator Gap */}
        <Box sx={{ my: 'auto' }} />

        {/* Lower Group: Options 5 to 7 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.8,
            width: '100%',
            mb: 2,
          }}
        >
          {/* 5th option: Reports */}
          {renderNavButton({
            to: '/my-tasks',
            isActive: isReports,
            title: 'Reports',
            icon: BarChart3,
          })}

          {/* 6th option: Search */}
          {renderNavButton({
            to: '/search',
            isActive: isSearch,
            title: 'Search',
            icon: Search,
          })}

          {/* 7th option: Help & Support */}
          {renderNavButton({
            onClick: () => {
              window.alert('Help & Support: For assistance, please contact it-support@emaar.ae');
            },
            isActive: false,
            title: 'Help & Support',
            icon: HelpCircle,
          })}
        </Box>

        {/* 8th option: Profile Avatar & Dropdown Popup */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Profile & Account Settings" placement="right" arrow>
            <Box
              onClick={handleOpenProfileMenu}
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid #ffffff',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              {user?.avatarUrl ? (
                <Avatar
                  src={`/${user.avatarUrl}`}
                  alt={user?.name || 'Profile'}
                  sx={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    color: '#2563eb',
                    fontSize: '15px',
                    lineHeight: 1,
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'S'}
                </Typography>
              )}
            </Box>
          </Tooltip>

          {/* Profile Dropdown Popover Menu */}
          <Menu
            anchorEl={profileAnchorEl}
            open={isProfileMenuOpen}
            onClose={handleCloseProfileMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                ml: 1.5,
                mb: 1,
                minWidth: 210,
                borderRadius: '14px',
                boxShadow:
                  '0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 10px 10px -5px rgba(15, 23, 42, 0.1)',
                border: '1px solid #e2e8f0',
                p: 0.5,
              },
            }}
          >
            {/* User Info Header */}
            <Box sx={{ px: 2, py: 1.5, backgroundColor: '#f8fafc', borderRadius: '10px', mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                {user?.name || 'John Doe'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>
                {user?.email || 'john.doe@emaar.ae'}
              </Typography>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            {/* My Profile */}
            <MenuItem
              onClick={handleNavigateProfile}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <User size={17} color="#2563eb" />
              My Profile
            </MenuItem>

            {/* Logout */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#dc2626',
                gap: 1.5,
                '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' },
              }}
            >
              <LogOut size={17} color="#dc2626" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </nav>
  );
};
