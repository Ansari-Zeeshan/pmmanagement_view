import { MessageSquare, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LeadProfileModal } from '../../../components/common/LeadProfileModal';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';

const calculateTotalDays = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return '';

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

  // Case 1: Same month range like "Oct 20 - 28"
  const sameMonthMatch = str.match(/^([a-z]{3,4})\s+(\d+)\s*-\s*(\d+)$/i);
  if (sameMonthMatch) {
    const startDay = parseInt(sameMonthMatch[2], 10);
    const endDay = parseInt(sameMonthMatch[3], 10);
    const days = Math.abs(endDay - startDay);
    return `${days} Days`;
  }

  // Case 2: Range split by '-' e.g. "oct 26 - sep 19"
  const parts = str.split('-');
  if (parts.length === 2) {
    const t1 = parseDateToken(parts[0]);
    const t2 = parseDateToken(parts[1]);

    if (t1 && t2) {
      let year1 = 2026;
      let year2 = 2026;
      if (t2.m < t1.m) {
        year2 = 2027; // cross year boundary (e.g. Oct 2026 -> Sep 2027)
      }
      const d1 = new Date(year1, t1.m, t1.d);
      const d2 = new Date(year2, t2.m, t2.d);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Days`;
    }

    const d1 = new Date(parts[0].trim());
    const d2 = new Date(parts[1].trim());
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Days`;
    }
  }

  return dateStr;
};

