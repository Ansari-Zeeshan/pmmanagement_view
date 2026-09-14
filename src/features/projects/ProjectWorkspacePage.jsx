import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient } from '../../lib/axios';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { ProjectDetailsDrawer } from './drawers/ProjectDetailsDrawer';
import { CalendarView } from './views/CalendarView';
import { GanttView } from './views/GanttView';
import { KanbanView } from './views/KanbanView';
import { ListView } from './views/ListView';
import { WorkloadView } from './views/WorkloadView';

export const ProjectWorkspacePage = () => {
  const queryClient = useQueryClient();
  const {
    activeView,
    setActiveView,
    selectedProjectId,
    activeTaskDetail,
    setActiveTaskDetail,
  } = useWorkspaceStore();

  const [drawerDefaultTab, setDrawerDefaultTab] = useState('UPDATES');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('ASC');

  // Filter States
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Add Project Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectGroup, setNewProjectGroup] = useState('Research');

  // Fetch Tasks List
  const { data: tasksRes } = useQuery({
    queryKey: ['tasks', selectedProjectId, search],
    queryFn: async () =>
      await apiClient.get(`/projects/${selectedProjectId}/tasks${search ? `?search=${search}` : ''}`),
  });

  const initialTasks = [
    {
      _id: 'task-1',
      title: 'Project 01 Kaleem Sagar dfgdfgdf',
      group: 'Research',
      plannedDate: 'Oct 26 - Sep 19',
      actualDate: 'Oct 26, 2026',
      actualBudget: 'AED 200',
      plannedBudget: 'AED 100',
      projectLead: 'John',
      domainLead: 'Smith',
      status: 'On Track',
      priority: 'High',
      assignees: [
        { _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
        { _id: 'u2', name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatarUrl: '/img/client2.jpg' },
      ],
    },
    {
      _id: 'task-2',
      title: 'Project 01 Project 01',
      group: 'Research',
      plannedDate: 'Oct 20 - 28',
      actualDate: 'Oct 20, 2021',
      actualBudget: 'AED 200',
      plannedBudget: 'AED 100',
      projectLead: 'John',
      domainLead: 'Smith',
      status: 'At Risk',
      priority: 'Medium',
      assignees: [{ _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' }],
    },
    {
      _id: 'task-3',
      title: 'Project 01',
      group: 'Research',
      plannedDate: 'Nov 01 - Dec 15',
      actualDate: 'Nov 05, 2021',
      actualBudget: 'AED 2005',
      plannedBudget: 'AED 100',
      projectLead: 'John',
      domainLead: 'Smith',
      status: 'Approved',
      priority: 'High',
      assignees: [{ _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' }],
    },
    {
      _id: 'task-4',
      title: 'Project 01',
      group: 'Wireframe',
      plannedDate: 'Dec 01 - Jan 10',
      actualDate: 'Dec 03, 2021',
      actualBudget: 'AED 200',
      plannedBudget: 'AED 100',
      projectLead: 'John',
      domainLead: 'Smith',
      status: 'Planned',
      priority: 'Low',
      assignees: [
        { _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
        { _id: 'u2', name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatarUrl: '/img/client2.jpg' },
      ],
    },
    {
      _id: 'task-5',
      title: 'Project 01',
      group: 'Wireframe',
      plannedDate: 'Jan 15 - Mar 30',
      actualDate: 'Jan 18, 2022',
      actualBudget: 'AED 200',
      plannedBudget: 'AED 100',
      projectLead: 'John',
      domainLead: 'Smith',
      status: 'On Track',
      priority: 'High',
      assignees: [{ _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' }],
    },
    {
      _id: 'task-6',
      title: 'Project 012 025 0155',
      group: 'Visual Studio',
      plannedDate: 'Feb 10 - Apr 25',
      actualDate: 'Feb 12, 2022',
      actualBudget: 'AED 200',
      plannedBudget: 'AED 100',
      projectLead: 'John',
      domainLead: 'Smith',
      status: 'On Track',
      priority: 'Medium',
      assignees: [
        { _id: 'u1', name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
        { _id: 'u2', name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatarUrl: '/img/client2.jpg' },
      ],
    },
  ];

  const [taskList, setTaskList] = useState(initialTasks);

  // Filter & Sort Tasks
  let filteredTasks = (tasksRes?.data || taskList).filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedGroup && t.group !== selectedGroup) return false;
    if (selectedStatus && t.status !== selectedStatus) return false;
    if (selectedPriority && t.priority !== selectedPriority) return false;
    return true;
  });

  filteredTasks.sort((a, b) => {
    if (sortOrder === 'ASC') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      return await apiClient.patch(`/tasks/${taskId}/status`, { status });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTaskList((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const newTask = {
      _id: `task-${Date.now()}`,
      title: newProjectName,
      group: newProjectGroup,
      plannedDate: 'Nov 01 - 30',
      actualDate: 'Nov 01, 2026',
      actualBudget: 'AED 500',
      plannedBudget: 'AED 400',
      projectLead: 'John',
      domainLead: 'Smith',
      status: 'Planned',
      priority: 'Medium',
      assignees: [{ _id: 'u1', name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }],
    };
    setTaskList((prev) => [...prev, newTask]);
    setNewProjectName('');
    setShowAddProjectModal(false);
  };

  const handleClearFilters = () => {
    setSelectedGroup(null);
    setSelectedStatus(null);
    setSelectedPriority(null);
    setSearch('');
  };

  const handleOpenRowDetails = (task, tab = 'UPDATES') => {
    setDrawerDefaultTab(tab);
    setActiveTaskDetail(task);
  };

  return (
    <div className="divfilter2">
      {/* Sticky Header Container with top_up (Row 1) and top_up2 (Row 2) */}
      <div
        className="sticky-top bg-white border-bottom shadow-sm"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2000,
          backgroundColor: '#ffffff',
        }}
      >
        {/* TOP 1: Main Navbar for Title + View Switcher (top_up) */}
        <div className="top_up bg-white border-bottom d-flex align-items-center" style={{ zIndex: 10 }}>
          <div className="d-flex align-items-center gap-2">
            <h1 className="m-0 fw-bold" style={{ fontSize: '26px', color: '#171E48', lineHeight: 1 }}>
              Projects
            </h1>
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle border text-primary cursor-pointer ms-1"
              style={{ width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer' }}
              title="Toggle Navigation"
            >
              ❯
            </span>
          </div>

          <ul className="m-0 p-0 list-unstyled d-flex align-items-center gap-4">
            <li
              className={activeView === 'LIST' ? 'active1 active' : 'active1'}
              onClick={() => setActiveView('LIST')}
              style={{ cursor: 'pointer' }}
              data-target=".list"
            >
              <img src="/icons/list-blue.svg" className="img1" alt="" />
              <img src="/icons/list.svg" className="img2" alt="" />
              List
            </li>
            <li
              className={activeView === 'GANTT' ? 'active1 active' : 'active1'}
              onClick={() => setActiveView('GANTT')}
              style={{ cursor: 'pointer' }}
              data-target=".gantt"
            >
              <img src="/icons/gantt-blue.svg" className="img1" alt="" />
              <img src="/icons/gntt.svg" className="img2" alt="" />
              Gantt
            </li>
            <li
              className={activeView === 'CALENDAR' ? 'active1 active' : 'active1'}
              onClick={() => setActiveView('CALENDAR')}
              style={{ cursor: 'pointer' }}
              data-target=".calendar"
            >
              <img src="/icons/calender-blue.svg" className="img1" alt="" />
              <img src="/icons/calender.svg" className="img2" alt="" />
              Calendar
            </li>
            <li
              className={activeView === 'WORKLOAD' ? 'active1 active' : 'active1'}
              onClick={() => setActiveView('WORKLOAD')}
              style={{ cursor: 'pointer' }}
              data-target=".workload"
            >
              <img src="/icons/workload-blue.svg" className="img1" alt="" />
              <img src="/icons/wrokload.svg" className="img2" alt="" />
              Workload
            </li>
            <li
              className={activeView === 'KANBAN' ? 'active1 active' : 'active1'}
              onClick={() => setActiveView('KANBAN')}
              style={{ cursor: 'pointer' }}
              data-target=".kanban"
            >
              <img src="/icons/kanban-blue.svg" className="img1" alt="" />
              <img src="/icons/Kanban.svg" className="img2" alt="" />
              Kanban
            </li>
            <li
              className="active1"
              onClick={() => setShowAddProjectModal(true)}
              style={{ cursor: 'pointer' }}
              data-target=".addview"
            >
              <img src="/icons/plus-blue.svg" className="img1" alt="" />
              <img src="/icons/plus.svg" className="img2" alt="" />
              Add View
            </li>
          </ul>
        </div>

        {/* TOP 2: Filter Bar Row */}
        <div className="top_up2 bg-white border-bottom position-relative" style={{ zIndex: 2000 }}>
          {showFilters && (
            <div className="topup2_overlay active" onClick={() => setShowFilters(false)} style={{ zIndex: 99990 }}></div>
          )}
          <ul className="d-flex align-items-center justify-content-end gap-4 list-unstyled m-0 p-0">
            <li className="d-flex align-items-center gap-2 m-0" style={{ cursor: 'pointer' }}>
              <img src="/icons/search-1.svg" alt="" style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              <input
                type="text"
                className="border-0 bg-transparent p-0"
                placeholder="Search.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ outline: 'none', fontSize: '13px', width: '90px' }}
              />
            </li>
            <li
              onClick={() => setShowFilters(!showFilters)}
              style={{ cursor: 'pointer' }}
              className={showFilters ? 'd-flex align-items-center gap-2 active m-0' : 'd-flex align-items-center gap-2 m-0'}
            >
              <img src="/icons/filter.svg" alt="" style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', lineHeight: 1 }}>Filters</span>
            </li>
            <li
              style={{ cursor: 'pointer' }}
              className="d-flex align-items-center gap-2 m-0"
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            >
              <img src="/icons/sort.svg" alt="" style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', lineHeight: 1 }}>Sort</span>
            </li>

            {/* Quick Filters Popover Dropdown */}
            {showFilters && (
              <div
                className="filter_div shadow-lg border rounded-3 premium-filter-popover"
                style={{
                  display: 'block',
                  position: 'absolute',
                  top: '100%',
                  right: '1rem',
                  zIndex: 99999,
                  marginTop: '10px',
                  width: '680px',
                  maxWidth: '92vw',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.18), 0 8px 20px -4px rgba(15, 23, 42, 0.1)',
                  border: '1px solid #e2e8f0',
                  padding: '20px 24px 16px',
                  animation: 'filterPopAnim 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                {/* Header Row */}
                <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <h2 className="m-0 fw-bold" style={{ fontSize: '16px', color: '#0f172a', letterSpacing: '-0.01em' }}>
                      Quick Filters
                    </h2>
                    <span
                      className="px-2 py-1 rounded-pill"
                      style={{ fontSize: '11.5px', fontWeight: 500, backgroundColor: '#f1f5f9', color: '#475569' }}
                    >
                      Showing all {filteredTasks.length} items
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="cursor-pointer"
                      onClick={handleClearFilters}
                      style={{ fontSize: '12.5px', fontWeight: 500, color: '#64748b', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                    >
                      Clear all
                    </span>
                    <button
                      className="btn btn-sm"
                      onClick={() => setShowFilters(false)}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        transition: 'all 0.15s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dbeafe';
                        e.currentTarget.style.borderColor = '#93c5fd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#bfdbfe';
                      }}
                    >
                      Save as New view
                    </button>
                  </div>
                </div>

                {/* Filter Content Columns */}
                <div className="row g-3 pb-3 border-bottom" style={{ minHeight: '180px' }}>
                  {/* Group */}
                  <div className="col-md-2" style={{ flex: '1 1 18%' }}>
                    <p
                      className="fw-bold mb-2 text-uppercase"
                      style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#64748b' }}
                    >
                      Group
                    </p>
                    <ul className="list-unstyled m-0 d-flex flex-column gap-1">
                      {['Research', 'Wireframe', 'Visual Studio'].map((g) => (
                        <li
                          key={g}
                          className={`filter-item-row px-2 py-1.5 rounded cursor-pointer ${selectedGroup === g ? 'active' : ''}`}
                          onClick={() => setSelectedGroup(selectedGroup === g ? null : g)}
                          style={{
                            fontSize: '13px',
                            fontWeight: selectedGroup === g ? 600 : 400,
                            color: selectedGroup === g ? '#2563eb' : '#334155',
                            backgroundColor: selectedGroup === g ? '#eff6ff' : 'transparent',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out',
                          }}
                        >
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Name */}
                  <div className="col-md-2" style={{ flex: '1 1 18%' }}>
                    <p
                      className="fw-bold mb-2 text-uppercase"
                      style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#64748b' }}
                    >
                      Name
                    </p>
                    <ul className="list-unstyled m-0 d-flex flex-column gap-1">
                      {['Project 01', 'Project 02', 'Project 03'].map((n, idx) => (
                        <li
                          key={idx}
                          className="filter-item-row px-2 py-1.5 rounded cursor-pointer"
                          style={{
                            fontSize: '13px',
                            color: '#334155',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out',
                          }}
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Assignee */}
                  <div className="col-md-2" style={{ flex: '1 1 18%' }}>
                    <p
                      className="fw-bold mb-2 text-uppercase"
                      style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#64748b' }}
                    >
                      Assignee
                    </p>
                    <ul className="list-unstyled m-0 d-flex flex-column gap-1">
                      {['John Doe', 'Smith'].map((a) => (
                        <li
                          key={a}
                          className="filter-item-row px-2 py-1.5 rounded cursor-pointer"
                          style={{
                            fontSize: '13px',
                            color: '#334155',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out',
                          }}
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Status */}
                  <div className="col-md-3" style={{ flex: '1 1 24%' }}>
                    <p
                      className="fw-bold mb-2 text-uppercase"
                      style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#64748b' }}
                    >
                      Status
                    </p>
                    <ul className="list-unstyled m-0 d-flex flex-column gap-1" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {['On Track', 'At Risk', 'Approved', 'Planned', 'On Hold', 'Ready to begin', 'No Update'].map((st) => (
                        <li
                          key={st}
                          className={`filter-item-row px-2 py-1.5 rounded cursor-pointer d-flex align-items-center gap-2 ${selectedStatus === st ? 'active' : ''}`}
                          onClick={() => setSelectedStatus(selectedStatus === st ? null : st)}
                          style={{
                            fontSize: '13px',
                            fontWeight: selectedStatus === st ? 600 : 400,
                            color: selectedStatus === st ? '#2563eb' : '#334155',
                            backgroundColor: selectedStatus === st ? '#eff6ff' : 'transparent',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out',
                          }}
                        >
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: selectedStatus === st ? '#2563eb' : '#cbd5e1',
                            }}
                          ></span>
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Priority */}
                  <div className="col-md-3" style={{ flex: '1 1 22%' }}>
                    <p
                      className="fw-bold mb-2 text-uppercase"
                      style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#64748b' }}
                    >
                      Priority
                    </p>
                    <ul className="list-unstyled m-0 d-flex flex-column gap-1">
                      {['High', 'Medium', 'Low', 'Blank'].map((pr) => (
                        <li
                          key={pr}
                          className={`filter-item-row px-2 py-1.5 rounded cursor-pointer d-flex align-items-center gap-2 ${selectedPriority === pr ? 'active' : ''}`}
                          onClick={() => setSelectedPriority(selectedPriority === pr ? null : pr)}
                          style={{
                            fontSize: '13px',
                            fontWeight: selectedPriority === pr ? 600 : 400,
                            color: selectedPriority === pr ? '#2563eb' : '#334155',
                            backgroundColor: selectedPriority === pr ? '#eff6ff' : 'transparent',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out',
                          }}
                        >
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: selectedPriority === pr ? '#2563eb' : '#cbd5e1',
                            }}
                          ></span>
                          {pr}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="d-flex justify-content-between align-items-center pt-3">
                  <span
                    className="cursor-pointer"
                    style={{ fontSize: '12.5px', fontWeight: 500, color: '#64748b', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                  >
                    Switch to advanced filters
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowFilters(false)}
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      backgroundColor: '#2563eb',
                      borderColor: '#2563eb',
                      borderRadius: '6px',
                      padding: '6px 20px',
                      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                      transition: 'all 0.15s ease-in-out',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">Add New Project</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddProjectModal(false)}></button>
                </div>
                <form onSubmit={handleAddProjectSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark small">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter project name..."
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark small">Group Category</label>
                      <select
                        className="form-select"
                        value={newProjectGroup}
                        onChange={(e) => setNewProjectGroup(e.target.value)}
                      >
                        <option value="Research">Research</option>
                        <option value="Wireframe">Wireframe</option>
                        <option value="Visual Studio">Visual Studio</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button type="button" className="btn btn-secondary px-4" onClick={() => setShowAddProjectModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Active View Container */}
        {activeView === 'LIST' && (
          <ListView
            tasks={filteredTasks}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskClick={(task) => handleOpenRowDetails(task, 'UPDATES')}
            onChatClick={(task) => handleOpenRowDetails(task, 'UPDATES')}
            onAddProject={() => setShowAddProjectModal(true)}
          />
        )}
        {activeView === 'KANBAN' && (
          <KanbanView
            tasks={filteredTasks}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskClick={(task) => handleOpenRowDetails(task, 'UPDATES')}
          />
        )}
        {activeView === 'GANTT' && (
          <GanttView tasks={filteredTasks} onTaskClick={(task) => handleOpenRowDetails(task, 'UPDATES')} />
        )}
        {activeView === 'CALENDAR' && <CalendarView tasks={filteredTasks} />}
        {activeView === 'WORKLOAD' && <WorkloadView />}

        {/* Project Details Drawer */}
        {activeTaskDetail && (
          <ProjectDetailsDrawer
            task={activeTaskDetail}
            defaultTab={drawerDefaultTab}
            onClose={() => setActiveTaskDetail(null)}
            onSave={(updatedTask) => {
              setTaskList((prev) =>
                prev.map((t) => (t._id === updatedTask._id ? { ...t, ...updatedTask } : t))
              );
            }}
          />
        )}
      </div>
  );
};
