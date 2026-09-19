import { AlertCircle, ChevronDown, Eye, MessageSquare, Plus, Printer } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { LeadProfileModal } from '../../../components/common/LeadProfileModal';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';
import { ProjectDescriptionModal } from '../ProjectDescriptionModal';

const calculateTotalDays = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return '30 Days';

  let str = dateStr.trim().toLowerCase();
  str = str.replace(/\b8ct\b/g, 'oct');
  str = str.replace(/\bto\b/gi, '-');

  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
  };

  const parseDateToken = (token) => {
    token = token.trim();
    const match1 = token.match(/([a-z]{3,4})\s*(\d+)/i);
    if (match1) {
      const m = monthMap[match1[1].toLowerCase().slice(0, 3)];
      const d = parseInt(match1[2], 10);
      if (m !== undefined && !isNaN(d)) return { m, d };
    }
    const match2 = token.match(/(\d+)\s*([a-z]{3,4})/i);
    if (match2) {
      const m = monthMap[match2[2].toLowerCase().slice(0, 3)];
      const d = parseInt(match2[1], 10);
      if (m !== undefined && !isNaN(d)) return { m, d };
    }
    return null;
  };

  const sameMonthMatch = str.match(/^([a-z]{3,4})\s+(\d+)\s*-\s*(\d+)$/i);
  if (sameMonthMatch) {
    const startDay = parseInt(sameMonthMatch[2], 10);
    const endDay = parseInt(sameMonthMatch[3], 10);
    const days = Math.abs(endDay - startDay);
    return `${days || 1} Days`;
  }

  const parts = str.split('-');
  if (parts.length === 2) {
    const t1 = parseDateToken(parts[0]);
    const t2 = parseDateToken(parts[1]);

    if (t1 && t2) {
      let year1 = 2026;
      let year2 = 2026;
      if (t2.m < t1.m) {
        year2 = 2027;
      }
      const d1 = new Date(year1, t1.m, t1.d);
      const d2 = new Date(year2, t2.m, t2.d);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Days`;
    }
  }

  return '30 Days';
};

export const ProjectListView = ({ tasks = [], onTaskStatusChange, onTaskClick, onChatClick, onAddProject }) => {
  const navigate = useNavigate();
  const { setChatDrawerOpen, setActiveTaskDetail } = useWorkspaceStore();
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null); // taskId
  const [statusDropdownPos, setStatusDropdownPos] = useState(null); // { taskId, top, left }
  const [activeActionsDropdown, setActiveActionsDropdown] = useState(null); // taskId
  const [actionsDropdownPos, setActionsDropdownPos] = useState(null);
  const [previewModalTask, setPreviewModalTask] = useState(null);
  const [selectedLeadProfile, setSelectedLeadProfile] = useState(null);

  // Close active portal dropdowns on global click outside or window scroll
  useEffect(() => {
    const handleGlobalClickOrScroll = () => {
      if (activeStatusDropdown || activeActionsDropdown) {
        setActiveStatusDropdown(null);
        setStatusDropdownPos(null);
        setActiveActionsDropdown(null);
        setActionsDropdownPos(null);
      }
    };

    window.addEventListener('click', handleGlobalClickOrScroll);
    window.addEventListener('scroll', handleGlobalClickOrScroll, true);
    return () => {
      window.removeEventListener('click', handleGlobalClickOrScroll);
      window.removeEventListener('scroll', handleGlobalClickOrScroll, true);
    };
  }, [activeStatusDropdown, activeActionsDropdown]);

  const toggleGroup = (groupKey) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const getStatusClass = (statusStr) => {
    switch (statusStr) {
      case 'On Track': return 'track';
      case 'At Risk': return 'atrisk';
      case 'Stuck': return 'atrisk';
      case 'Approved': return 'approved';
      case 'Done': return 'approved';
      case 'Planned': return 'planned';
      case 'On Hold': return 'hold';
      case 'Ready to begin': return 'begin';
      default: return 'track';
    }
  };

  const getPriorityStyle = (priorityStr) => {
    switch (priorityStr) {
      case 'Critical': return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' };
      case 'High': return { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' };
      case 'Medium': return { bg: '#fefce8', color: '#ca8a04', border: '#fef08a' };
      case 'Low': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      default: return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
    }
  };

  const statusGridOptions = [
    [
      { label: 'On Track', class: 'track' },
      { label: 'On Hold', class: 'hold' },
    ],
    [
      { label: 'At Risk', class: 'atrisk' },
      { label: 'Ready to begin', class: 'begin' },
    ],
    [
      { label: 'Approved', class: 'approved' },
      { label: 'No Update', class: 'hold' },
    ],
    [
      { label: 'Planned', class: 'planned' },
      { label: 'Stuck', class: 'atrisk' },
    ],
  ];

  const groups = [
    { key: 'Research', title: 'Research', colorClass: 'research', dotColor: '#5ed9f0' },
    { key: 'Wireframe', title: 'Wireframe', colorClass: 'wireframe', dotColor: '#a25dde' },
    { key: 'Visual Studio', title: 'Visual Studio', colorClass: 'studio', dotColor: '#ffcc00' },
  ];

  const handlePrintProject = (task) => {
    window.print();
  };

  return (
    <div className="project-list tab_content pm-list-view-container position-relative active w-100">
      {/* Print Friendly CSS Overrides */}
      <style>{`
        @media print {
          .sidebar, .top_up, .divfilter2, .pm-workspace-sticky-container, .btn, .no-print, th.col-w-actions, td.cell-actions {
            display: none !important;
          }
          body, .pm-list-view-container {
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .pm-workspace-group-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .pm-workspace-group-table th, .pm-workspace-group-table td {
            border: 1px solid #cbd5e1 !important;
            padding: 6px 8px !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => (t.group || 'Research') === group.key);
        const isCollapsed = collapsedGroups[group.key];

        return (
          <div
            key={group.key}
            className={`project1 pm-project-group-card ${group.colorClass} mb-4`}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Group Container Body */}
            <div className="projectcon1 pm-project-group-content mt-0 mb-0">
              <div
                className="child-border table-scroll-wrapper pm-table-scroll-wrapper"
                style={{
                  overflowX: 'auto',
                  overflowY: 'visible',
                  position: 'relative',
                }}
              >
                <table className="workspace-group-table pm-workspace-group-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  {/* 12 STRICT COLUMNS HEADER */}
                  <thead className="workspace-group-thead pm-workspace-group-thead">
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      {/* 1. Sequence No. */}
                      <th className="head-no text-center py-2 px-2" style={{ width: '45px', minWidth: '45px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        No.
                      </th>

                      {/* 2. Project & Customer */}
                      <th className="head-title text-start py-2 px-3" style={{ minWidth: '240px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        <div className="d-flex align-items-center gap-2">
                          <span onClick={() => toggleGroup(group.key)} style={{ cursor: 'pointer' }} className="d-inline-flex align-items-center justify-content-center">
                            <img
                              src="/icons/dropdown-1.svg"
                              alt="toggle"
                              style={{
                                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                              }}
                            />
                          </span>
                          <span className="dot" style={{ backgroundColor: group.dotColor, width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }} />
                          <span className="m-0 fw-bold">{group.title} (Project & Customer)</span>
                        </div>
                      </th>

                      {/* 3. Assigned To */}
                      <th className="head-assigned text-start py-2 px-2" style={{ width: '110px', minWidth: '110px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Assigned To
                      </th>

                      {/* 4. % Complete */}
                      <th className="head-progress text-center py-2 px-2" style={{ width: '90px', minWidth: '90px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        % Complete
                      </th>

                      {/* 5. Start Date */}
                      <th className="head-start text-start py-2 px-2" style={{ width: '110px', minWidth: '110px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Start Date
                      </th>

                      {/* 6. Due Date */}
                      <th className="head-due text-start py-2 px-2" style={{ width: '110px', minWidth: '110px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Due Date
                      </th>

                      {/* 7. Total Days */}
                      <th className="head-days text-center py-2 px-2" style={{ width: '90px', minWidth: '90px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Total Days
                      </th>

                      {/* 8. Project Submitted */}
                      <th className="head-submitted text-start py-2 px-2" style={{ width: '120px', minWidth: '120px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Submitted
                      </th>

                      {/* 9. Priority */}
                      <th className="head-priority text-center py-2 px-2" style={{ width: '90px', minWidth: '90px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Priority
                      </th>

                      {/* 10. Status */}
                      <th className="head-status text-center py-2 px-2" style={{ width: '120px', minWidth: '120px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Status
                      </th>

                      {/* 11. Total Value */}
                      <th className="head-budget text-end py-2 px-3" style={{ width: '110px', minWidth: '110px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Total Value
                      </th>

                      {/* 12. Actions */}
                      <th className="head-actions text-center py-2 px-2 col-w-actions" style={{ width: '90px', minWidth: '90px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY ROWS */}
                  {!isCollapsed && (
                    <tbody>
                      {groupTasks.map((task, idx) => {
                        const isStatusOpen = activeStatusDropdown === task._id;
                        const isActionsOpen = activeActionsDropdown === task._id;
                        const seqNo = idx + 1;
                        const progressVal = task.progress || (idx === 0 ? 75 : idx === 1 ? 40 : idx === 2 ? 100 : 60);
                        const priorityStyle = getPriorityStyle(task.priority || 'Medium');

                        return (
                          <tr
                            key={task._id || idx}
                            className="border-bottom project-row-item hover-bg-light"
                            style={{ transition: 'background-color 0.15s ease' }}
                          >
                            {/* 1. Sequence No */}
                            <td className="text-center align-middle py-3 px-2 fw-semibold font-monospace" style={{ fontSize: '12.5px', color: '#64748b' }}>
                              {seqNo}
                            </td>

                            {/* 2. Project Name (Clickable link to /projects/:projectId) + Customer Subtitle */}
                            <td className="align-middle py-3 px-3">
                              <div className="d-flex align-items-center justify-content-between w-100" style={{ overflow: 'hidden' }}>
                                <div className="pe-2 overflow-hidden" style={{ maxWidth: 'calc(100% - 30px)' }}>
                                  <Link
                                    to={`/projects/${task._id}`}
                                    className="fw-bold text-decoration-none hover-underline text-truncate d-block"
                                    style={{ color: '#1e293b', fontSize: '13.5px' }}
                                    title={`Click to view details for ${task.title}`}
                                  >
                                    {task.title || 'Untitled Project'}
                                  </Link>
                                  <span className="text-muted d-block text-truncate" style={{ fontSize: '11.5px', marginTop: '1px' }}>
                                    {task.customer || 'Emaar Properties PJSC'}
                                  </span>
                                </div>

                                {/* Chat Drawer Trigger Icon */}
                                <button
                                  type="button"
                                  className="btn btn-link p-0 border-0 bg-transparent flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                                  style={{
                                    opacity: 0.7,
                                    color: '#64748b',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTaskDetail(task);
                                    setChatDrawerOpen(true);
                                    if (onChatClick) onChatClick(task);
                                  }}
                                  title={`Chat about ${task.title}`}
                                >
                                  <MessageSquare size={14} strokeWidth={1.8} />
                                </button>
                              </div>
                            </td>

                            {/* 3. Assigned To Avatar Stack */}
                            <td className="align-middle py-3 px-2">
                              <div className="d-flex align-items-center justify-content-start flex-nowrap ms-1">
                                {(task.assignees || [
                                  { avatarUrl: '/img/client1.jpg' },
                                  { avatarUrl: '/img/client2.jpg' }
                                ]).slice(0, 3).map((a, aIdx) => (
                                  <div
                                    key={aIdx}
                                    className="rounded-circle border border-2 border-white shadow-sm overflow-hidden"
                                    style={{ width: '26px', height: '26px', marginLeft: aIdx > 0 ? '-8px' : '0' }}
                                  >
                                    <img
                                      src={a.avatarUrl || '/img/client1.jpg'}
                                      alt="assignee"
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                                    />
                                  </div>
                                ))}
                                {(task.assignees?.length || 2) > 3 && (
                                  <span
                                    className="rounded-circle bg-light border text-muted d-inline-flex align-items-center justify-content-center fw-bold small"
                                    style={{ width: '26px', height: '26px', fontSize: '10px', marginLeft: '-8px' }}
                                  >
                                    +{(task.assignees?.length || 2) - 3}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 4. % Complete */}
                            <td className="text-center align-middle py-3 px-2">
                              <div className="d-inline-flex align-items-center gap-1">
                                <span className="fw-bold text-primary font-monospace" style={{ fontSize: '12.5px' }}>
                                  {progressVal}%
                                </span>
                              </div>
                            </td>

                            {/* 5. Start Date */}
                            <td className="align-middle py-3 px-2 text-dark font-monospace" style={{ fontSize: '12.5px' }}>
                              {task.startDate || '01 Aug 2026'}
                            </td>

                            {/* 6. Due Date */}
                            <td className="align-middle py-3 px-2 font-monospace" style={{ fontSize: '12.5px' }}>
                              <span className="d-inline-flex align-items-center gap-1 text-dark">
                                {task.dueDate || '31 Aug 2026'}
                                {idx === 1 && (
                                  <AlertCircle size={13} className="text-danger" title="Subtle overdue warning" />
                                )}
                              </span>
                            </td>

                            {/* 7. Total Days */}
                            <td className="text-center align-middle py-3 px-2">
                              <span className="badge bg-light text-secondary border font-monospace" style={{ fontSize: '11.5px', fontWeight: 600 }}>
                                {calculateTotalDays(task.plannedDate || '01 Aug - 31 Aug')}
                              </span>
                            </td>

                            {/* 8. Project Submitted */}
                            <td className="align-middle py-3 px-2 text-muted font-monospace" style={{ fontSize: '12px' }}>
                              {task.submittedDate || '31/07/2026'}
                            </td>

                            {/* 9. Priority */}
                            <td className="text-center align-middle py-3 px-2">
                              <span
                                className="badge px-2 py-1 rounded-pill small fw-bold"
                                style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.color, border: `1px solid ${priorityStyle.border}`, fontSize: '11px' }}
                              >
                                {task.priority || 'Medium'}
                              </span>
                            </td>

                            {/* 10. Status */}
                            <td className="text-center align-middle py-3 px-2">
                              <div
                                className={getStatusClass(task.status)}
                                style={{ cursor: 'pointer', fontSize: '12px', padding: '3px 8px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isStatusOpen) {
                                    setActiveStatusDropdown(null);
                                    setStatusDropdownPos(null);
                                  } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setActiveStatusDropdown(task._id);
                                    setStatusDropdownPos({
                                      taskId: task._id,
                                      top: rect.bottom + 6,
                                      left: Math.max(10, rect.right - 270),
                                    });
                                  }
                                }}
                              >
                                {task.status || 'On Track'}
                              </div>
                            </td>

                            {/* 11. Total Value */}
                            <td className="text-end align-middle py-3 px-3 fw-bold text-dark font-monospace" style={{ fontSize: '12.5px' }}>
                              {task.actualBudget || task.plannedBudget || '100 AED'}
                            </td>

                            {/* 12. Actions Dropdown */}
                            <td className="text-center align-middle py-3 px-2 cell-actions">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-1 px-2 d-inline-flex align-items-center gap-1 rounded-2 fw-semibold"
                                style={{ fontSize: '12px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isActionsOpen) {
                                    setActiveActionsDropdown(null);
                                    setActionsDropdownPos(null);
                                  } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setActiveActionsDropdown(task._id);
                                    setActionsDropdownPos({
                                      task,
                                      top: rect.bottom + 4,
                                      left: Math.max(10, rect.right - 180),
                                    });
                                  }
                                }}
                              >
                                <span>Actions</span>
                                <ChevronDown size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Add Row Button */}
                      <tr className="border-bottom">
                        <td colSpan={12} className="py-2 px-3">
                          <p
                            className="text-primary fw-bold cursor-pointer m-0 d-inline-flex align-items-center gap-1"
                            onClick={onAddProject}
                            style={{ cursor: 'pointer', fontSize: '13px' }}
                          >
                            <Plus size={14} />
                            <span>Add New Project</span>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        );
      })}

      {/* Lead Profile Popup Modal */}
      {selectedLeadProfile && (
        <LeadProfileModal
          leadName={selectedLeadProfile.name}
          leadType={selectedLeadProfile.type}
          onClose={() => setSelectedLeadProfile(null)}
        />
      )}

      {/* Project Description Quick Preview Modal */}
      {previewModalTask && (
        <ProjectDescriptionModal
          task={previewModalTask}
          onClose={() => setPreviewModalTask(null)}
        />
      )}

      {/* PORTAL FOR ELEVATED STATUS GRID POPOVER */}
      {activeStatusDropdown && statusDropdownPos && createPortal(
        <div
          className="dropdown-menu show shadow-2xl p-2 border position-fixed bg-white"
          style={{
            position: 'fixed',
            top: `${statusDropdownPos.top}px`,
            left: `${statusDropdownPos.left}px`,
            zIndex: 999999,
            width: '270px',
            borderRadius: '10px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0,0,0,0.12)',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="row g-2">
            {statusGridOptions.map((pair, pIdx) => (
              <React.Fragment key={pIdx}>
                {pair.map((st) => (
                  <div key={st.label} className="col-6">
                    <div
                      className={st.class}
                      style={{ cursor: 'pointer', textAlign: 'center', margin: '2px 0' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskStatusChange && onTaskStatusChange(statusDropdownPos.taskId, st.label);
                        setActiveStatusDropdown(null);
                        setStatusDropdownPos(null);
                      }}
                    >
                      {st.label}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL FOR ACTIONS MENU POPOVER */}
      {activeActionsDropdown && actionsDropdownPos && createPortal(
        <div
          className="dropdown-menu show shadow-xl p-1 border position-fixed bg-white rounded-3"
          style={{
            position: 'fixed',
            top: `${actionsDropdownPos.top}px`,
            left: `${actionsDropdownPos.left}px`,
            zIndex: 999999,
            width: '185px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="dropdown-item small rounded-2 py-2 px-3 d-flex align-items-center gap-2 fw-medium text-dark"
            onClick={() => {
              setPreviewModalTask(actionsDropdownPos.task);
              setActiveActionsDropdown(null);
              setActionsDropdownPos(null);
            }}
          >
            <Eye size={14} className="text-primary" />
            <span>View Description</span>
          </button>

          <button
            type="button"
            className="dropdown-item small rounded-2 py-2 px-3 d-flex align-items-center gap-2 fw-medium text-dark"
            onClick={() => {
              handlePrintProject(actionsDropdownPos.task);
              setActiveActionsDropdown(null);
              setActionsDropdownPos(null);
            }}
          >
            <Printer size={14} className="text-secondary" />
            <span>Print Project</span>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectListView;
