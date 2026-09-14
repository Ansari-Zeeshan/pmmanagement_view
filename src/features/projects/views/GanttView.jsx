import React, { useState } from 'react';

export const GanttView = ({ tasks = [], onTaskClick }) => {
  // Navigation & Scale States (Years 1990 to 2100)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // 0-indexed (9 = October)
  const [selectedScale, setSelectedScale] = useState('Month'); // 'Days' | 'Month' | 'Quarter' | 'Year'

  // Tree Expansion States
  const [expandedProjects, setExpandedProjects] = useState({ 'proj-1': true, 'proj-2': true, 'proj-3': true });
  const [expandedMilestones, setExpandedMilestones] = useState({ 'm1-1': true, 'm1-2': true, 'm2-1': true });

  // Hover & Active Popover State
  const [activeItem, setActiveItem] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Sample Hierarchical Project -> Milestone -> Task Tree Data with exact date ranges
  const defaultHierarchicalData = [
    {
      id: 'proj-1',
      title: 'Emaar Beachfront Tower 1',
      type: 'PROJECT',
      group: 'Research',
      startDate: '2026-10-15',
      endDate: '2027-10-11',
      range: '15 Oct 2026 - 11 Oct 2027',
      duration: '361 Days',
      percentage: '75%',
      status: 'On Track',
      plannedBudget: 'AED 500,000',
      actualBudget: 'AED 350,000',
      barColor: '#E2A967', // Golden
      criticalPath: true,
      milestones: [
        {
          id: 'm1-1',
          title: 'Milestone 01: Geotechnical Soil & Foundation',
          type: 'MILESTONE',
          startDate: '2026-10-15',
          endDate: '2027-01-15',
          range: '15 Oct 2026 - 15 Jan 2027',
          duration: '92 Days',
          percentage: '100%',
          status: 'Approved',
          plannedBudget: 'AED 150,000',
          actualBudget: 'AED 140,000',
          barColor: '#607D8B', // Slate
          tasks: [
            {
              id: 't1-1-1',
              title: 'Task 1.1: Soil Boring & Analysis',
              type: 'TASK',
              startDate: '2026-10-15',
              endDate: '2026-11-30',
              range: '15 Oct 2026 - 30 Nov 2026',
              duration: '46 Days',
              percentage: '100%',
              status: 'Approved',
              plannedBudget: 'AED 50,000',
              actualBudget: 'AED 48,000',
              barColor: '#2D62ED',
            },
            {
              id: 't1-1-2',
              title: 'Task 1.2: Foundation Reinforcement Inspection',
              type: 'TASK',
              startDate: '2026-12-01',
              endDate: '2027-01-15',
              range: '01 Dec 2026 - 15 Jan 2027',
              duration: '46 Days',
              percentage: '100%',
              status: 'Approved',
              plannedBudget: 'AED 100,000',
              actualBudget: 'AED 92,000',
              barColor: '#2D62ED',
            },
          ],
        },
        {
          id: 'm1-2',
          title: 'Milestone 02: Structural Framing & Pouring',
          type: 'MILESTONE',
          startDate: '2027-01-16',
          endDate: '2027-06-30',
          range: '16 Jan 2027 - 30 Jun 2027',
          duration: '165 Days',
          percentage: '50%',
          status: 'In Progress',
          plannedBudget: 'AED 350,000',
          actualBudget: 'AED 210,000',
          barColor: '#607D8B',
          tasks: [
            {
              id: 't1-2-1',
              title: 'Task 2.1: Column Steel Shoring',
              type: 'TASK',
              startDate: '2027-01-16',
              endDate: '2027-03-31',
              range: '16 Jan 2027 - 31 Mar 2027',
              duration: '75 Days',
              percentage: '50%',
              status: 'In Progress',
              plannedBudget: 'AED 200,000',
              actualBudget: 'AED 110,000',
              barColor: '#2D62ED',
            },
            {
              id: 't1-2-2',
              title: 'Task 2.2: Concrete Slab Pouring',
              type: 'TASK',
              startDate: '2027-04-01',
              endDate: '2027-06-30',
              range: '01 Apr 2027 - 30 Jun 2027',
              duration: '90 Days',
              percentage: '30%',
              status: 'In Progress',
              plannedBudget: 'AED 150,000',
              actualBudget: 'AED 100,000',
              barColor: '#2D62ED',
            },
          ],
        },
        {
          id: 'm1-3',
          title: 'Milestone 03: Facade & MEP Handover',
          type: 'MILESTONE',
          startDate: '2027-07-01',
          endDate: '2027-10-11',
          range: '01 Jul 2027 - 11 Oct 2027',
          duration: '102 Days',
          percentage: '0%',
          status: 'Planned',
          plannedBudget: 'AED 200,000',
          actualBudget: 'AED 0',
          barColor: '#607D8B',
          tasks: [
            {
              id: 't1-3-1',
              title: 'Task 3.1: Exterior Glass Curtain Installation',
              type: 'TASK',
              startDate: '2027-07-01',
              endDate: '2027-08-31',
              range: '01 Jul 2027 - 31 Aug 2027',
              duration: '62 Days',
              percentage: '0%',
              status: 'Planned',
              plannedBudget: 'AED 120,000',
              actualBudget: 'AED 0',
              barColor: '#2D62ED',
            },
            {
              id: 't1-3-2',
              title: 'Task 3.2: MEP Final Commissioning',
              type: 'TASK',
              startDate: '2027-09-01',
              endDate: '2027-10-11',
              range: '01 Sep 2027 - 11 Oct 2027',
              duration: '41 Days',
              percentage: '0%',
              status: 'Planned',
              plannedBudget: 'AED 80,000',
              actualBudget: 'AED 0',
              barColor: '#2D62ED',
            },
          ],
        },
      ],
    },
    {
      id: 'proj-2',
      title: 'Dubai Mall Expansion Phase II',
      type: 'PROJECT',
      group: 'Wireframe',
      startDate: '2026-04-01',
      endDate: '2026-12-31',
      range: '01 Apr 2026 - 31 Dec 2026',
      duration: '275 Days',
      percentage: '40%',
      status: 'At Risk',
      plannedBudget: 'AED 1,200,000',
      actualBudget: 'AED 600,000',
      barColor: '#E2A967',
      criticalPath: false,
      milestones: [
        {
          id: 'm2-1',
          title: 'Milestone 01: Architectural Wireframes & HVAC',
          type: 'MILESTONE',
          startDate: '2026-04-01',
          endDate: '2026-08-31',
          range: '01 Apr 2026 - 31 Aug 2026',
          duration: '153 Days',
          percentage: '40%',
          status: 'At Risk',
          plannedBudget: 'AED 400,000',
          actualBudget: 'AED 250,000',
          barColor: '#607D8B',
          tasks: [
            {
              id: 't2-1-1',
              title: 'Task 1.1: Ducting Blueprint Sign-off',
              type: 'TASK',
              startDate: '2026-04-01',
              endDate: '2026-06-30',
              range: '01 Apr 2026 - 30 Jun 2026',
              duration: '91 Days',
              percentage: '40%',
              status: 'At Risk',
              plannedBudget: 'AED 150,000',
              actualBudget: 'AED 90,000',
              barColor: '#2D62ED',
            },
          ],
        },
      ],
    },
    {
      id: 'proj-3',
      title: 'Burj Khalifa Sky Pod Refurbishment',
      type: 'PROJECT',
      group: 'Development',
      startDate: '2025-06-01',
      endDate: '2028-05-31',
      range: '01 Jun 2025 - 31 May 2028',
      duration: '3 Years',
      percentage: '60%',
      status: 'On Track',
      plannedBudget: 'AED 3,000,000',
      actualBudget: 'AED 1,800,000',
      barColor: '#E2A967',
      criticalPath: true,
      milestones: [
        {
          id: 'm3-1',
          title: 'Milestone 01: Pod Interior Glass Replacement',
          type: 'MILESTONE',
          startDate: '2025-06-01',
          endDate: '2026-12-31',
          range: '01 Jun 2025 - 31 Dec 2026',
          duration: '579 Days',
          percentage: '80%',
          status: 'On Track',
          plannedBudget: 'AED 1,500,000',
          actualBudget: 'AED 1,200,000',
          barColor: '#607D8B',
          tasks: [
            {
              id: 't3-1-1',
              title: 'Task 1.1: Glass Fabrication & Testing',
              type: 'TASK',
              startDate: '2025-06-01',
              endDate: '2026-03-31',
              range: '01 Jun 2025 - 31 Mar 2026',
              duration: '304 Days',
              percentage: '100%',
              status: 'Approved',
              plannedBudget: 'AED 800,000',
              actualBudget: 'AED 750,000',
              barColor: '#2D62ED',
            },
          ],
        },
      ],
    },
  ];

  // Map workspace tasks into hierarchy if present
  const projectsData = tasks.length > 0
    ? tasks.map((t, idx) => ({
        id: t._id || `proj-${idx}`,
        title: t.title,
        type: 'PROJECT',
        group: t.group || 'Research',
        startDate: t.startDate || '2026-10-15',
        endDate: t.endDate || '2027-10-11',
        range: t.plannedDate || '15 Oct 2026 - 11 Oct 2027',
        duration: '361 Days',
        percentage: t.status === 'COMPLETED' ? '100%' : '50%',
        status: t.status || 'On Track',
        plannedBudget: t.plannedBudget || 'AED 100,000',
        actualBudget: t.actualBudget || 'AED 200,000',
        barColor: idx === 0 ? '#E2A967' : '#607D8B',
        criticalPath: idx % 2 === 0,
        rawTask: t,
        milestones: [
          {
            id: `m-${t._id}-1`,
            title: `Milestone 1 for ${t.title}`,
            type: 'MILESTONE',
            startDate: t.startDate || '2026-10-15',
            endDate: t.endDate || '2027-01-15',
            range: t.plannedDate || '15 Oct 2026 - 15 Jan 2027',
            duration: '92 Days',
            percentage: '50%',
            status: t.status || 'On Track',
            plannedBudget: 'AED 50,000',
            actualBudget: 'AED 100,000',
            barColor: '#607D8B',
            tasks: [
              {
                id: `t-${t._id}-1-1`,
                title: `Subtask 1.1`,
                type: 'TASK',
                startDate: t.startDate || '2026-10-15',
                endDate: t.endDate || '2026-11-30',
                range: '15 Oct 2026 - 30 Nov 2026',
                duration: '46 Days',
                percentage: '50%',
                status: t.status || 'On Track',
                plannedBudget: 'AED 25,000',
                actualBudget: 'AED 50,000',
                barColor: '#2D62ED',
              },
            ],
          },
        ],
      }))
    : defaultHierarchicalData;

  // Toggle Project / Milestone Expansion
  const toggleProject = (projId) => {
    setExpandedProjects((prev) => ({ ...prev, [projId]: !prev[projId] }));
  };

  const toggleMilestone = (mileId) => {
    setExpandedMilestones((prev) => ({ ...prev, [mileId]: !prev[mileId] }));
  };

  // Timeline Navigation Handlers
  const handlePrev = () => {
    if (selectedScale === 'Days') {
      if (selectedMonth > 0) {
        setSelectedMonth(selectedMonth - 1);
      } else if (selectedYear > 1990) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(11);
      }
    } else {
      if (selectedYear > 1990) setSelectedYear(selectedYear - 1);
    }
  };

  const handleNext = () => {
    if (selectedScale === 'Days') {
      if (selectedMonth < 11) {
        setSelectedMonth(selectedMonth + 1);
      } else if (selectedYear < 2100) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(0);
      }
    } else {
      if (selectedYear < 2100) setSelectedYear(selectedYear + 1);
    }
  };

  const handleJumpToDefault = () => {
    setSelectedYear(2026);
    setSelectedMonth(9);
  };

  // Generate Year Options (1990 to 2100)
  const yearOptions = [];
  for (let y = 1990; y <= 2100; y++) {
    yearOptions.push(y);
  }

  // Calculate Viewport Bounds for Current Scale, Year, and Month
  const getViewportBounds = () => {
    if (selectedScale === 'Days') {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const vStart = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0).getTime();
      const vEnd = new Date(selectedYear, selectedMonth, daysInMonth, 23, 59, 59, 999).getTime();
      return { vStart, vEnd, totalCols: daysInMonth };
    } else if (selectedScale === 'Month' || selectedScale === 'Quarter') {
      const vStart = new Date(selectedYear, 0, 1, 0, 0, 0, 0).getTime();
      const vEnd = new Date(selectedYear, 11, 31, 23, 59, 59, 999).getTime();
      return { vStart, vEnd, totalCols: selectedScale === 'Month' ? 12 : 4 };
    } else {
      // 'Year' scale: 5 Years starting from selectedYear
      const vStart = new Date(selectedYear, 0, 1, 0, 0, 0, 0).getTime();
      const vEnd = new Date(selectedYear + 4, 11, 31, 23, 59, 59, 999).getTime();
      return { vStart, vEnd, totalCols: 5 };
    }
  };

  const { vStart, vEnd, totalCols } = getViewportBounds();

  // Dynamic Bar Position & Width Calculation Function
  const calculateBarPosition = (startDateStr, endDateStr) => {
    const itemStart = new Date(startDateStr + 'T00:00:00').getTime();
    const itemEnd = new Date(endDateStr + 'T23:59:59').getTime();

    if (isNaN(itemStart) || isNaN(itemEnd) || itemEnd < vStart || itemStart > vEnd) {
      return { visible: false, marginLeft: '0%', width: '0%' };
    }

    const effectiveStart = Math.max(itemStart, vStart);
    const effectiveEnd = Math.min(itemEnd, vEnd);

    const totalViewportDuration = vEnd - vStart;
    const offsetFromStart = effectiveStart - vStart;
    const barSpan = effectiveEnd - effectiveStart;

    const leftPercent = (offsetFromStart / totalViewportDuration) * 100;
    const widthPercent = Math.max((barSpan / totalViewportDuration) * 100, 0.8);

    const continuesLeft = itemStart < vStart;
    const continuesRight = itemEnd > vEnd;

    return {
      visible: true,
      marginLeft: `${leftPercent.toFixed(2)}%`,
      width: `${widthPercent.toFixed(2)}%`,
      continuesLeft,
      continuesRight,
    };
  };

  // Render Table Header Columns based on Scale
  const renderScaleHeaders = () => {
    if (selectedScale === 'Days') {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const headers = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(selectedYear, selectedMonth, d);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        headers.push(
          <th key={d} className="text-center p-1 border-end" style={{ minWidth: '32px', fontSize: '10px' }}>
            <div className="text-muted" style={{ fontSize: '9px' }}>{dayName}</div>
            <div className="fw-bold text-dark">{d}</div>
          </th>
        );
      }
      return headers;
    } else if (selectedScale === 'Month') {
      return monthNames.map((m, idx) => (
        <th key={idx} className="text-center p-2 border-end" style={{ minWidth: '70px', fontSize: '11px' }}>
          {m.substr(0, 3)}
        </th>
      ));
    } else if (selectedScale === 'Quarter') {
      return ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'].map((q, idx) => (
        <th key={idx} className="text-center p-2 border-end" style={{ minWidth: '130px', fontSize: '11px' }}>
          {q}
        </th>
      ));
    } else {
      const years = [selectedYear, selectedYear + 1, selectedYear + 2, selectedYear + 3, selectedYear + 4];
      return years.map((y) => (
        <th key={y} className="text-center p-2 border-end" style={{ minWidth: '150px', fontSize: '12px' }}>
          {y}
        </th>
      ));
    }
  };

  // Flatten Hierarchical Rows for Rendering
  const flatRows = [];
  projectsData.forEach((proj) => {
    flatRows.push({ ...proj, isProject: true });
    if (expandedProjects[proj.id] && proj.milestones) {
      proj.milestones.forEach((mile) => {
        flatRows.push({ ...mile, isMilestone: true, parentProjId: proj.id });
        if (expandedMilestones[mile.id] && mile.tasks) {
          mile.tasks.forEach((tsk) => {
            flatRows.push({ ...tsk, isTask: true, parentMileId: mile.id, parentProjId: proj.id });
          });
        }
      });
    }
  });

  return (
    <div className="gantt active tab_content position-relative w-100 p-3">
      {/* Title & Top Bar Header */}
      <div className="mysticky h1fixed mb-3">
        <div className="list-title d-flex justify-content-between align-items-center">
          <h1 className="fs-3 fw-bold text-dark m-0">Projects Gantt Chart & Timeline</h1>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-primary fw-semibold"
              onClick={handleJumpToDefault}
            >
              Today (Oct 2026)
            </button>
            <span className="text-secondary cursor-pointer border px-2 py-1 rounded bg-light small fw-semibold">
              <i className="material-icons fs-6 align-middle me-1">file_download</i> Export
            </span>
          </div>
        </div>
      </div>

      {/* Date & Scale Controls Bar (1990 - 2100) */}
      <div className="row workloadrow mb-3 align-items-center bg-white p-3 border rounded shadow-sm">
        <div className="col-md-12 d-flex justify-content-between align-items-center iconset p-0 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <img src="/icons/arrowright.svg" alt="Back" style={{ transform: 'rotate(180deg)', width: '16px' }} />
            <span className="text-secondary fs-5 fw-semibold me-2">Timeline Navigator</span>
            
            {/* Prev Arrow */}
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: '32px', height: '32px' }}
              onClick={handlePrev}
              title="Previous period"
            >
              <i className="material-icons fs-6">chevron_left</i>
            </button>

            {/* Month Selector Dropdown (when scale is 'Days') */}
            {selectedScale === 'Days' && (
              <select
                className="form-select form-select-sm border fw-bold text-primary"
                style={{ width: '115px' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              >
                {monthNames.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            )}

            {/* Year Selector Dropdown (1990 - 2100) */}
            <select
              className="form-select form-select-sm border fw-bold text-primary"
              style={{ width: '95px' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Next Arrow */}
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: '32px', height: '32px' }}
              onClick={handleNext}
              title="Next period"
            >
              <i className="material-icons fs-6">chevron_right</i>
            </button>
          </div>

          {/* Time Scale Mode Selector */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-semibold me-1">View Scale:</span>
            <select
              className="form-select form-select-sm border fw-semibold"
              style={{ width: '110px' }}
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
            >
              <option value="Days">Days</option>
              <option value="Month">Month</option>
              <option value="Quarter">Quarter</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gantt Chart Table Area */}
      <div id="benefits2" className="tablecal tableganttr table-responsive tablecal1 bg-white rounded shadow-sm border p-2">
        <table className="table tablegantt align-middle m-0">
          <thead>
            <tr className="bg-light">
              <th className="thspace text-start border-end" style={{ width: '280px', minWidth: '280px' }}>
                Project / Milestone / Task Hierarchy
              </th>
              {renderScaleHeaders()}
            </tr>
          </thead>
          <tbody>
            {flatRows.map((row) => {
              const isExpanded = row.isProject
                ? expandedProjects[row.id]
                : row.isMilestone
                ? expandedMilestones[row.id]
                : false;

              const hasChildren = row.isProject
                ? row.milestones && row.milestones.length > 0
                : row.isMilestone
                ? row.tasks && row.tasks.length > 0
                : false;

              const barPos = calculateBarPosition(row.startDate, row.endDate);

              return (
                <tr key={row.id} style={{ height: '48px' }} className={row.isProject ? 'fw-bold bg-light bg-opacity-25' : ''}>
                  {/* Left Column: Title & Tree Expand Chevron */}
                  <td className="border-end" style={{ maxWidth: '280px' }}>
                    <div
                      className={`d-flex align-items-center gap-2 ${
                        row.isMilestone ? 'ps-3' : row.isTask ? 'ps-5' : ''
                      }`}
                    >
                      {hasChildren ? (
                        <span
                          className="cursor-pointer text-secondary"
                          onClick={() => (row.isProject ? toggleProject(row.id) : toggleMilestone(row.id))}
                          style={{ cursor: 'pointer', userSelect: 'none', width: '16px' }}
                        >
                          {isExpanded ? '▼' : '►'}
                        </span>
                      ) : (
                        <span style={{ width: '16px' }}></span>
                      )}

                      <span
                        className={`text-truncate cursor-pointer ${
                          row.isProject
                            ? 'fw-bold text-dark fs-6'
                            : row.isMilestone
                            ? 'fw-semibold text-secondary small'
                            : 'text-muted small'
                        }`}
                        style={{ maxWidth: '220px' }}
                        onClick={() => onTaskClick && onTaskClick(row.rawTask || { title: row.title, status: row.status, group: row.group })}
                        title="Click to open project details"
                      >
                        {row.title}
                      </span>
                    </div>
                  </td>

                  {/* Right Columns: Dynamic Date-based Timeline Bar */}
                  <td colSpan={totalCols} className="p-0 position-relative" style={{ height: '44px' }}>
                    {/* Column Gridlines in Background */}
                    <div className="position-absolute top-0 bottom-0 start-0 end-0 d-flex pointer-events-none" style={{ zIndex: 1 }}>
                      {Array.from({ length: totalCols }).map((_, i) => (
                        <div key={i} className="flex-fill border-end border-light" style={{ height: '100%' }} />
                      ))}
                    </div>

                    {/* Timeline Progress Bar */}
                    {barPos.visible ? (
                      <div
                        className="position-absolute d-flex align-items-center justify-content-between px-2 text-white fw-semibold rounded-2 cursor-pointer shadow-sm"
                        style={{
                          top: row.isProject ? '6px' : row.isMilestone ? '9px' : '12px',
                          left: barPos.marginLeft,
                          width: barPos.width,
                          height: row.isProject ? '32px' : row.isMilestone ? '26px' : '20px',
                          backgroundColor: row.barColor,
                          fontSize: '11px',
                          zIndex: 2,
                          transition: 'all 0.2s ease-in-out',
                          opacity: row.isTask ? 0.9 : 1,
                          borderLeft: barPos.continuesLeft ? '3px dashed #ffffff' : 'none',
                          borderRight: barPos.continuesRight ? '3px dashed #ffffff' : 'none',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={() => setActiveItem(row)}
                        onMouseLeave={() => setActiveItem(null)}
                        onClick={() => setActiveItem(activeItem?.id === row.id ? null : row)}
                      >
                        <span className="text-truncate">
                          {barPos.continuesLeft && '◀ '}
                          {row.title} ({row.range})
                          {barPos.continuesRight && ' ▶'}
                        </span>
                        <span className="badge bg-dark bg-opacity-25 ms-1" style={{ fontSize: '9px' }}>
                          {row.percentage}
                        </span>

                        {/* Popover Description Card */}
                        {activeItem?.id === row.id && (
                          <div
                            className="hide3 position-absolute bg-dark text-white p-3 rounded-3 shadow-lg border border-secondary"
                            style={{
                              top: '-155px',
                              left: '20px',
                              zIndex: 1060,
                              minWidth: '270px',
                              fontSize: '12px',
                              pointerEvents: 'none',
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="badge bg-warning text-dark fw-bold">{row.type}</span>
                              <span className="badge bg-primary">{row.status}</span>
                            </div>
                            <p className="fw-bold text-white mb-1">{row.title}</p>
                            <hr className="my-1 border-secondary" />
                            <p className="m-0 text-light"><strong>Timeline:</strong> {row.startDate} to {row.endDate}</p>
                            <p className="m-0 text-light"><strong>Duration:</strong> {row.duration}</p>
                            <p className="m-0 text-light"><strong>Progress:</strong> {row.percentage}</p>
                            <p className="m-0 text-light"><strong>Planned Budget:</strong> {row.plannedBudget}</p>
                            <p className="m-0 text-light"><strong>Actual Budget:</strong> {row.actualBudget}</p>
                            {row.criticalPath && (
                              <p className="text-warning fw-bold m-0 mt-1">★ Critical Path Item</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center text-muted"
                        style={{ fontSize: '10px', opacity: 0.3, zIndex: 1 }}
                      >
                        Outside Range ({row.range})
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Month / Scale Navigation Controls */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: '40px', height: '40px' }}
          onClick={handlePrev}
          disabled={selectedYear === 1990 && selectedMonth === 0}
        >
          <i className="material-icons">west</i>
        </button>

        <span className="fw-bold text-dark">
          {selectedYear} Timeline Navigator (1990 - 2100)
        </span>

        <button
          className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: '40px', height: '40px' }}
          onClick={handleNext}
          disabled={selectedYear === 2100 && selectedMonth === 11}
        >
          <i className="material-icons">east</i>
        </button>
      </div>
    </div>
  );
};
