import React, { useState } from 'react';

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
  minCharsForEllipsis = 0,
}) => {
  const textRef = React.useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const textStr = String(text || '');
  const isOverLength = minCharsForEllipsis > 0 ? textStr.length > minCharsForEllipsis : true;

  const handleMouseEnter = () => {
    if (isOverLength && textRef.current) {
      const hasOverflow = textRef.current.scrollWidth > textRef.current.clientWidth;
      setIsOverflowing(hasOverflow);
    } else {
      setIsOverflowing(false);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="position-relative d-inline-block w-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          textOverflow: isOverLength ? 'ellipsis' : 'clip',
          margin: 0,
          fontSize,
          color: '#1e293b',
          lineHeight: 1.3,
          ...style,
        }}
      >
        {textStr}
      </p>

      {isHovered && isOverLength && isOverflowing && (
        <div
          className="position-absolute bg-dark text-white rounded px-2 py-1 shadow-lg"
          style={{
            bottom: '100%',
            left: 0,
            marginBottom: '4px',
            zIndex: 9999,
            fontSize: '11.5px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          {textStr}
        </div>
      )}
    </div>
  );
};

export const ListView = ({ tasks = [], onTaskStatusChange, onTaskClick, onChatClick, onAddProject }) => {
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null); // taskId
  const [activeColumnDropdownGroup, setActiveColumnDropdownGroup] = useState(null); // groupKey
  const [hoveredPlannedDateTaskId, setHoveredPlannedDateTaskId] = useState(null);
  const [hoveredTitleTaskId, setHoveredTitleTaskId] = useState(null);

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
    <div className="list tab_content position-relative active w-100">
      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => (t.group || 'Research') === group.key);
        const isCollapsed = collapsedGroups[group.key];
        const visibleColumns = groupVisibleColumns[group.key] || defaultColumns;
        const isColumnDropdownOpen = activeColumnDropdownGroup === group.key;

        return (
          <div key={group.key} className={`project1 ${group.colorClass} mb-4`}>
            <div className="projectcon1 mt-0 mb-0">
              <div className="child-border table-scroll-wrapper">
                <table className="workspace-group-table">
                  {/* Table Header Row */}
                  <thead className="workspace-group-thead">
                    <tr>
                      <th
                        className="head1 mysticky2"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span onClick={() => toggleGroup(group.key)} style={{ cursor: 'pointer' }}>
                            <img
                              src="/icons/dropdown-1.svg"
                              alt="toggle"
                              style={{
                                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                              }}
                            />
                          </span>
                          <span className="dot" style={{ backgroundColor: group.dotColor, width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block' }}></span>
                          <h5 className="m-0" style={{ fontSize: '15px', fontWeight: 600 }}>{group.title}</h5>
                        </div>
                      </th>

                      {visibleColumns.assignees && (
                        <th className="head2 assignees">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Assignees</h5>
                        </th>
                      )}
                      {visibleColumns.subitems && (
                        <th className="head3 subitems">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Subitems</h5>
                        </th>
                      )}
                      {visibleColumns.plannedDate && (
                        <th className="head4 plannedDate">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Planned Date</h5>
                        </th>
                      )}
                      {visibleColumns.actualDate && (
                        <th className="head5 actualDate">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Actual Date</h5>
                        </th>
                      )}
                      {visibleColumns.actualBudget && (
                        <th className="head6 actualBudget">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Actual Budget</h5>
                        </th>
                      )}
                      {visibleColumns.plannedBudget && (
                        <th className="head7 plannedBudget">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Planned Budget</h5>
                        </th>
                      )}
                      {visibleColumns.projectLead && (
                        <th className="head8 projectLead">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Project Lead</h5>
                        </th>
                      )}
                      {visibleColumns.domainLead && (
                        <th className="head9 domainLead">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Domain Lead</h5>
                        </th>
                      )}
                      {visibleColumns.status && (
                        <th className="head10 status">
                          <h5 className="m-0" style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>Status</h5>
                        </th>
                      )}

                      <th className="head11 ps-0">
                        <div className="position-relative d-inline-block">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveColumnDropdownGroup(isColumnDropdownOpen ? null : group.key);
                            }}
                            style={{
                              width: '20px',
                              height: '20px',
                              backgroundColor: '#2D62ED',
                              borderRadius: '50%',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              userSelect: 'none',
                              lineHeight: 1,
                            }}
                            title="Toggle Columns"
                          >
                            +
                          </span>

                          {isColumnDropdownOpen && (
                            <div
                              className="position-absolute end-0 top-100 mt-2 bg-white shadow-lg border py-2 px-0"
                              style={{
                                zIndex: 9999,
                                width: '180px',
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.16)',
                                borderColor: '#e5e7eb',
                                borderRadius: '6px',
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
                                  const isVisible = visibleColumns[key];
                                  return (
                                    <div
                                      key={key}
                                      className="d-flex align-items-center gap-2 px-3 py-1.5 cursor-pointer select-none"
                                      style={{
                                        cursor: 'pointer',
                                        fontSize: '12.5px',
                                        color: isVisible ? '#2D62ED' : '#64748b',
                                        backgroundColor: 'transparent',
                                        transition: 'background-color 0.15s',
                                      }}
                                      onClick={() => toggleColumn(group.key, key)}
                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                      <img
                                        src={icon}
                                        alt=""
                                        style={{
                                          width: '13px',
                                          height: '13px',
                                          opacity: isVisible ? 1 : 0.4,
                                          filter: isVisible ? 'none' : 'grayscale(100%)',
                                        }}
                                      />
                                      <span className={isVisible ? 'fw-medium' : ''} style={{ fontSize: '12.5px' }}>
                                        {label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>

                  {/* Expandable Project Body Rows */}
                  {!isCollapsed && (
                    <tbody>
                      {groupTasks.map((task, idx) => (
                        <tr key={task._id || idx} className="border-bottom project-row-item">
                          <td
                            className="divcon1 mysticky2 position-relative"
                            onClick={() => onTaskClick && onTaskClick(task)}
                            style={{
                              cursor: 'pointer',
                              position: 'sticky',
                              left: 0,
                              zIndex: 10,
                              minWidth: '300px',
                              width: '300px',
                              fontSize: '13px',
                              paddingLeft: '12px',
                            }}
                          >
                            <p className="m-0 text-nowrap" style={{ fontSize: '13px', color: '#1e293b', whiteSpace: 'nowrap' }}>
                              {task.title || ''}
                            </p>
                          </td>

                          {visibleColumns.assignees && (
                            <td className="divcon2 assignees" style={{ fontSize: '13px' }}>
                              <div className="d-flex align-items-center gap-1 flex-nowrap">
                                {task.assignees?.map((a, aIdx) => (
                                  <div
                                    key={aIdx}
                                    className="avatar-wrapper"
                                    style={{
                                      width: '26px',
                                      height: '26px',
                                      borderRadius: '50%',
                                      overflow: 'hidden',
                                      flexShrink: 0,
                                      display: 'inline-block',
                                    }}
                                  >
                                    <img
                                      src={a.avatarUrl || '/img/client1.jpg'}
                                      alt="assignee"
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        display: 'block',
                                      }}
                                      onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </td>
                          )}

                          {visibleColumns.subitems && (
                            <td className="divcon3 subitems" style={{ fontSize: '13px' }}>
                              <span id="tree_open">
                                <img src="/icons/subitm.svg" alt="subitem" />
                              </span>
                              <span className="ms-3" style={{ fontSize: '13px' }}>{idx === 0 ? '1' : ''}</span>
                            </td>
                          )}

                          {visibleColumns.plannedDate && (
                            <td
                              className="divcon4 plannedDate position-relative"
                              onMouseEnter={() => setHoveredPlannedDateTaskId(task._id)}
                              onMouseLeave={() => setHoveredPlannedDateTaskId(null)}
                              style={{ position: 'relative', cursor: 'pointer', fontSize: '13px' }}
                            >
                              <span
                                style={{
                                  backgroundColor: '#cedbfe',
                                  borderRadius: '12px',
                                  padding: '3px 10px',
                                  fontSize: '13px',
                                  color: '#1e293b',
                                  fontWeight: 500,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  whiteSpace: 'nowrap',
                                  minWidth: '95px',
                                }}
                              >
                                {task.plannedDate || 'Oct 20 - 28'}
                              </span>

                              {hoveredPlannedDateTaskId === task._id && (
                                <div
                                  className="position-absolute bg-dark text-white rounded px-2 py-1 shadow-lg"
                                  style={{
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    marginBottom: '6px',
                                    zIndex: 9999,
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

                          {visibleColumns.actualDate && (
                            <td className="divcon5 actualDate" style={{ fontSize: '13px' }}>
                              <span
                                style={{
                                  backgroundColor: '#f1f5f9',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '12px',
                                  padding: '3px 10px',
                                  fontSize: '13px',
                                  color: '#334155',
                                  fontWeight: 500,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  whiteSpace: 'nowrap',
                                  minWidth: '95px',
                                }}
                              >
                                {task.actualDate || 'Oct 20, 2026'}
                              </span>
                            </td>
                          )}

                          {visibleColumns.actualBudget && (
                            <td className="divcon6 actualBudget" style={{ fontSize: '13px' }}>
                              <p className="m-0 text-nowrap" style={{ fontSize: '13px', color: '#1e293b', whiteSpace: 'nowrap' }}>
                                {task.actualBudget || 'AED 200'}
                              </p>
                            </td>
                          )}

                          {visibleColumns.plannedBudget && (
                            <td className="divcon7 plannedBudget" style={{ fontSize: '13px' }}>
                              {task.plannedBudget && task.plannedBudget.length > 150 ? (
                                <TruncatedCellText text={task.plannedBudget} fontSize="13px" minCharsForEllipsis={150} />
                              ) : (
                                <p className="m-0 text-nowrap" style={{ fontSize: '13px', color: '#1e293b', whiteSpace: 'nowrap' }}>
                                  {task.plannedBudget || 'AED 100'}
                                </p>
                              )}
                            </td>
                          )}

                          {visibleColumns.projectLead && (
                            <td className="divcon8 projectLead" style={{ fontSize: '13px' }}>
                              <div className="d-flex align-items-center gap-2">
                                <div className="avatar-wrapper" style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                  <img
                                    src="/img/client1.jpg"
                                    alt="lead"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                                    onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                                  />
                                </div>
                                <p className="m-0 text-nowrap" style={{ fontSize: '13px', color: '#1e293b', whiteSpace: 'nowrap' }}>
                                  {task.projectLead || 'John'}
                                </p>
                              </div>
                            </td>
                          )}

                          {visibleColumns.domainLead && (
                            <td className="divcon9 domainLead" style={{ fontSize: '13px' }}>
                              <div className="d-flex align-items-center gap-2">
                                <div className="avatar-wrapper" style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                  <img
                                    src="/img/client2.jpg"
                                    alt="domain"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                                    onError={(e) => { e.target.src = '/icons/avatar2.svg'; }}
                                  />
                                </div>
                                <p className="m-0 text-nowrap" style={{ fontSize: '13px', color: '#1e293b', whiteSpace: 'nowrap' }}>
                                  {task.domainLead || 'Smith'}
                                </p>
                              </div>
                            </td>
                          )}

                          {visibleColumns.status && (
                            <td className="divcon10 status position-relative" style={{ fontSize: '13px' }}>
                              <div
                                className={getStatusClass(task.status)}
                                style={{ cursor: 'pointer', fontSize: '13px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveStatusDropdown(activeStatusDropdown === task._id ? null : task._id);
                                }}
                              >
                                {task.status || 'On Track'}
                              </div>

                              {/* STATUS GRID POPOVER */}
                              {activeStatusDropdown === task._id && (
                                <div
                                  className="dropdown-menu show shadow-lg p-2 border-0 position-absolute end-0 top-100 bg-white"
                                  style={{ zIndex: 1080, width: '270px', borderRadius: '8px' }}
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
                                                onTaskStatusChange && onTaskStatusChange(task._id, st.label);
                                                setActiveStatusDropdown(null);
                                              }}
                                            >
                                              {st.label}
                                            </div>
                                          </div>
                                        ))}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}

                      {/* Add Row Button */}
                      <tr className="border-bottom">
                        <td
                          className="divcon1 mysticky2"
                          style={{
                            position: 'sticky',
                            left: 0,
                            zIndex: 10,
                            minWidth: '300px',
                            width: '300px',
                            paddingLeft: '12px',
                          }}
                        >
                          <p
                            className="text-primary fw-bold cursor-pointer m-0"
                            onClick={onAddProject}
                            style={{ cursor: 'pointer', paddingLeft: '0px', fontSize: '13px' }}
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
    </div>
  );
};
