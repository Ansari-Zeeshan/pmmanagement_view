import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { ArrowLeft, FileText } from 'lucide-react';

export const NotificationDrawer = () => {
  const { isNotificationDrawerOpen, setNotificationDrawerOpen } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`noti_overlay ${isNotificationDrawerOpen ? 'active' : ''}`}
        onClick={() => setNotificationDrawerOpen(false)}
      ></div>

      {/* Drawer Panel */}
      <div className={`notification_div ${isNotificationDrawerOpen ? 'active' : ''}`}>
        {/* Header with Arrow & Title */}
        <div className="d-flex align-items-center pb-3 border-bottom">
          <button
            type="button"
            className="btn p-0 border-0 bg-transparent me-3 d-flex align-items-center justify-content-center"
            onClick={() => setNotificationDrawerOpen(false)}
            title="Close Notifications"
            style={{ color: '#1e293b' }}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="m-0 fs-4 fw-bold text-dark">Notifications</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="nav_div">
          <ul>
            <li
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              All
            </li>
            <li
              className={activeTab === 'request' ? 'active' : ''}
              onClick={() => setActiveTab('request')}
            >
              New Request
            </li>
            <li
              className={activeTab === 'update' ? 'active' : ''}
              onClick={() => setActiveTab('update')}
            >
              Update Status
            </li>
            <li
              className={activeTab === 'activity' ? 'active' : ''}
              onClick={() => setActiveTab('activity')}
            >
              Activity Log
            </li>
            <li
              className={activeTab === 'assigned' ? 'active' : ''}
              onClick={() => setActiveTab('assigned')}
            >
              Assigned to me
            </li>
            <li
              className={activeTab === 'mention' ? 'active' : ''}
              onClick={() => setActiveTab('mention')}
            >
              at Mentions
            </li>
          </ul>
        </div>

        {/* Notification Stream Content */}
        <div className="noti_overflow">
          {/* ============================================================ */}
          {/* TAB 1 & REQUEST CARDS */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'request' || activeTab === 'assigned') && (
            <div className={`request ${activeTab === 'request' || activeTab === 'all' || activeTab === 'assigned' ? 'active' : ''} tabnoti_con`}>
              {/* Request Card 1 */}
              <div className="noti_con">
                <div className="noti_inner">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Project Name:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>Name of the Project</p>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Request ID:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>#000111222</p>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Priority</h4>
                        <p className="high text-danger fw-bold m-0" style={{ fontSize: '14px' }}>High</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Project Owner:</h4>
                        <img src="/icons/avatar1.svg" alt="Owner" width="28" height="28" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Assigned to:</h4>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/icons/avatr4.svg" alt="Assignee" width="24" height="24" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                          <img src="/icons/avtar6.svg" alt="Assignee" width="24" height="24" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar2.svg'; }} />
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Client Name:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>Client Name X</p>
                      </div>
                    </div>
                    <div className="col-md-12 text-end sent_div">
                      <span className="small fw-semibold" style={{ color: '#2762ed' }}>
                        Sent On: 25 Nov,2021 at 10:00 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Card 2 */}
              <div className="noti_con">
                <div className="noti_inner">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Project Name:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>Name of the Project</p>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Request ID:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>#000111222</p>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Priority</h4>
                        <p className="low fw-bold m-0" style={{ fontSize: '14px', color: '#2762ed' }}>Low</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Project Owner:</h4>
                        <img src="/icons/avatar1.svg" alt="Owner" width="28" height="28" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Assigned to:</h4>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/icons/avatr4.svg" alt="Assignee" width="24" height="24" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                          <img src="/icons/avtar6.svg" alt="Assignee" width="24" height="24" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar2.svg'; }} />
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Client Name:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>Client Name X</p>
                      </div>
                    </div>
                    <div className="col-md-12 text-end sent_div">
                      <span className="small fw-semibold" style={{ color: '#2762ed' }}>
                        Sent On: 25 Nov,2021 at 10:00 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Card 3 */}
              <div className="noti_con">
                <div className="noti_inner">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Project Name:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>Name of the Project</p>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Request ID:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>#000111222</p>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Priority</h4>
                        <p className="high text-danger fw-bold m-0" style={{ fontSize: '14px' }}>High</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Project Owner:</h4>
                        <img src="/icons/avatar1.svg" alt="Owner" width="28" height="28" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Assigned to:</h4>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/icons/avatr4.svg" alt="Assignee" width="24" height="24" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                          <img src="/icons/avtar6.svg" alt="Assignee" width="24" height="24" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar2.svg'; }} />
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="fw-semibold text-dark mb-0 me-3" style={{ width: '110px', fontSize: '14px' }}>Client Name:</h4>
                        <p className="m-0 text-secondary" style={{ fontSize: '14px' }}>Client Name X</p>
                      </div>
                    </div>
                    <div className="col-md-12 text-end sent_div">
                      <span className="small fw-semibold" style={{ color: '#2762ed' }}>
                        Sent On: 25 Nov,2021 at 10:00 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2 & UPDATE STATUS CARDS */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'update' || activeTab === 'assigned') && (
            <div className={`update ${activeTab === 'update' || activeTab === 'all' || activeTab === 'assigned' ? 'active' : ''} tabnoti_con`}>
              {/* Status Card 1 */}
              <div className="pad-common">
                <div className="col-md-12">
                  <p className="m-0">
                    Project ABC changed it's status from <span className="track">Ontrack</span> to <span className="done">Done!</span>
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small fw-medium me-1">Assignees:</span>
                    <img src="/icons/avatar1.svg" alt="Assignee" width="26" height="26" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                    <img src="/icons/avatar2.svg" alt="Assignee" width="26" height="26" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar2.svg'; }} />
                  </div>
                  <div className="date">
                    <p className="m-0">25 Nov, 2021 at 10:00 AM</p>
                  </div>
                </div>
              </div>

              {/* Status Card 2 */}
              <div className="pad-common">
                <div className="col-md-12">
                  <p className="m-0">
                    Project ABC changed it's status from <span className="plan">Planned</span> to <span className="risk">At Risk!</span>
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small fw-medium me-1">Assignees:</span>
                    <img src="/icons/avatar1.svg" alt="Assignee" width="26" height="26" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                    <img src="/icons/avatar2.svg" alt="Assignee" width="26" height="26" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar2.svg'; }} />
                  </div>
                  <div className="date">
                    <p className="m-0">25 Nov, 2021 at 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3 & ACTIVITY LOG CARDS */}
          {/* ============================================================ */}
          {(activeTab === 'all' || activeTab === 'activity' || activeTab === 'mention') && (
            <div className={`activity ${activeTab === 'activity' || activeTab === 'all' || activeTab === 'mention' ? 'active' : ''} tabnoti_con`}>
              {/* Activity Card 1 */}
              <div className="pad-common">
                <div className="col-md-12">
                  <p className="m-0">
                    John has accepted your invitation the <span>Project 01</span>
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="avatar">
                    <img src="/icons/avatar1.svg" alt="User" width="26" height="26" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                  </div>
                  <div className="date">
                    <p className="m-0">2 min ago</p>
                  </div>
                </div>
              </div>

              {/* Activity Card 2 */}
              <div className="pad-common">
                <div className="col-md-12">
                  <p className="m-0">
                    Jayson marked the <span>Project ABC</span> as task done
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="avatar">
                    <img src="/icons/avatar2.svg" alt="User" width="26" height="26" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar2.svg'; }} />
                  </div>
                  <div className="date">
                    <p className="m-0">22 Nov,2021 at 10:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Activity Card 3 */}
              <div className="pad-common">
                <div className="col-md-12">
                  <p className="m-0">
                    Sherry added 2 files to <span>Project AB's</span> conversion
                  </p>
                </div>
                <div className="upLoad my-3">
                  <div className="file_div">
                    <FileText size={18} color="#2762ed" />
                    <p className="m-0 ms-1">Name of the file</p>
                  </div>
                  <div className="file_div">
                    <FileText size={18} color="#2762ed" />
                    <p className="m-0 ms-1">Name of the file</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="avatar">
                    <img src="/icons/avatr4.svg" alt="User" width="26" height="26" className="rounded-circle" onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                  </div>
                  <div className="date">
                    <p className="m-0">22 Nov,2021 at 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