const TruncatedCellText = ({
  text,
  className = '',
  style = {},
  maxWidth = '100%',
  fontSize = '13px',
}) => {
  const textRef = React.useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const textStr = String(text || '');
  const isLongText = textStr.length > 100;

  const handleMouseEnter = () => {
    if (textRef.current) {
      const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
      if (isLongText || isOverflowing) {
        setShowTooltip(true);
      }
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="position-relative d-inline-block w-100 align-middle"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={isLongText ? textStr : undefined}
      style={{ maxWidth, overflow: 'hidden' }}
    >
      <p
        ref={textRef}
        className={className}
        style={{
          display: 'block',
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
          fontSize,
          color: '#1e293b',
          lineHeight: 1.3,
          ...style,
        }}
      >
        {textStr}
      </p>

      {showTooltip && (
        <div
          className="position-absolute bg-dark text-white rounded px-2 py-1 shadow-lg"
          style={{
            bottom: '100%',
            left: 0,
            marginBottom: '4px',
            zIndex: 99999,
            fontSize: '11.5px',
            fontWeight: '500',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            maxWidth: '320px',
          }}
        >
          {textStr}
        </div>
      )}
    </div>
  );
};

export const ListView = ({ tasks = [], onTaskStatusChange, onTaskClick, onChatClick, onAddProject }) => {
  const { setChatDrawerOpen, setActiveTaskDetail } = useWorkspaceStore();
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null); // taskId
  const [statusDropdownPos, setStatusDropdownPos] = useState(null); // { taskId, top, left }
  const [activeColumnDropdownGroup, setActiveColumnDropdownGroup] = useState(null); // groupKey
  const [columnDropdownPos, setColumnDropdownPos] = useState(null); // { groupKey, top, left }
  const [hoveredPlannedDateTaskId, setHoveredPlannedDateTaskId] = useState(null);
  const [selectedLeadProfile, setSelectedLeadProfile] = useState(null);

  // Close active portal dropdowns on global click outside or window scroll
  useEffect(() => {
    const handleGlobalClickOrScroll = () => {
      if (activeStatusDropdown || activeColumnDropdownGroup) {
        setActiveStatusDropdown(null);
        setStatusDropdownPos(null);
        setActiveColumnDropdownGroup(null);
        setColumnDropdownPos(null);
      }
    };

    window.addEventListener('click', handleGlobalClickOrScroll);
    window.addEventListener('scroll', handleGlobalClickOrScroll, true);
    return () => {
      window.removeEventListener('click', handleGlobalClickOrScroll);
      window.removeEventListener('scroll', handleGlobalClickOrScroll, true);
    };
  }, [activeStatusDropdown, activeColumnDropdownGroup]);

  const defaultColumns = {
    assignees: true,
    subitems: true,
    plannedDate: true,
    actualDate: true,
    actualBudget: true,
    plannedBudget: true,
    projectLead: true,
    domainLead: true,
    status: true,
  };

  // Per-Group Independent Column Visibility State
  const [groupVisibleColumns, setGroupVisibleColumns] = useState({
    Research: { ...defaultColumns },
    Wireframe: { ...defaultColumns },
    'Visual Studio': { ...defaultColumns },
  });

  const toggleColumn = (groupKey, colKey) => {
    setGroupVisibleColumns((prev) => {
      const currentCols = prev[groupKey] || { ...defaultColumns };
      return {
        ...prev,
        [groupKey]: {
          ...currentCols,
          [colKey]: !currentCols[colKey],
        },
      };
    });
  };

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

  return (
    <div className="list tab_content pm-list-view-container position-relative active w-100">
      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => (t.group || 'Research') === group.key);
        const isCollapsed = collapsedGroups[group.key];
        const visibleColumns = groupVisibleColumns[group.key] || defaultColumns;
        const isColumnDropdownOpen = activeColumnDropdownGroup === group.key;
        const hasActiveStatusInGroup = groupTasks.some((t) => t._id === activeStatusDropdown);
        const isDropdownActiveInGroup = isColumnDropdownOpen || hasActiveStatusInGroup;

        return (
          <div
            key={group.key}
            className={`project1 pm-project-group-card ${group.colorClass} mb-4`}
            style={{ position: 'relative', zIndex: isDropdownActiveInGroup ? 99999 : 1 }}
          >
            {/* Group Container Body */}
            <div className="projectcon1 pm-project-group-content mt-0 mb-0">
              <div
                className="child-border table-scroll-wrapper pm-table-scroll-wrapper"
                style={{
                  overflowX: isDropdownActiveInGroup ? 'visible' : 'auto',
                  overflowY: 'visible',
                  position: 'relative',
                }}
              >
                <table className="workspace-group-table pm-workspace-group-table">
                  {/* Table Header Row */}
                  <thead
                    className="workspace-group-thead pm-workspace-group-thead"
                    style={{ position: 'relative', zIndex: isColumnDropdownOpen ? 99999 : 25 }}
                  >
                    <tr>
                      {/* Project Title Header Column */}
                      <th className="head1 th-project-group-title mysticky2 col-w-title">
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
                          <span className="dot" style={{ backgroundColor: group.dotColor, width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block' }} />
                          <h5 className="m-0 fs-7 fw-bold">{group.title}</h5>
                        </div>
                      </th>

                      {/* Assignees Header Column */}
                      {visibleColumns.assignees && (
                        <th className="head2 th-assignees assignees col-w-assignees">
                          <h5 className="th-header-text">Assignees</h5>
                        </th>
                      )}
                      {/* Subitems Header Column */}
                      {visibleColumns.subitems && (
                        <th className="head3 th-subitems subitems col-w-subitems">
                          <h5 className="th-header-text">Subitems</h5>
                        </th>
                      )}
                      {/* Planned Date Header Column */}
                      {visibleColumns.plannedDate && (
                        <th className="head4 th-planned-date plannedDate col-w-planned-date">
                          <h5 className="th-header-text">Planned Date</h5>
                        </th>
                      )}
                      {/* Actual Date Header Column */}
                      {visibleColumns.actualDate && (
                        <th className="head5 th-actual-date actualDate col-w-actual-date">
                          <h5 className="th-header-text">Actual Date</h5>
                        </th>
                      )}
                      {/* Actual Budget Header Column */}
                      {visibleColumns.actualBudget && (
                        <th className="head6 th-actual-budget actualBudget col-w-actual-budget">
                          <h5 className="th-header-text">Actual Budget</h5>
                        </th>
                      )}
                      {/* Planned Budget Header Column */}
                      {visibleColumns.plannedBudget && (
                        <th className="head7 th-planned-budget plannedBudget col-w-planned-budget">
                          <h5 className="th-header-text">Planned Budget</h5>
                        </th>
                      )}
                      {/* Project Lead Header Column */}
                      {visibleColumns.projectLead && (
                        <th className="head8 th-project-lead projectLead col-w-project-lead">
                          <h5 className="th-header-text">Project Lead</h5>
                        </th>
                      )}
                      {/* Domain Lead Header Column */}
                      {visibleColumns.domainLead && (
                        <th className="head9 th-domain-lead domainLead col-w-domain-lead">
                          <h5 className="th-header-text">Domain Lead</h5>
                        </th>
                      )}
                      {/* Status Header Column */}
                      {visibleColumns.status && (
                        <th className="head10 th-status status col-w-status">
                          <h5 className="th-header-text">Status</h5>
                        </th>
                      )}

                      {/* Hide/Collapse Column Toggle Trigger */}
                      <th className="head11 th-column-toggle col-w-toggle ps-0 position-relative">
                        <div className="position-relative d-inline-block">
                          <span
                            className="column-toggle-btn d-inline-flex align-items-center justify-content-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isColumnDropdownOpen) {
                                setActiveColumnDropdownGroup(null);
                                setColumnDropdownPos(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setActiveColumnDropdownGroup(group.key);
                                setColumnDropdownPos({
                                  groupKey: group.key,
                                  top: rect.bottom + 6,
                                  left: Math.max(10, rect.right - 190),
                                });
                              }
                            }}
                            style={{
                              width: '22px',
                              height: '22px',
                              background: isColumnDropdownOpen
                                ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              borderRadius: '6px',
                              color: '#ffffff',
                              boxShadow: isColumnDropdownOpen
                                ? '0 2px 8px rgba(30, 58, 138, 0.4)'
                                : '0 2px 6px rgba(29, 78, 216, 0.35)',
                              cursor: 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                              transform: isColumnDropdownOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                            }}
                            title="Toggle Columns"
                          >
                            <Plus size={13} strokeWidth={2.5} color="#ffffff" />
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  {/* Expandable Project Body Rows */}
                  {!isCollapsed && (
                    <tbody>
                      {groupTasks.map((task, idx) => {
                        const isStatusOpen = activeStatusDropdown === task._id;
                        return (
                          <tr
                            key={task._id || idx}
                            className="border-bottom project-row-item"
                            style={{ position: 'relative', zIndex: isStatusOpen ? 99999 : 1 }}
                          >
                            {/* Project Title Cell */}
                            <td
                              className="divcon1 cell-project-title mysticky2 col-w-title position-relative cursor-pointer"
                              onClick={() => onTaskClick && onTaskClick(task)}
                              style={{ paddingLeft: '12px', fontSize: '13px' }}
                            >
                              <div className="d-flex align-items-center justify-content-between w-100 pe-2" style={{ overflow: 'hidden' }}>
                                <TruncatedCellText text={task.title || ''} fontSize="13px" />
                                <button
                                  type="button"
                                  className="btn btn-link p-0 ms-2 border-0 bg-transparent flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                                  style={{
                                    opacity: 0.65,
                                    transition: 'all 0.15s ease',
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
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.color = '#2D62ED';
                                    e.currentTarget.style.backgroundColor = '#eff6ff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '0.65';
                                    e.currentTarget.style.color = '#64748b';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                  title={`Chat about ${task.title || 'Task'}`}
                                >
                                  <MessageSquare size={14} strokeWidth={1.8} />
                                </button>
                              </div>
                            </td>

                            {/* Assignees Cell - Left / Start Aligned */}
                            {visibleColumns.assignees && (
                              <td className="divcon2 cell-assignees assignees col-w-assignees">
                                <div className="d-flex align-items-center justify-content-start gap-1 flex-nowrap">
                                  {task.assignees?.map((a, aIdx) => (
                                    <div key={aIdx} className="pm-avatar-circle">
                                      <img
                                        src={a.avatarUrl || '/img/client1.jpg'}
                                        alt="assignee"
                                        className="pm-avatar-img"
                                        onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </td>
                            )}

                            {/* Subitems Cell - Left / Start Aligned */}
                            {visibleColumns.subitems && (
                              <td className="divcon3 cell-subitems subitems col-w-subitems">
                                <div className="d-flex align-items-center justify-content-start gap-1">
                                  <span id="tree_open" className="d-inline-flex align-items-center justify-content-center">
                                    <img src="/icons/subitm.svg" alt="subitem" style={{ width: '14px', height: '14px' }} />
                                  </span>
                                  <span style={{ fontSize: '13px' }}>{idx === 0 ? '1' : ''}</span>
                                </div>
                              </td>
                            )}

                            {/* Planned Date Cell - Left / Start Aligned */}
                            {visibleColumns.plannedDate && (
                              <td
                                className="divcon4 cell-planned-date plannedDate col-w-planned-date position-relative cursor-pointer"
                                onMouseEnter={() => setHoveredPlannedDateTaskId(task._id)}
                                onMouseLeave={() => setHoveredPlannedDateTaskId(null)}
                              >
                                <div className="d-flex align-items-center justify-content-start w-100">
                                  <span className="pm-pill-planned-date">
                                    <TruncatedCellText text={task.plannedDate || 'Oct 20 - 28'} fontSize="13px" />
                                  </span>
                                </div>

                                {hoveredPlannedDateTaskId === task._id && (
                                  <div
                                    className="position-absolute bg-dark text-white rounded px-2 py-1 shadow-lg"
                                    style={{
                                      bottom: '100%',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      marginBottom: '6px',
                                      zIndex: 99999,
                                      fontSize: '11.5px',
                                      fontWeight: '600',
                                      whiteSpace: 'nowrap',
                                      pointerEvents: 'none',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                    }}
                                  >
                                    {calculateTotalDays(task.plannedDate || 'Oct 20 - 28')}
                                  </div>
                                )}
                              </td>
                            )}

                            {/* Actual Date Cell - Left / Start Aligned */}
                            {visibleColumns.actualDate && (
                              <td className="divcon5 cell-actual-date actualDate col-w-actual-date">
                                <div className="d-flex align-items-center justify-content-start w-100">
                                  <span className="pm-pill-actual-date">
                                    <TruncatedCellText text={task.actualDate || 'Oct 20, 2026'} fontSize="13px" />
                                  </span>
                                </div>
                              </td>
                            )}

                            {/* Actual Budget Cell */}
                            {visibleColumns.actualBudget && (
                              <td className="divcon6 cell-actual-budget actualBudget col-w-actual-budget">
                                <TruncatedCellText text={task.actualBudget || '100 AED'} fontSize="13px" />
                              </td>
                            )}

                            {/* Planned Budget Cell */}
                            {visibleColumns.plannedBudget && (
                              <td className="divcon7 cell-planned-budget plannedBudget col-w-planned-budget">
                                <TruncatedCellText text={task.plannedBudget || '100 AED'} fontSize="13px" />
                              </td>
                            )}

                            {/* Project Lead Cell */}
                            {visibleColumns.projectLead && (
                              <td className="divcon8 cell-project-lead projectLead col-w-project-lead">
                                <div
                                  className="d-flex align-items-center gap-2 cursor-pointer overflow-hidden"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLeadProfile({ name: task.projectLead || 'John', type: 'Project Lead' });
                                  }}
                                  title="Click to view Project Lead Profile"
                                >
                                  <div className="pm-avatar-circle border border-white">
                                    <img
                                      src="/img/client1.jpg"
                                      alt="lead"
                                      className="pm-avatar-img"
                                      onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                                    />
                                  </div>
                                  <TruncatedCellText text={task.projectLead || 'John'} fontSize="13px" />
                                </div>
                              </td>
                            )}

                            {/* Domain Lead Cell */}
                            {visibleColumns.domainLead && (
                              <td className="divcon9 cell-domain-lead domainLead col-w-domain-lead">
                                <div
                                  className="d-flex align-items-center gap-2 cursor-pointer overflow-hidden"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLeadProfile({ name: task.domainLead || 'Smith', type: 'Domain Lead' });
                                  }}
                                  title="Click to view Domain Lead Profile"
                                >
                                  <div className="pm-avatar-circle border border-white">
                                    <img
                                      src="/img/client2.jpg"
                                      alt="domain"
                                      className="pm-avatar-img"
                                      onError={(e) => { e.target.src = '/icons/avatar2.svg'; }}
                                    />
                                  </div>
                                  <TruncatedCellText text={task.domainLead || 'Smith'} fontSize="13px" />
                                </div>
                              </td>
                            )}

                            {/* Status Cell */}
                            {visibleColumns.status && (
                              <td className="divcon10 cell-status status col-w-status">
                                <div
                                  className={getStatusClass(task.status)}
                                  style={{ cursor: 'pointer', fontSize: '13px' }}
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
                            )}
                          </tr>
                        );
                      })}

                      {/* Add Row Button */}
                      <tr className="border-bottom">
                        <td
                          className="divcon1 mysticky2 col-w-title"
                          style={{
                            position: 'sticky',
                            left: 0,
                            zIndex: 10,
                            paddingLeft: '12px',
                          }}
                        >
                          <p
                            className="text-primary fw-bold cursor-pointer m-0"
                            onClick={onAddProject}
                            style={{ cursor: 'pointer', fontSize: '13px' }}
                          >
                            + Add
                          </p>
                        </td>
                        <td colSpan={10}></td>
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

      {/* PORTAL FOR ELEVATED COLUMN TOGGLE DROPDOWN */}
      {activeColumnDropdownGroup && columnDropdownPos && createPortal(
        <div
          className="column-dropdown-fadeup position-fixed bg-white shadow-2xl border"
          style={{
            position: 'fixed',
            top: `${columnDropdownPos.top}px`,
            left: `${columnDropdownPos.left}px`,
            zIndex: 999999,
            width: '190px',
            padding: '8px 0',
            boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.25)',
            borderColor: '#e5e7eb',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex flex-column">
            {[
              { key: 'assignees', label: 'Assignees', icon: '/icons/subitm.svg' },
              { key: 'subitems', label: 'Subitems', icon: '/icons/subitm.svg' },
              { key: 'plannedDate', label: 'Planned Date', icon: '/icons/calender.svg' },
              { key: 'actualDate', label: 'Actual Date', icon: '/icons/calender.svg' },
              { key: 'actualBudget', label: 'Actual Budget', icon: '/icons/workload.svg' },
              { key: 'plannedBudget', label: 'Planned Budget', icon: '/icons/workload.svg' },
              { key: 'projectLead', label: 'Project Lead', icon: '/icons/avatar1.svg' },
              { key: 'domainLead', label: 'Domain Lead', icon: '/icons/avatar2.svg' },
              { key: 'status', label: 'Status', icon: '/icons/filter.svg' },
            ].map(({ key, label, icon }) => {
              const visibleColumns = groupVisibleColumns[columnDropdownPos.groupKey] || defaultColumns;
              const isVisible = visibleColumns[key];
              return (
                <div
                  key={key}
                  className="d-flex align-items-center select-none"
                  style={{
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    padding: '8px 16px',
                    color: '#808080',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                  onClick={() => toggleColumn(columnDropdownPos.groupKey, key)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img
                    src={icon}
                    alt=""
                    style={{
                      width: '14px',
                      height: '14px',
                      opacity: isVisible ? 1 : 0.4,
                      filter: isVisible ? 'none' : 'grayscale(100%)',
                    }}
                  />
                  <span style={{ fontSize: '12.5px', color: '#808080', fontWeight: 400 }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ListView;
