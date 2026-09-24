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
import { AddProjectModalPopup } from './modals/AddProjectModalPopup';

export const ProjectWorkspacePage = () => {
  const queryClient = useQueryClient();
  const {
    activeView,
    setActiveView,
    selectedProjectId,
    activeTaskDetail,
    setActiveTaskDetail,
    tasks,
    updateTask,
    addProject,
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
  const [addProjectInitialGroup, setAddProjectInitialGroup] = useState('Research');

  // Fetch Tasks List
  const { data: tasksRes } = useQuery({
    queryKey: ['tasks', selectedProjectId, search],
    queryFn: async () =>
      await apiClient.get(`/projects/${selectedProjectId}/tasks${search ? `?search=${search}` : ''}`),
  });

  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask);
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  // Filter & Sort Tasks from global store database
  let filteredTasks = (tasks || []).filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedGroup && t.group !== selectedGroup) return false;
    if (selectedStatus && t.status !== selectedStatus) return false;
    if (selectedPriority && t.priority !== selectedPriority) return false;
    return true;
  });

  filteredTasks.sort((a, b) => {
    if (sortOrder === 'ASC') {
      return (a.title || '').localeCompare(b.title || '');
    } else {
      return (b.title || '').localeCompare(a.title || '');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string | number; status: string }) => {
      return await apiClient.patch(`/tasks/${taskId}/status`, { status });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleTaskStatusChange = (taskId: string | number, newStatus: string) => {
    const existingTask = tasks.find((t: any) => t._id === taskId);
    if (existingTask) {
      updateTask({ ...existingTask, status: newStatus });
    }
    updateStatusMutation.mutate({ taskId, status: newStatus });
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
    <div className="divfilter2 pm-workspace-main-wrapper">
      {/* Sticky Workspace Navigation & Filter Header */}
      <div
        className="sticky-top pm-workspace-sticky-container bg-white border-bottom shadow-sm"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2000,
          backgroundColor: '#ffffff',
        }}
      >
        {/* Row 1: View Switcher Tabs (List, Gantt, Calendar, Workload, Kanban) */}
        <div className="top_up pm-workspace-nav-header bg-white border-bottom d-flex align-items-center" style={{ zIndex: 10 }}>
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
                          className={`filter-item-row px-2 py-1 rounded cursor-pointer ${selectedGroup === g ? 'active' : ''}`}
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
                          className="filter-item-row px-2 py-1 rounded cursor-pointer"
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
                          className="filter-item-row px-2 py-1 rounded cursor-pointer"
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
                          className={`filter-item-row px-2 py-1 rounded cursor-pointer d-flex align-items-center gap-2 ${selectedStatus === st ? 'active' : ''}`}
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
                          className={`filter-item-row px-2 py-1 rounded cursor-pointer d-flex align-items-center gap-2 ${selectedPriority === pr ? 'active' : ''}`}
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

      {/* Add Project Drawer Modal matching media_1790148113927.png */}
      {showAddProjectModal && (
        <AddProjectModalPopup
          initialGroup={addProjectInitialGroup}
          onClose={() => setShowAddProjectModal(false)}
          onSave={(newProjectData) => {
            addProject(newProjectData);
          }}
        />
      )}

      {/* Active View Container */}
      {activeView === 'LIST' && (
        <ListView
          tasks={filteredTasks}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskClick={(task) => handleOpenRowDetails(task, 'UPDATES')}
          onChatClick={(task) => handleOpenRowDetails(task, 'UPDATES')}
          onAddProject={(groupKey) => {
            setAddProjectInitialGroup(groupKey || 'Research');
            setShowAddProjectModal(true);
          }}
          onTaskUpdate={handleUpdateTask}
        />
      )}
        {activeView === 'KANBAN' && (
          <KanbanView
            tasks={filteredTasks}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskClick={(task) => handleOpenRowDetails(task, 'UPDATES')}
            onAddTask={(newTask) => addProject(newTask)}
            onViewChange={(view) => setActiveView(view)}
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
              updateTask(updatedTask);
            }}
          />
        )}
      </div>
  );
};
