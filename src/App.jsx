import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ChatDrawer } from './features/chat/ChatDrawer';
import { HelpSupportModal } from './features/help/HelpSupportModal';

// Lazy Loaded Feature Routes
const LoginPage = lazy(() => import('./features/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const OwnerDashboardPage = lazy(() => import('./features/dashboard/OwnerDashboardPage').then((m) => ({ default: m.OwnerDashboardPage })));
const ProjectWorkspacePage = lazy(() => import('./features/projects/ProjectWorkspacePage').then((m) => ({ default: m.ProjectWorkspacePage })));
const ProjectListPage = lazy(() => import('./features/projects/ProjectListPage').then((m) => ({ default: m.ProjectListPage })));
const ProjectDetailsPage = lazy(() => import('./features/projects/ProjectDetailsPage').then((m) => ({ default: m.ProjectDetailsPage })));
const ProjectApprovalPreviewPage = lazy(() => import('./features/projects/ProjectApprovalPreviewPage').then((m) => ({ default: m.ProjectApprovalPreviewPage })));
const RequestsPage = lazy(() => import('./features/requests/RequestsPage').then((m) => ({ default: m.RequestsPage })));
const NewITProjectRequestPage = lazy(() => import('./features/requests/NewITProjectRequestPage').then((m) => ({ default: m.NewITProjectRequestPage })));
const ChangeProjectRequestPage = lazy(() => import('./features/requests/ChangeProjectRequestPage').then((m) => ({ default: m.ChangeProjectRequestPage })));
const ITProjectClosurePage = lazy(() => import('./features/requests/ITProjectClosurePage').then((m) => ({ default: m.ITProjectClosurePage })));
const MyTasksPage = lazy(() => import('./features/tasks/MyTasksPage').then((m) => ({ default: m.MyTasksPage })));
const SearchResultsPage = lazy(() => import('./features/search/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage })));
const UserProfilePage = lazy(() => import('./features/profile/UserProfilePage').then((m) => ({ default: m.UserProfilePage })));

const LoadingFallback = () => (
  <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading Emaar Platform...</span>
    </div>
  </div>
);

const ProtectedLayout = () => {
  const { isAuthenticated, isLoading, fetchCurrentUser, logout } = useAuthStore();
  const { sidebarExpanded } = useWorkspaceStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // 1-Hour Inactivity Auto-Logout (3,600,000 ms)
  useEffect(() => {
    if (!isAuthenticated) return;

    const INACTIVITY_TIMEOUT = 3600000; // 1 Hour in milliseconds
    let timeoutId;

    const handleUserActivity = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        sessionStorage.setItem('logout_reason', 'Inactivity timeout: You were automatically logged out after 1 hour of inactivity.');
        navigate('/login', { replace: true });
      }, INACTIVITY_TIMEOUT);
    };

    // Initial setup
    handleUserActivity();

    // Event listeners to detect activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => window.addEventListener(event, handleUserActivity));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => window.removeEventListener(event, handleUserActivity));
    };
  }, [isAuthenticated, logout, navigate]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  // Compute section class to match original CSS scoping
  let sectionClass = 'manage_view';
  if (location.pathname.startsWith('/projects') || location.pathname.startsWith('/project-list') || location.pathname === '/my-tasks') {
    sectionClass = 'manage_view proj_filter';
  } else if (location.pathname.startsWith('/requests')) {
    sectionClass = 'manage_view mview_req';
  } else if (location.pathname === '/profile' || location.pathname === '/userprofile') {
    sectionClass = 'manage_view profile_filter';
  } else if (location.pathname === '/search') {
    sectionClass = 'manage_view proj_filter search';
  }

  const sidebarWidth = sidebarExpanded ? 230 : 72;

  return (
    <section className={sectionClass}>
      <style>{`
        @media (max-width: 768px) {
          .app-main-content {
            margin-left: 0 !important;
            max-width: 100% !important;
            padding-bottom: 74px !important;
          }
        }
        @media (min-width: 769px) {
          .app-main-content {
            margin-left: ${sidebarWidth}px !important;
            max-width: calc(100% - ${sidebarWidth}px) !important;
            transition: margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
      `}</style>
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="myoverlay"></div>
          <div className="menu_overlay"></div>
          <div className="noti_overlay"></div>

          {/* Vertical Sidebar Nav */}
          <Sidebar />

          {/* Main Body Area */}
          <div
            className="app-main-content"
            style={{
              minHeight: '100vh',
              width: '100%',
              transition: 'all 0.2s ease',
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
                <Route path="/projects" element={<ProjectWorkspacePage />} />
                <Route path="/project-list" element={<ProjectListPage />} />
                <Route path="/projects/approval-preview" element={<ProjectApprovalPreviewPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
                <Route path="/my-tasks" element={<MyTasksPage />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/requests/new-it-project" element={<NewITProjectRequestPage />} />
                <Route path="/requests/change-project" element={<ChangeProjectRequestPage />} />
                <Route path="/requests/project-closure" element={<ITProjectClosurePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/userprofile" element={<UserProfilePage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
      <NotificationDrawer />
      <ChatDrawer />
      <HelpSupportModal />
    </section>
  );
};

export const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Suspense>
  );
};

export default App;
