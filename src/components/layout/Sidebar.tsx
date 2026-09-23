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
  Collapse,
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const {
    setNotificationDrawerOpen,
    setHelpModalOpen,
    isHelpModalOpen,
    sidebarExpanded,
    toggleSidebar,
  } = useWorkspaceStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Profile Menu Popover Anchor State
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  // Project Submenu Popover Anchor State
  const [projectAnchorEl, setProjectAnchorEl] = useState(null);
  const isProjectMenuOpen = Boolean(projectAnchorEl);

  // Project Requests Submenu Popover Anchor State
  const [requestsAnchorEl, setRequestsAnchorEl] = useState(null);
  const isRequestsMenuOpen = Boolean(requestsAnchorEl);

  // Submenu Accordion state in expanded view
  const [expandedSubmenu, setExpandedSubmenu] = useState('REQUESTS'); // 'PROJECTS' | 'REQUESTS' | null

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

  const handleOpenRequestsMenu = (e) => {
    e.preventDefault();
    setRequestsAnchorEl(e.currentTarget);
  };

  const handleCloseRequestsMenu = () => {
    setRequestsAnchorEl(null);
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
    location.pathname.startsWith('/project-list');
  const isProjectRequests = location.pathname.startsWith('/requests');
  const isViewProgress = location.pathname === '/my-tasks';
  const isReports = location.pathname === '/reports';
  const isSearch = location.pathname === '/search';

  const sidebarWidth = sidebarExpanded ? 230 : 72;

  interface RenderNavButtonProps {
    to?: string;
    onClick?: any;
    onContextMenu?: any;
    isActive?: boolean;
    title?: string;
    label?: string;
    icon?: any;
    hasSubmenu?: boolean;
    submenuKey?: string | null;
    badgeText?: string | null;
  }

  // Helper for Nav Item Button styling & hover state
  const renderNavButton = ({
    to,
    onClick,
    onContextMenu,
    isActive,
    title,
    label,
    icon: IconComponent,
    hasSubmenu = false,
    submenuKey = null,
    badgeText = null,
  }: RenderNavButtonProps) => {
    const isSubmenuExpanded = expandedSubmenu === submenuKey;

    const buttonContent = (
      <Box
        onClick={(e) => {
          if (sidebarExpanded && hasSubmenu && submenuKey) {
            e.stopPropagation();
            setExpandedSubmenu(isSubmenuExpanded ? null : submenuKey);
            if (to) navigate(to);
          } else if (onClick) {
            onClick(e);
          }
        }}
        sx={{
          width: sidebarExpanded ? '100%' : 44,
          height: 44,
          px: sidebarExpanded ? 2 : 0,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarExpanded ? 'flex-start' : 'center',
          backgroundColor: isActive ? '#FFFFFF' : 'transparent',
          boxShadow: isActive ? '0 4px 14px rgba(15, 23, 42, 0.18)' : 'none',
          color: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.92)',
          transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
          position: 'relative',
          mx: sidebarExpanded ? 0 : 'auto',
          '&:hover': {
            backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.18)',
            color: isActive ? '#1d4ed8' : '#FFFFFF',
            transform: sidebarExpanded ? 'translateX(2px)' : 'scale(1.06)',
            boxShadow: isActive
              ? '0 6px 18px rgba(15, 23, 42, 0.22)'
              : '0 4px 12px rgba(0, 0, 0, 0.12)',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mx: sidebarExpanded ? 0 : 'auto' }}>
          <IconComponent size={21} strokeWidth={2.1} />
        </Box>

        {sidebarExpanded && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', ml: 1.5, overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                letterSpacing: '-0.01em',
              }}
            >
              {label}
            </Typography>

            {badgeText && (
              <Box
                sx={{
                  backgroundColor: isActive ? '#2563eb' : 'rgba(255,255,255,0.25)',
                  color: isActive ? '#ffffff' : '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700,
                  px: 1,
                  py: 0.2,
                  borderRadius: '10px',
                  lineHeight: 1,
                  ml: 1,
                }}
              >
                {badgeText}
              </Box>
            )}

            {hasSubmenu && (
              <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', ml: 0.5 }}>
                <ChevronDown
                  size={15}
                  style={{
                    transform: isSubmenuExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    );

    const itemElement = to && (!sidebarExpanded || !hasSubmenu) ? (
      <NavLink
        to={to}
        onContextMenu={onContextMenu}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {buttonContent}
      </NavLink>
    ) : (
      <Box
        onClick={onClick}
        onContextMenu={onContextMenu}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {buttonContent}
      </Box>
    );

    return sidebarExpanded ? (
      <Box sx={{ width: '100%', px: 1.5 }}>
        {itemElement}
      </Box>
    ) : (
      <Tooltip title={title} placement="right" arrow TransitionComponent={Fade}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {itemElement}
        </Box>
      </Tooltip>
    );
  };

  return (
    <nav style={{ zIndex: 1000, position: 'relative' }}>
      {/* Desktop Vertical Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarWidth,
          height: '100vh',
          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '4px 0 20px rgba(37, 99, 235, 0.15), 2px 0 8px rgba(15, 23, 42, 0.08)',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2.5,
          userSelect: 'none',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {/* Header with Brand Logo & Expand/Collapse Switcher */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'space-between' : 'center',
            px: sidebarExpanded ? 2.5 : 1,
            mb: 1.5,
          }}
        >
          {sidebarExpanded ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#ffffff',
                  fontFamily: "'Lato', 'Heebo', sans-serif",
                  fontSize: '15px',
                  fontWeight: 900,
                  letterSpacing: '2.5px',
                  lineHeight: 1,
                }}
              >
                EMAAR
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontSize: '10px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  px: 1,
                  py: 0.2,
                  borderRadius: '4px',
                  lineHeight: 1,
                }}
              >
                PM
              </Typography>
            </Box>
          ) : (
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
          )}

          {/* Toggle Expand Button */}
          <Box
            onClick={toggleSidebar}
            sx={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#2563eb',
                transform: 'scale(1.1)',
              },
            }}
            title={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Box>
        </Box>

        {/* Divider line */}
        <Box
          sx={{
            height: '1px',
            width: sidebarExpanded ? 'calc(100% - 32px)' : '42px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            mx: 'auto',
            mb: 2,
            transition: 'width 0.25s ease',
          }}
        />

        {/* Top Group: Options 1 to 5 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.2,
            width: '100%',
          }}
        >
          {/* 1st option: Dashboard */}
          {renderNavButton({
            to: '/dashboard',
            isActive: isDashboard,
            title: 'Dashboard',
            label: 'Dashboard',
            icon: LayoutGrid,
          })}

          {/* 2nd option: Notifications */}
          {renderNavButton({
            onClick: () => setNotificationDrawerOpen(true),
            isActive: false,
            title: 'Notifications',
            label: 'Notifications',
            icon: Bell,
            badgeText: '3',
          })}

          {/* 3rd option: Project Workspace */}
          {renderNavButton({
            to: '/projects',
            onContextMenu: handleOpenProjectMenu,
            isActive: isProject,
            title: 'Projects Workspace (List, Gantt, Calendar, Kanban)',
            label: 'Projects Workspace',
            icon: FileText,
            hasSubmenu: true,
            submenuKey: 'PROJECTS',
          })}

          {/* Expanded Projects Sub-items */}
          {sidebarExpanded && (
            <Collapse in={expandedSubmenu === 'PROJECTS'} timeout="auto" unmountOnExit sx={{ width: '100%', px: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 2, borderLeft: '2px solid rgba(255,255,255,0.3)', my: 0.5 }}>
                <Box
                  onClick={() => navigate('/projects')}
                  sx={{
                    py: 0.8,
                    px: 1.5,
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: location.pathname === '/projects' ? 700 : 500,
                    color: location.pathname === '/projects' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    backgroundColor: location.pathname === '/projects' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' },
                  }}
                >
                  Workspace Views
                </Box>
                <Box
                  onClick={() => navigate('/project-list')}
                  sx={{
                    py: 0.8,
                    px: 1.5,
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: location.pathname === '/project-list' ? 700 : 500,
                    color: location.pathname === '/project-list' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    backgroundColor: location.pathname === '/project-list' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' },
                  }}
                >
                  Project List
                </Box>
              </Box>
            </Collapse>
          )}

          {/* Project Submenu Popover for collapsed mode */}
          <Menu
            anchorEl={projectAnchorEl}
            open={isProjectMenuOpen}
            onClose={handleCloseProjectMenu}
            anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
            transformOrigin={{ vertical: 'center', horizontal: 'left' }}
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
              Project Requests Hub
            </MenuItem>
          </Menu>

          {/* 4th option: Project Requests (PROMINENTLY FEATURED) */}
          {renderNavButton({
            to: '/requests',
            onClick: (e) => {
              if (sidebarExpanded) {
                setExpandedSubmenu(expandedSubmenu === 'REQUESTS' ? null : 'REQUESTS');
              }
              navigate('/requests');
            },
            onContextMenu: handleOpenRequestsMenu,
            isActive: isProjectRequests,
            title: 'Project Requests (New IT Request, Change Request, Closure)',
            label: 'Project Requests',
            icon: FileSpreadsheet,
            hasSubmenu: true,
            submenuKey: 'REQUESTS',
          })}

          {/* Expanded Project Requests Sub-items list */}
          {sidebarExpanded && (
            <Collapse in={expandedSubmenu === 'REQUESTS'} timeout="auto" unmountOnExit sx={{ width: '100%', px: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 2, borderLeft: '2px solid rgba(255,255,255,0.3)', my: 0.5 }}>
                <Box
                  onClick={() => navigate('/requests')}
                  sx={{
                    py: 0.8,
                    px: 1.5,
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: location.pathname === '/requests' ? 700 : 500,
                    color: location.pathname === '/requests' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    backgroundColor: location.pathname === '/requests' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' },
                  }}
                >
                  Requests Overview
                </Box>
                <Box
                  onClick={() => navigate('/requests/new-it-project')}
                  sx={{
                    py: 0.8,
                    px: 1.5,
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: location.pathname === '/requests/new-it-project' ? 700 : 500,
                    color: location.pathname === '/requests/new-it-project' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    backgroundColor: location.pathname === '/requests/new-it-project' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' },
                  }}
                >
                  <Plus size={13} /> New IT Project Request
                </Box>
                <Box
                  onClick={() => navigate('/requests/change-project')}
                  sx={{
                    py: 0.8,
                    px: 1.5,
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: location.pathname === '/requests/change-project' ? 700 : 500,
                    color: location.pathname === '/requests/change-project' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    backgroundColor: location.pathname === '/requests/change-project' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' },
                  }}
                >
                  <RefreshCw size={13} /> Change Project Request
                </Box>
                <Box
                  onClick={() => navigate('/requests/project-closure')}
                  sx={{
                    py: 0.8,
                    px: 1.5,
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: location.pathname === '/requests/project-closure' ? 700 : 500,
                    color: location.pathname === '/requests/project-closure' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    backgroundColor: location.pathname === '/requests/project-closure' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' },
                  }}
                >
                  <CheckCircle2 size={13} /> IT Project Closure Report
                </Box>
              </Box>
            </Collapse>
          )}

          {/* Project Requests Submenu Popover for collapsed mode */}
          <Menu
            anchorEl={requestsAnchorEl}
            open={isRequestsMenuOpen}
            onClose={handleCloseRequestsMenu}
            anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
            transformOrigin={{ vertical: 'center', horizontal: 'left' }}
            PaperProps={{
              sx: {
                ml: 1.5,
                minWidth: 240,
                borderRadius: '12px',
                boxShadow: '0 15px 25px -5px rgba(15, 23, 42, 0.2)',
                border: '1px solid #e2e8f0',
                p: 0.5,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleCloseRequestsMenu();
                navigate('/requests');
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: location.pathname === '/requests' ? '#2563eb' : '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <FileSpreadsheet size={17} color="#2563eb" />
              Project Requests Overview Hub
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => {
                handleCloseRequestsMenu();
                navigate('/requests/new-it-project');
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <Plus size={16} color="#2563eb" />
              New IT Project Request
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseRequestsMenu();
                navigate('/requests/change-project');
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <RefreshCw size={16} color="#2563eb" />
              Change Project Request
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseRequestsMenu();
                navigate('/requests/project-closure');
              }}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#334155',
                gap: 1.5,
                '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' },
              }}
            >
              <CheckCircle2 size={16} color="#2563eb" />
              IT Project Closure Report
            </MenuItem>
          </Menu>

          {/* 5th option: View Progress */}
          {renderNavButton({
            to: '/my-tasks',
            isActive: isViewProgress,
            title: 'View Progress',
            label: 'View Progress',
            icon: CheckSquare,
          })}
        </Box>

        {/* Section Separator Gap */}
        <Box sx={{ my: 'auto' }} />

        {/* Lower Group: Options 6 to 9 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.2,
            width: '100%',
            mb: 2,
          }}
        >
          {/* 6th option: Reports */}
          {renderNavButton({
            to: '/my-tasks',
            isActive: isReports,
            title: 'Reports',
            label: 'Reports',
            icon: BarChart3,
          })}

          {/* 7th option: Search */}
          {renderNavButton({
            to: '/search',
            isActive: isSearch,
            title: 'Search',
            label: 'Search',
            icon: Search,
          })}

          {/* 8th option: Help & Support */}
          {renderNavButton({
            onClick: () => {
              setHelpModalOpen(true, 'VIDEOS');
            },
            isActive: isHelpModalOpen,
            title: 'Help & Support (Videos, FAQs, Raise Ticket)',
            label: 'Help & Support',
            icon: HelpCircle,
          })}
        </Box>

        {/* 9th option: Profile Avatar & Dropdown Popup */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: sidebarExpanded ? 2 : 0 }}>
          <Tooltip title="Profile & Account Settings" placement="right" arrow>
            <Box
              onClick={handleOpenProfileMenu}
              sx={{
                width: sidebarExpanded ? '100%' : 42,
                height: 44,
                borderRadius: sidebarExpanded ? '12px' : '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                px: sidebarExpanded ? 1.5 : 0,
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                '&:hover': {
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  transform: 'scale(1.02)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <Avatar
                src={`/${user?.avatarUrl || 'img/client1.jpg'}`}
                alt={user?.name || 'Profile'}
                sx={{ width: 30, height: 30, flexShrink: 0 }}
              />

              {sidebarExpanded && (
                <Box sx={{ ml: 1.5, textAlign: 'left', overflow: 'hidden' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.2, color: 'inherit' }}>
                    {user?.name || 'John Doe'}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '10.5px', opacity: 0.8, display: 'block', lineHeight: 1.1 }}>
                    {user?.role || 'Admin'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* Profile Dropdown Popover Menu */}
          <Menu
            anchorEl={profileAnchorEl}
            open={isProfileMenuOpen}
            onClose={handleCloseProfileMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            PaperProps={{
              sx: {
                ml: 1.5,
                mb: 1,
                minWidth: 210,
                borderRadius: '14px',
                boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 10px 10px -5px rgba(15, 23, 42, 0.1)',
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

      {/* Mobile App Bottom Navigation Bar */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -4px 18px rgba(15, 23, 42, 0.08)',
          zIndex: 9999,
          alignItems: 'center',
          justifyContent: 'space-around',
          px: 1,
        }}
      >
        <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isDashboard ? '#2563eb' : '#64748b' }}>
            <LayoutGrid size={20} />
            <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: isDashboard ? 700 : 500, mt: 0.3 }}>Home</Typography>
          </Box>
        </NavLink>

        <NavLink to="/projects" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isProject ? '#2563eb' : '#64748b' }}>
            <FileText size={20} />
            <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: isProject ? 700 : 500, mt: 0.3 }}>Projects</Typography>
          </Box>
        </NavLink>

        <NavLink to="/requests" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isProjectRequests ? '#2563eb' : '#64748b' }}>
            <FileSpreadsheet size={20} />
            <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: isProjectRequests ? 700 : 500, mt: 0.3 }}>Requests</Typography>
          </Box>
        </NavLink>

        <NavLink to="/my-tasks" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isViewProgress ? '#2563eb' : '#64748b' }}>
            <CheckSquare size={20} />
            <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: isViewProgress ? 700 : 500, mt: 0.3 }}>Progress</Typography>
          </Box>
        </NavLink>

        <NavLink to="/search" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isSearch ? '#2563eb' : '#64748b' }}>
            <Search size={20} />
            <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: isSearch ? 700 : 500, mt: 0.3 }}>Search</Typography>
          </Box>
        </NavLink>

        <Box onClick={() => setHelpModalOpen(true, 'VIDEOS')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isHelpModalOpen ? '#2563eb' : '#64748b', cursor: 'pointer' }}>
          <HelpCircle size={20} />
          <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: isHelpModalOpen ? 700 : 500, mt: 0.3 }}>Help</Typography>
        </Box>

        <NavLink to="/profile" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: location.pathname === '/profile' ? '#2563eb' : '#64748b' }}>
            <User size={20} />
            <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: location.pathname === '/profile' ? 700 : 500, mt: 0.3 }}>Profile</Typography>
          </Box>
        </NavLink>
      </Box>
    </nav>
  );
};

export default Sidebar;
