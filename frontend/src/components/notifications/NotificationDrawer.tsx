import { ArrowLeft, CheckCheck, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export const NotificationDrawer = () => {
  const { isNotificationDrawerOpen, setNotificationDrawerOpen, notifications, markAllNotificationsRead, markNotificationRead } = useWorkspaceStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'request' | 'update' | 'activity' | 'assigned' | 'mention'
  const [shouldRender, setShouldRender] = useState(isNotificationDrawerOpen);
  const [animateIn, setAnimateIn] = useState(isNotificationDrawerOpen);

  useEffect(() => {
    if (isNotificationDrawerOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setAnimateIn(true);
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isNotificationDrawerOpen]);

  if (!shouldRender) return null;

  const handleCardClick = (targetUrl: string, notifId?: string) => {
    if (notifId) markNotificationRead(notifId);
    if (targetUrl) {
      setNotificationDrawerOpen(false);
      navigate(targetUrl);
    }
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`noti_overlay ${animateIn ? 'active' : ''}`}
        onClick={() => setNotificationDrawerOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 99990,
          display: 'block',
          opacity: animateIn ? 1 : 0,
          transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: animateIn ? 'auto' : 'none',
        }}
      />

      {/* Notification Drawer Panel with Animated Slide-In / Slide-Out */}
      <div
        className={`notification_div ${animateIn ? 'active' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: '5.5%',
          width: '58.2%',
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.2)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5rem 3.5rem 3rem 3.5rem',
          overflow: 'hidden',
          transform: animateIn ? 'translateX(0)' : 'translateX(-100%)',
          opacity: animateIn ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          pointerEvents: animateIn ? 'auto' : 'none',
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
          .notification_div, .notification_div * {
            font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }

          /* Navigation Tabs Bar */
          .noti-nav-container {
            display: flex;
            align-items: center;
            height: 40px;
            margin: 2rem 0 2.2rem 0;
            border-bottom: 1px solid #dee2e6;
          }
          .noti-nav-list {
            display: flex;
            align-items: center;
            list-style: none;
            padding: 0;
            margin: 0;
            gap: 2.8rem;
          }
          .noti-nav-item {
            font-size: 14px;
            font-weight: 500;
            color: #475569;
            padding-bottom: 0.6rem;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s ease;
          }
          .noti-nav-item:hover {
            color: #2762ed;
          }
          .noti-nav-item.active {
            color: #2762ed !important;
            border-bottom-color: #2762ed !important;
            font-weight: 700 !important;
          }

          /* Card Styling matching exact Netlify Reference */
          .noti-card-blue {
            background-color: rgb(243, 249, 255);
            border-radius: 8px;
            padding: 2.2rem 2.8rem 1.8rem 2.8rem;
            margin-bottom: 1.2rem;
            transition: all 0.2s ease;
          }
          .noti-card-blue:hover {
            box-shadow: 0 4px 14px rgba(39, 98, 237, 0.1);
          }

          /* File Attachment Pill */
          .file-upload-badge {
            width: 190px;
            height: 46px;
            background-color: #dae3fa;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            font-size: 13px;
            color: #2762ed;
            font-weight: 600;
            gap: 8px;
          }

          @media (min-width: 992px) {
            .notification_div {
              left: 72px !important;
              width: 58.2% !important;
            }
          }
          @media (max-width: 991px) {
            .notification_div {
              left: 0 !important;
              width: 100% !important;
              padding: 1.5rem !important;
            }
            .noti-nav-list {
              gap: 1.2rem !important;
              overflow-x: auto;
            }
          }
        `}</style>

        {/* Top Header Bar with Arrow & Title */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom">
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn p-0 border-0 bg-transparent me-3 d-flex align-items-center justify-content-center"
              onClick={() => setNotificationDrawerOpen(false)}
              title="Close Notifications"
              style={{ color: '#0f172a' }}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="m-0 fs-4 fw-bold text-dark" style={{ fontSize: '24px', letterSpacing: '-0.01em', color: '#0f172a' }}>
              Notifications
            </h1>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-light border rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 fw-medium text-secondary"
            style={{ fontSize: '12.5px', backgroundColor: '#f8fafc' }}
            onClick={() => markAllNotificationsRead()}
          >
            <CheckCheck size={15} className="text-primary" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="noti-nav-container">
          <ul className="noti-nav-list">
            <li className={`noti-nav-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              All
            </li>
            <li className={`noti-nav-item ${activeTab === 'request' ? 'active' : ''}`} onClick={() => setActiveTab('request')}>
              New Request
            </li>
            <li className={`noti-nav-item ${activeTab === 'update' ? 'active' : ''}`} onClick={() => setActiveTab('update')}>
              Update Status
            </li>
            <li className={`noti-nav-item ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
              Activity Log
            </li>
            <li className={`noti-nav-item ${activeTab === 'assigned' ? 'active' : ''}`} onClick={() => setActiveTab('assigned')}>
              Assigned to me
            </li>
            <li className={`noti-nav-item ${activeTab === 'mention' ? 'active' : ''}`} onClick={() => setActiveTab('mention')}>
              at Mentions
            </li>
          </ul>
        </div>

        {/* Notification Stream Body Scroll Area */}
        <div className="flex-grow-1 overflow-auto pe-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>

          {/* Dynamic Real-Time System Notifications */}
          {notifications && notifications.length > 0 && (
            <div className="mb-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`noti-card-blue cursor-pointer position-relative ${n.read ? 'opacity-75' : ''}`}
                  onClick={() => handleCardClick('/projects', n.id)}
                  style={{
                    borderLeft: n.type === 'warning' ? '4px solid #ef4444' : n.type === 'info' ? '4px solid #3b82f6' : '4px solid #10b981',
                    marginBottom: '1rem',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-dark" style={{ fontSize: '14.5px' }}>{n.title}</span>
                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary small">{n.projectRef || 'SYSTEM'}</span>
                  </div>
                  <p className="m-0 text-secondary small" style={{ fontSize: '13px', lineHeight: 1.4 }}>{n.message}</p>
                  <div className="text-end mt-2">
                    <span className="fw-semibold text-primary" style={{ fontSize: '12px' }}>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1: NEW REQUEST CARDS (Matching Image 3 media_1789999165297.png) */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'request' || activeTab === 'assigned') && (
            <div>
              {/* Request Card 1 */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/requests')}>
                <div className="row g-2 align-items-start">
                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Project Name:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>Name of the Project</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Request ID:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>#000111222</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Priority:</span>
                      <span className="fw-bold text-danger" style={{ fontSize: '14px' }}>High</span>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Project Owner:</span>
                      <img
                        src="/img/client1.jpg"
                        alt="Owner"
                        className="rounded-circle border"
                        style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                      />
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Assigned to:</span>
                      <div className="d-flex align-items-center gap-1">
                        <img
                          src="/img/client2.jpg"
                          alt="Assignee 1"
                          className="rounded-circle border"
                          style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                        />
                        <img
                          src="/img/client3.jpg"
                          alt="Assignee 2"
                          className="rounded-circle border"
                          style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }}
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Client Name:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>Client Name X</span>
                    </div>
                  </div>

                  <div className="col-12 text-end mt-3">
                    <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                      Sent On: 25 Nov,2021 at 10:00 AM
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Card 2 */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/requests')}>
                <div className="row g-2 align-items-start">
                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Project Name:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>Name of the Project</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Request ID:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>#000111222</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Priority:</span>
                      <span className="fw-bold" style={{ fontSize: '14px', color: '#2762ed' }}>Low</span>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Project Owner:</span>
                      <img
                        src="/img/client2.jpg"
                        alt="Owner"
                        className="rounded-circle border"
                        style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                      />
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Assigned to:</span>
                      <div className="d-flex align-items-center gap-1">
                        <img
                          src="/img/client1.jpg"
                          alt="Assignee 1"
                          className="rounded-circle border"
                          style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                        />
                        <img
                          src="/img/client3.jpg"
                          alt="Assignee 2"
                          className="rounded-circle border"
                          style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }}
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Client Name:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>Client Name X</span>
                    </div>
                  </div>

                  <div className="col-12 text-end mt-3">
                    <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                      Sent On: 25 Nov,2021 at 10:00 AM
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Card 3 */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/requests')}>
                <div className="row g-2 align-items-start">
                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Project Name:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>Name of the Project</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Request ID:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>#000111222</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Priority:</span>
                      <span className="fw-bold text-danger" style={{ fontSize: '14px' }}>High</span>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Project Owner:</span>
                      <img
                        src="/img/client3.jpg"
                        alt="Owner"
                        className="rounded-circle border"
                        style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                      />
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Assigned to:</span>
                      <div className="d-flex align-items-center gap-1">
                        <img
                          src="/img/client1.jpg"
                          alt="Assignee 1"
                          className="rounded-circle border"
                          style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                        />
                        <img
                          src="/img/client2.jpg"
                          alt="Assignee 2"
                          className="rounded-circle border"
                          style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }}
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark me-2" style={{ width: '110px', fontSize: '14px' }}>Client Name:</span>
                      <span className="text-secondary" style={{ fontSize: '14px' }}>Client Name X</span>
                    </div>
                  </div>

                  <div className="col-12 text-end mt-3">
                    <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                      Sent On: 25 Nov,2021 at 10:00 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: UPDATE STATUS CARDS (Matching Image 2 media_1789999165260.png) */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'update' || activeTab === 'assigned') && (
            <div>
              {/* Status Card 1 */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/projects')}>
                <div className="mb-4">
                  <p className="m-0 text-dark" style={{ fontSize: '14.5px', lineHeight: 1.4 }}>
                    Project ABC changed it's status from{' '}
                    <span className="fw-bold" style={{ color: '#eeab53' }}>Ontrack</span> to{' '}
                    <span className="fw-bold" style={{ color: '#1FC875' }}>Done!</span>
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between pt-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small fw-medium">Assignees:</span>
                    <div className="d-flex align-items-center gap-1">
                      <img
                        src="/img/client1.jpg"
                        alt="Assignee 1"
                        className="rounded-circle border"
                        style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                      />
                      <img
                        src="/img/client2.jpg"
                        alt="Assignee 2"
                        className="rounded-circle border"
                        style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }}
                      />
                    </div>
                  </div>
                  <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                    25 Nov, 2021 at 10:00 AM
                  </span>
                </div>
              </div>

              {/* Status Card 2 */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/projects')}>
                <div className="mb-4">
                  <p className="m-0 text-dark" style={{ fontSize: '14.5px', lineHeight: 1.4 }}>
                    Project ABC changed it's status from{' '}
                    <span className="fw-bold" style={{ color: '#1CA9ED' }}>Planned</span> to{' '}
                    <span className="fw-bold" style={{ color: '#E2445B' }}>At Risk!</span>
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between pt-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small fw-medium">Assignees:</span>
                    <div className="d-flex align-items-center gap-1">
                      <img
                        src="/img/client1.jpg"
                        alt="Assignee 1"
                        className="rounded-circle border"
                        style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                      />
                      <img
                        src="/img/client3.jpg"
                        alt="Assignee 2"
                        className="rounded-circle border"
                        style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }}
                      />
                    </div>
                  </div>
                  <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                    25 Nov, 2021 at 10:00 AM
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: ACTIVITY LOG CARDS (Matching Image 1 media_1789999165258.png) */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'activity' || activeTab === 'mention') && (
            <div>
              {/* Activity Card 1 */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/projects')}>
                <div className="mb-4">
                  <p className="m-0 text-dark" style={{ fontSize: '14.5px', lineHeight: 1.4 }}>
                    John has accepted your invitation the <strong className="fw-bold text-dark">Project 01</strong>
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <img
                    src="/img/client1.jpg"
                    alt="John"
                    className="rounded-circle border"
                    style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                  />
                  <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                    2 min ago
                  </span>
                </div>
              </div>

              {/* Activity Card 2 */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/projects')}>
                <div className="mb-4">
                  <p className="m-0 text-dark" style={{ fontSize: '14.5px', lineHeight: 1.4 }}>
                    Jayson marked the <strong className="fw-bold text-dark">Project ABC</strong> as task done
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <img
                    src="/img/client2.jpg"
                    alt="Jayson"
                    className="rounded-circle border"
                    style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }}
                  />
                  <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                    22 Nov,2021 at 10:00 PM
                  </span>
                </div>
              </div>

              {/* Activity Card 3 (With File Attachments) */}
              <div className="noti-card-blue cursor-pointer" onClick={() => handleCardClick('/projects')}>
                <div className="mb-3">
                  <p className="m-0 text-dark" style={{ fontSize: '14.5px', lineHeight: 1.4 }}>
                    Sherry added 2 files to <strong className="fw-bold text-dark">Project AB's</strong> conversion
                  </p>
                </div>

                {/* File Attachment Badges */}
                <div className="d-flex flex-wrap align-items-center gap-3 my-3">
                  <div className="file-upload-badge">
                    <FileText size={16} color="#2762ed" />
                    <span>Name of the file</span>
                  </div>
                  <div className="file-upload-badge">
                    <FileText size={16} color="#2762ed" />
                    <span>Name of the file</span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3">
                  <img
                    src="/img/client3.jpg"
                    alt="Sherry"
                    className="rounded-circle border"
                    style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                  />
                  <span className="fw-semibold" style={{ fontSize: '13px', color: '#2762ed' }}>
                    22 Nov,2021 at 10:00 PM
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
