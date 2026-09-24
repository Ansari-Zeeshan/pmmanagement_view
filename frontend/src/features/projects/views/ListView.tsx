import { MessageSquare, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LeadProfileModal } from '../../../components/common/LeadProfileModal';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';
import { MilestoneModalPopup } from '../modals/MilestoneModalPopup';

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
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Days`;
    }

    const d1 = new Date(parts[0].trim());
    const d2 = new Date(parts[1].trim());
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
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
            zIndex: 9999999,
            fontSize: '11.5px',
            fontWeight: '500',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxWidth: '320px',
          }}
        >
          {textStr}
        </div>
      )}
    </div>
  );
};

export const ListView = ({ tasks: propsTasks, onTaskStatusChange, onTaskClick, onChatClick, onAddProject, onTaskUpdate }) => {
  const { setChatDrawerOpen, setActiveTaskDetail, tasks: storeTasks, updateTask: storeUpdateTask, addNotification } = useWorkspaceStore();
  const tasks = propsTasks && propsTasks.length > 0 ? propsTasks : storeTasks;

  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null); // taskId
  const [statusDropdownPos, setStatusDropdownPos] = useState(null); // { taskId, top, left }
  const [activeColumnDropdownGroup, setActiveColumnDropdownGroup] = useState(null); // groupKey
  const [columnDropdownPos, setColumnDropdownPos] = useState(null); // { groupKey, top, left }
  const [hoveredPlannedDateTaskId, setHoveredPlannedDateTaskId] = useState(null);
  const [selectedLeadProfile, setSelectedLeadProfile] = useState(null);

  // Subitems & Milestones Expansion States
  const [expandedSubitemsMap, setExpandedSubitemsMap] = useState({});
  const [expandedMilestoneTasksMap, setExpandedMilestoneTasksMap] = useState({});
  const [showAddMilestoneMap, setShowAddMilestoneMap] = useState({});
  const [newMilestoneTitleMap, setNewMilestoneTitleMap] = useState({});
  const [showAddSubtaskMap, setShowAddSubtaskMap] = useState({});
  const [newSubtaskTitleMap, setNewSubtaskTitleMap] = useState({});
  const [newSubtaskDateMap, setNewSubtaskDateMap] = useState({});

  // Milestone Modal State
  const [modalTargetTask, setModalTargetTask] = useState(null);
  const [modalTargetMilestone, setModalTargetMilestone] = useState(null);

  const pastelPalette = [
    { bg: '#F0F9FF', accent: '#0284C7', border: '#BAE6FD', text: '#0369A1' }, // Soft Sky Blue
    { bg: '#FFFBE6', accent: '#D97706', border: '#FEF08A', text: '#B45309' }, // Soft Amber
    { bg: '#FAF5FF', accent: '#9333EA', border: '#E9D5FF', text: '#7E22CE' }, // Soft Lavender
    { bg: '#F0FDF4', accent: '#16A34A', border: '#BBF7D0', text: '#15803D' }, // Soft Mint
    { bg: '#FFF1F2', accent: '#E11D48', border: '#FECDD3', text: '#BE123C' }, // Soft Rose Rose
    { bg: '#ECFEFF', accent: '#0891B2', border: '#A5F3FC', text: '#0E7490' }, // Soft Cyan Teal
  ];

  const toggleSubitemsExpand = (taskId) => {
    setExpandedSubitemsMap((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getMilestonesList = (task) => {
    if (task.milestones && Array.isArray(task.milestones) && task.milestones.length > 0) {
      return task.milestones;
    }
    return [
      {
        id: `${task._id}-m1`,
        title: 'Milestone Name',
        owner: 'Claire Bure',
        dueDate: 'Nov 3',
        date: 'Nov 3',
        timeline: 'Nov 20',
        status: 'On Track',
        tasks: [
          { id: `${task._id}-sub1`, title: 'Scope definition & technical specification sign-off', status: 'Completed', assignee: 'Claire Bure', date: '2026-11-10' },
          { id: `${task._id}-sub2`, title: 'UI/UX Wireframing & Design System review', status: 'Completed', assignee: 'Ajmal Khan', date: '2026-11-15' },
        ],
      },
      {
        id: `${task._id}-m2`,
        title: 'Milestone Name',
        owner: 'Ajmal Khan',
        dueDate: 'Nov 3',
        date: 'Nov 3',
        timeline: 'Nov 20',
        status: 'On Track',
        tasks: [
          { id: `${task._id}-sub3`, title: 'Kanban board & drag and drop architecture', status: 'In Progress', assignee: 'Claire Bure', date: '2026-11-18' },
          { id: `${task._id}-sub4`, title: 'Gantt timeline & calendar synchronization', status: 'In Progress', assignee: 'Smith', date: '2026-11-20' },
        ],
      },
      {
        id: `${task._id}-m3`,
        title: 'Milestone Name',
        owner: 'Logan Harrington',
        dueDate: 'Nov 3',
        date: 'Nov 3',
        timeline: 'Nov 20',
        status: 'On Track',
        tasks: [
          { id: `${task._id}-sub5`, title: 'UAT testing, security compliance & production launch', status: 'Pending', assignee: 'Ajmal Khan', date: '2026-11-25' },
        ],
      },
    ];
  };

  const handleSaveMilestoneModal = (updatedMilestone) => {
    if (!modalTargetTask) return;
    const currentMilestones = getMilestonesList(modalTargetTask);
    const exists = currentMilestones.some((m) => m.id === updatedMilestone.id);
    let updatedMilestones;
    if (exists) {
      updatedMilestones = currentMilestones.map((m) => (m.id === updatedMilestone.id ? updatedMilestone : m));
    } else {
      updatedMilestones = [...currentMilestones, updatedMilestone];
    }
    const updatedTask = {
      ...modalTargetTask,
      milestones: updatedMilestones,
    };
    storeUpdateTask(updatedTask);
    if (onTaskUpdate) onTaskUpdate(updatedTask);

    addNotification({
      id: 'notif-' + Date.now(),
      title: 'Milestone Updated',
      message: `Milestone '${updatedMilestone.title}' status set to '${updatedMilestone.status}' in '${modalTargetTask.title}'.`,
      time: 'Just now',
      type: updatedMilestone.status === 'At Risk' ? 'warning' : 'success',
      read: false,
      projectRef: modalTargetTask.reference || 'PRJ-1024',
    });

    setModalTargetTask(null);
    setModalTargetMilestone(null);
  };

  const handleAddMilestone = (task, milestoneTitle) => {
    if (!milestoneTitle || !milestoneTitle.trim()) return;
    const currentMilestones = getMilestonesList(task);
    const newMilestone = {
      id: `m-${Date.now()}`,
      title: milestoneTitle.trim(),
      dueDate: '2026-11-30',
      status: 'In Progress',
      tasks: [],
    };
    const updatedTask = {
      ...task,
      milestones: [...currentMilestones, newMilestone],
    };
    if (onTaskUpdate) onTaskUpdate(updatedTask);
    setNewMilestoneTitleMap((prev) => ({ ...prev, [task._id]: '' }));
    setShowAddMilestoneMap((prev) => ({ ...prev, [task._id]: false }));
  };

  const handleAddSubTask = (task, milestoneId, subTaskTitle, targetDate) => {
    if (!subTaskTitle || !subTaskTitle.trim()) return;
    const currentMilestones = getMilestonesList(task);
    const newSubTask = {
      id: `sub-${Date.now()}`,
      title: subTaskTitle.trim(),
      status: 'Pending',
      assignee: 'Claire Bure',
      date: targetDate || '2026-11-20',
    };
    const updatedMilestones = currentMilestones.map((m) => {
      if (m.id === milestoneId) {
        return { ...m, tasks: [...(m.tasks || []), newSubTask] };
      }
      return m;
    });
    const updatedTask = {
      ...task,
      milestones: updatedMilestones,
    };
    if (onTaskUpdate) onTaskUpdate(updatedTask);
    setNewSubtaskTitleMap((prev) => ({ ...prev, [milestoneId]: '' }));
    setNewSubtaskDateMap((prev) => ({ ...prev, [milestoneId]: '' }));
    setShowAddSubtaskMap((prev) => ({ ...prev, [milestoneId]: false }));
    setExpandedMilestoneTasksMap((prev) => ({ ...prev, [milestoneId]: true }));
  };

  const updateSubtaskField = (task, milestoneId, subTaskId, field, value) => {
    const currentMilestones = getMilestonesList(task);
    const updatedMilestones = currentMilestones.map((m) => {
      if (m.id === milestoneId) {
        const updatedTasks = (m.tasks || []).map((st) => {
          if (st.id === subTaskId) {
            return { ...st, [field]: value };
          }
          return st;
        });
        return { ...m, tasks: updatedTasks };
      }
      return m;
    });
    const updatedTask = {
      ...task,
      milestones: updatedMilestones,
    };
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

  const toggleSubtaskStatus = (task, milestoneId, subTaskId) => {
    const currentMilestones = getMilestonesList(task);
    const updatedMilestones = currentMilestones.map((m) => {
      if (m.id === milestoneId) {
        const updatedTasks = (m.tasks || []).map((st) => {
          if (st.id === subTaskId) {
            const nextStatus = st.status === 'Completed' ? 'In Progress' : st.status === 'In Progress' ? 'Pending' : 'Completed';
            return { ...st, status: nextStatus };
          }
          return st;
        });
        return { ...m, tasks: updatedTasks };
      }
      return m;
    });
    const updatedTask = {
      ...task,
      milestones: updatedMilestones,
    };
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

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
                <table className="workspace-group-table pm-workspace-group-table" style={{ tableLayout: 'fixed', minWidth: '1515px', width: '100%' }}>
                  {/* Table Header Row */}
                  <thead
                    className="workspace-group-thead pm-workspace-group-thead"
                    style={{ position: 'relative', zIndex: isColumnDropdownOpen ? 99999 : 25 }}
                  >
                    <tr>
                      {/* Project Title Header Column */}
                      <th
                        className="head1 th-project-group-title col-w-title"
                        style={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 30,
                          backgroundColor: '#ffffff',
                          boxShadow: '2px 0 6px rgba(0,0,0,0.06)',
                        }}
                      >
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
                          <React.Fragment key={task._id || idx}>
                            <tr
                              className="border-bottom project-row-item"
                              style={{ position: 'relative', zIndex: isStatusOpen ? 99999 : 1 }}
                            >
                            {/* Project Title Cell */}
                            <td
                              className="divcon1 cell-project-title col-w-title cursor-pointer"
                              onClick={() => onTaskClick && onTaskClick(task)}
                              style={{
                                position: 'sticky',
                                left: 0,
                                zIndex: 10,
                                backgroundColor: '#ffffff',
                                boxShadow: '2px 0 6px rgba(0,0,0,0.06)',
                                paddingLeft: '12px',
                                fontSize: '13px',
                              }}
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
                                        onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </td>
                            )}

                            {/* Subitems Cell - Left / Start Aligned */}
                            {visibleColumns.subitems && (() => {
                              const milestonesList = getMilestonesList(task);
                              const hasMilestones = milestonesList && milestonesList.length > 0;
                              return (
                                <td
                                  className={`divcon3 cell-subitems subitems col-w-subitems ${hasMilestones ? 'cursor-pointer' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (hasMilestones) {
                                      toggleSubitemsExpand(task._id);
                                    }
                                  }}
                                  title={hasMilestones ? "Click to view & manage Milestones and Sub-tasks" : "No milestones created"}
                                  style={{ cursor: hasMilestones ? 'pointer' : 'default' }}
                                >
                                  <div className="d-flex align-items-center justify-content-start gap-1 ms-1">
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        color: hasMilestones ? '#64748b' : '#cbd5e1',
                                        transition: 'transform 0.2s ease',
                                        display: 'inline-block',
                                        transform: expandedSubitemsMap[task._id] ? 'rotate(90deg)' : 'rotate(0deg)',
                                        userSelect: 'none',
                                        cursor: hasMilestones ? 'pointer' : 'default',
                                      }}
                                    >
                                      ▶
                                    </span>
                                    <img
                                      src="/icons/subitm.svg"
                                      alt="subitem"
                                      style={{ width: '14px', height: '14px', cursor: hasMilestones ? 'pointer' : 'default', opacity: hasMilestones ? 1 : 0.4 }}
                                    />
                                    <span className="font-monospace fw-bold text-dark ms-0.5" style={{ fontSize: '13px', cursor: hasMilestones ? 'pointer' : 'default' }}>
                                      {milestonesList.length}
                                    </span>
                                  </div>
                                </td>
                              );
                            })()}

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
                                      zIndex: 9999999,
                                      fontSize: '11.5px',
                                      fontWeight: '600',
                                      whiteSpace: 'nowrap',
                                      pointerEvents: 'none',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
                                      onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
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
                                      onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }}
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

                            {/* 11. Column Toggle Spacer Cell to perfectly match the 11-column <thead> header width */}
                            <td className="divcon11 cell-column-toggle col-w-toggle"></td>
                          </tr>

                          {/* Inline Subitems / Milestones & Tasks Expansion Row */}
                          {expandedSubitemsMap[task._id] && (
                            <tr className="border-bottom">
                              <td colSpan={11} className="p-0" style={{ backgroundColor: '#ffffff' }}>
                                <div className="w-100" style={{ borderTop: '1px solid #e2e8f0', position: 'relative' }}>
                                  {/* Milestone Sub-Table Header matching media_1790015780654.png */}
                                  <table className="table table-borderless align-middle m-0" style={{ tableLayout: 'fixed', minWidth: '1070px', width: '100%' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9', height: '40px' }}>
                                        <th className="ps-4 text-dark fw-bold position-sticky start-0 bg-white" style={{ fontSize: '13px', width: '280px', minWidth: '280px', left: 0, zIndex: 12, backgroundColor: '#ffffff', boxShadow: '2px 0 6px rgba(0,0,0,0.06)' }}>Milestone Name</th>
                                        <th className="text-dark fw-bold" style={{ fontSize: '13px', width: '110px', minWidth: '110px' }}>Subitems</th>
                                        <th className="text-dark fw-bold" style={{ fontSize: '13px', width: '160px', minWidth: '160px' }}>Owner</th>
                                        <th className="text-dark fw-bold text-center" style={{ fontSize: '13px', width: '160px', minWidth: '160px' }}>Status</th>
                                        <th className="text-dark fw-bold" style={{ fontSize: '13px', width: '140px', minWidth: '140px' }}>Date</th>
                                        <th className="text-dark fw-bold text-center pe-4" style={{ fontSize: '13px', width: '220px', minWidth: '220px' }}>
                                          <div className="d-flex align-items-center justify-content-between">
                                            <span>Timeline</span>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-primary rounded-pill px-2 py-1 fw-bold d-inline-flex align-items-center justify-content-center gap-1"
                                              style={{ fontSize: '11px', height: '26px', cursor: 'pointer' }}
                                              onClick={() => {
                                                setModalTargetTask(task);
                                                setModalTargetMilestone(null);
                                              }}
                                            >
                                              <Plus size={12} /> Add Milestone
                                            </button>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {getMilestonesList(task).map((m, mIdx) => {
                                        const palette = pastelPalette[mIdx % pastelPalette.length];
                                        const isMilestoneExpanded = Boolean(expandedMilestoneTasksMap[m.id]);
                                        return (
                                          <React.Fragment key={m.id || mIdx}>
                                            <tr
                                              style={{
                                                backgroundColor: palette.bg,
                                                borderBottom: `1px solid ${palette.border}`,
                                                height: '46px',
                                              }}
                                            >
                                              {/* Milestone Name - Rock-Solid Sticky Column 1 */}
                                              <td className="ps-4 py-2 position-sticky start-0" style={{ width: '280px', minWidth: '280px', left: 0, zIndex: 11, backgroundColor: palette.bg, boxShadow: '2px 0 6px rgba(0,0,0,0.06)' }}>
                                                <div
                                                  className="d-flex align-items-center justify-content-between gap-2 cursor-pointer"
                                                  onClick={() => {
                                                    setModalTargetTask(task);
                                                    setModalTargetMilestone(m);
                                                  }}
                                                  title="Click to edit milestone prefilled details"
                                                  style={{ cursor: 'pointer' }}
                                                >
                                                  <div className="d-flex align-items-center gap-1.5 text-truncate">
                                                    <span style={{ color: palette.accent, fontSize: '14px', lineHeight: 1 }}>♦</span>
                                                    <span className="fw-semibold text-truncate" style={{ fontSize: '13px', color: '#1e293b' }}>
                                                      {m.title || 'Milestone Name'}
                                                    </span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-light border px-2 py-0.5 rounded-pill text-primary fw-bold flex-shrink-0 d-inline-flex align-items-center gap-1 shadow-sm"
                                                    style={{ fontSize: '10.5px' }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setModalTargetTask(task);
                                                      setModalTargetMilestone(m);
                                                    }}
                                                  >
                                                    Edit
                                                  </button>
                                                </div>
                                              </td>

                                              {/* Subitems */}
                                              {(() => {
                                                const subtasksCount = (m.tasks || []).length;
                                                const hasSubtasks = subtasksCount > 0;
                                                return (
                                                  <td className="py-2" style={{ width: '110px', minWidth: '110px' }}>
                                                    <div
                                                      className="d-flex align-items-center gap-1"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (hasSubtasks) {
                                                          setExpandedMilestoneTasksMap((prev) => ({
                                                            ...prev,
                                                            [m.id]: !prev[m.id],
                                                          }));
                                                        }
                                                      }}
                                                      style={{ cursor: hasSubtasks ? 'pointer' : 'default' }}
                                                      title={hasSubtasks ? "Click to view & manage sub-tasks" : "No sub-tasks defined"}
                                                    >
                                                      <span
                                                        style={{
                                                          fontSize: '11px',
                                                          color: hasSubtasks ? '#64748b' : '#cbd5e1',
                                                          transition: 'transform 0.2s ease',
                                                          display: 'inline-flex',
                                                          alignItems: 'center',
                                                          transform: isMilestoneExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                                          cursor: hasSubtasks ? 'pointer' : 'default',
                                                        }}
                                                      >
                                                        ▶
                                                      </span>
                                                      <img
                                                        src="/icons/subitm.svg"
                                                        alt=""
                                                        style={{ width: '14px', height: '14px', cursor: hasSubtasks ? 'pointer' : 'default', opacity: hasSubtasks ? 1 : 0.4 }}
                                                      />
                                                      <span
                                                        className="badge rounded-pill bg-white text-dark border ms-1 fw-bold"
                                                        style={{ fontSize: '10.5px', cursor: hasSubtasks ? 'pointer' : 'default' }}
                                                      >
                                                        {subtasksCount}
                                                      </span>
                                                    </div>
                                                  </td>
                                                );
                                              })()}

                                              {/* Owner */}
                                              <td className="py-2" style={{ width: '160px', minWidth: '160px' }}>
                                                <div
                                                  className="d-flex align-items-center gap-1 cursor-pointer"
                                                  onClick={() => {
                                                    setModalTargetTask(task);
                                                    setModalTargetMilestone(m);
                                                  }}
                                                  style={{ cursor: 'pointer' }}
                                                  title="Click to change owner"
                                                >
                                                  <div className="pm-avatar-circle" style={{ width: '24px', height: '24px' }}>
                                                    <img
                                                      src="/img/client1.jpg"
                                                      alt="Owner"
                                                      className="pm-avatar-img"
                                                      onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                                                    />
                                                  </div>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm p-0 rounded-circle border border-dashed text-muted d-inline-flex align-items-center justify-content-center"
                                                    style={{ width: '22px', height: '22px', borderColor: '#94a3b8', fontSize: '11px', lineHeight: 1, cursor: 'pointer' }}
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              </td>

                                              {/* Status - Properly Centered */}
                                              <td className="py-2 text-center" style={{ width: '160px', minWidth: '160px' }}>
                                                <div
                                                  className="d-inline-flex align-items-center justify-content-center px-3 py-1 text-white fw-semibold cursor-pointer mx-auto"
                                                  style={{
                                                    backgroundColor:
                                                      m.status === 'Completed' || m.status === 'Approved'
                                                        ? '#10B981'
                                                        : m.status === 'At Risk'
                                                        ? '#EF4444'
                                                        : '#E5A65E',
                                                    fontSize: '12.5px',
                                                    minWidth: '96px',
                                                    height: '28px',
                                                    borderRadius: '4px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                  }}
                                                  onClick={() => {
                                                    setModalTargetTask(task);
                                                    setModalTargetMilestone(m);
                                                  }}
                                                  title="Click to update milestone status"
                                                >
                                                  {m.status || 'On Track'}
                                                </div>
                                              </td>

                                              {/* Date */}
                                              <td className="py-2" style={{ width: '140px', minWidth: '140px' }}>
                                                <span className="fw-semibold" style={{ fontSize: '13px', color: '#1e293b' }}>
                                                  {m.date || m.dueDate || 'Nov 3'}
                                                </span>
                                              </td>

                                              {/* Timeline - Properly Centered */}
                                              <td className="py-2 pe-4 text-center" style={{ width: '220px', minWidth: '220px' }}>
                                                <div
                                                  className="d-inline-flex align-items-center justify-content-center px-3 py-1 text-white fw-bold rounded-pill mx-auto"
                                                  style={{
                                                    backgroundColor: '#1E293B',
                                                    fontSize: '12px',
                                                    minWidth: '100px',
                                                    height: '26px',
                                                    textAlign: 'center',
                                                  }}
                                                >
                                                  {m.timeline || 'Nov 20'}
                                                </div>
                                              </td>
                                            </tr>

                                            {/* Nested Sub-tasks Row */}
                                            {isMilestoneExpanded && (
                                              <tr className="bg-white border-bottom">
                                                <td colSpan={6} className="p-3 ps-5 bg-white">
                                                  <div className="bg-light rounded-3 border p-3">
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                      <div className="d-flex align-items-center gap-2">
                                                        <span className="fw-bold text-dark small">Sub-tasks for {m.title || 'Milestone'}</span>
                                                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-0.5 font-monospace fw-bold" style={{ fontSize: '11px' }}>
                                                          {(m.tasks || []).length} tasks
                                                        </span>
                                                      </div>
                                                      <div className="d-flex align-items-center gap-2">
                                                        <button
                                                          type="button"
                                                          className="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center justify-content-center gap-1 shadow-sm"
                                                          style={{ fontSize: '11.5px', height: '28px', backgroundColor: '#2563eb', borderColor: '#2563eb', cursor: 'pointer' }}
                                                          onClick={() => {
                                                            setShowAddSubtaskMap((prev) => ({ ...prev, [m.id]: !prev[m.id] }));
                                                          }}
                                                        >
                                                          <Plus size={13} /> Add Sub-task
                                                        </button>
                                                        <button
                                                          type="button"
                                                          className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center justify-content-center"
                                                          style={{ fontSize: '11.5px', height: '28px', cursor: 'pointer' }}
                                                          onClick={() => {
                                                            setModalTargetTask(task);
                                                            setModalTargetMilestone(m);
                                                          }}
                                                        >
                                                          Edit Milestone Popup
                                                        </button>
                                                      </div>
                                                    </div>

                                                    {/* Inline Add Sub-task Input Form */}
                                                    {(showAddSubtaskMap[m.id] || (m.tasks || []).length === 0) && (
                                                      <div className="d-flex align-items-center gap-2 mb-3 bg-white p-2 rounded-3 border shadow-sm">
                                                        <input
                                                          type="text"
                                                          className="form-control form-control-sm rounded-3 px-3"
                                                          placeholder="Type new sub-task title and press Enter..."
                                                          value={newSubtaskTitleMap[m.id] || ''}
                                                          onChange={(e) => setNewSubtaskTitleMap((prev) => ({ ...prev, [m.id]: e.target.value }))}
                                                          onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                              e.preventDefault();
                                                              handleAddSubTask(task, m.id, newSubtaskTitleMap[m.id], newSubtaskDateMap[m.id]);
                                                            }
                                                          }}
                                                          style={{ fontSize: '13px', height: '36px', borderColor: '#cbd5e1' }}
                                                          autoFocus
                                                        />
                                                        <input
                                                          type="date"
                                                          className="form-control form-control-sm rounded-3 px-2 flex-shrink-0"
                                                          value={newSubtaskDateMap[m.id] || '2026-11-20'}
                                                          onChange={(e) => setNewSubtaskDateMap((prev) => ({ ...prev, [m.id]: e.target.value }))}
                                                          style={{ fontSize: '12px', height: '36px', width: '140px', borderColor: '#cbd5e1', cursor: 'pointer' }}
                                                          title="Choose target date for sub-task"
                                                        />
                                                        <button
                                                          type="button"
                                                          className="btn btn-sm btn-success rounded-3 px-3 fw-bold flex-shrink-0 d-inline-flex align-items-center justify-content-center gap-1"
                                                          style={{ fontSize: '12.5px', height: '36px', backgroundColor: '#10b981', borderColor: '#10b981', cursor: 'pointer' }}
                                                          onClick={() => handleAddSubTask(task, m.id, newSubtaskTitleMap[m.id], newSubtaskDateMap[m.id])}
                                                        >
                                                          <Plus size={14} /> Add Sub-task
                                                        </button>
                                                      </div>
                                                    )}

                                                    {/* Sub-tasks Table */}
                                                    {m.tasks && m.tasks.length > 0 ? (
                                                      <div className="table-responsive bg-white rounded-3 border">
                                                        <table className="table table-sm table-hover m-0 align-middle" style={{ fontSize: '12px' }}>
                                                          <thead className="bg-light">
                                                            <tr className="text-muted">
                                                              <th className="ps-3 py-2">Sub-task Title</th>
                                                              <th className="py-2" style={{ width: '160px' }}>Assignee</th>
                                                              <th className="py-2" style={{ width: '150px' }}>Target Date</th>
                                                              <th className="pe-3 py-2 text-center" style={{ width: '130px' }}>Status</th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {m.tasks.map((st) => (
                                                              <tr key={st.id}>
                                                                <td className="ps-3 fw-medium text-dark">{st.title}</td>
                                                                <td>
                                                                  <div className="d-flex align-items-center gap-1.5">
                                                                    <img src="/img/client1.jpg" alt="" className="rounded-circle" style={{ width: '20px', height: '20px' }} />
                                                                    <span className="text-secondary">{st.assignee || 'Claire Bure'}</span>
                                                                  </div>
                                                                </td>
                                                                <td>
                                                                  <input
                                                                    type="date"
                                                                    className="form-control form-control-sm border-0 bg-transparent text-dark p-0 shadow-none fw-medium"
                                                                    style={{ fontSize: '12px', width: '135px', cursor: 'pointer' }}
                                                                    value={st.date && st.date.includes('-') ? st.date : '2026-11-10'}
                                                                    onChange={(e) => updateSubtaskField(task, m.id, st.id, 'date', e.target.value)}
                                                                    title="Click to choose target date for sub-task"
                                                                  />
                                                                </td>
                                                                <td className="pe-3 text-center">
                                                                  <span
                                                                    className={`badge rounded-pill px-3 py-1 cursor-pointer fw-semibold ${
                                                                      st.status === 'Completed' || st.status === 'Approved'
                                                                        ? 'bg-success text-white'
                                                                        : st.status === 'In Progress'
                                                                        ? 'bg-primary text-white'
                                                                        : 'bg-secondary text-white'
                                                                    }`}
                                                                    style={{ fontSize: '11px', display: 'inline-block', minWidth: '90px', textAlign: 'center', cursor: 'pointer' }}
                                                                    onClick={() => toggleSubtaskStatus(task, m.id, st.id)}
                                                                    title="Click to toggle sub-task status"
                                                                  >
                                                                    {st.status || 'Pending'}
                                                                  </span>
                                                                </td>
                                                              </tr>
                                                            ))}
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    ) : (
                                                      <div className="text-muted small fst-italic p-3 bg-white rounded-3 border text-center">
                                                        No sub-tasks present yet under this milestone. Enter sub-task title above and choose a target date to add your first sub-task.
                                                      </div>
                                                    )}
                                                  </div>
                                                </td>
                                              </tr>
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}

                      {/* Add Row Button */}
                      <tr className="border-bottom">
                        <td
                          className="divcon1 col-w-title"
                          style={{
                            position: 'sticky',
                            left: 0,
                            zIndex: 10,
                            backgroundColor: '#ffffff',
                            boxShadow: '2px 0 6px rgba(0,0,0,0.06)',
                            paddingLeft: '12px',
                          }}
                        >
                          <p
                            className="text-primary fw-bold cursor-pointer m-0"
                            onClick={() => onAddProject && onAddProject(group.key)}
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

      {/* Milestone Creation / Editing Modal Popup */}
      {modalTargetTask && (
        <MilestoneModalPopup
          task={modalTargetTask}
          milestone={modalTargetMilestone}
          onClose={() => {
            setModalTargetTask(null);
            setModalTargetMilestone(null);
          }}
          onSave={handleSaveMilestoneModal}
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
                        const targetTask = tasks.find((t) => t._id === statusDropdownPos.taskId);
                        if (targetTask) {
                          const updated = { ...targetTask, status: st.label };
                          storeUpdateTask(updated);
                          addNotification({
                            id: 'notif-' + Date.now(),
                            title: 'Project Status Updated',
                            message: `Project ${targetTask.reference || ''} '${targetTask.title}' status changed from '${targetTask.status || 'On Track'}' to '${st.label}'.`,
                            time: 'Just now',
                            type: st.label === 'At Risk' ? 'warning' : 'info',
                            read: false,
                            projectRef: targetTask.reference || 'PRJ-1024',
                          });
                        }
                        if (onTaskStatusChange) onTaskStatusChange(statusDropdownPos.taskId, st.label);
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
