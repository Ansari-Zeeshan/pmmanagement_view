import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import '../kanban/kanban.css';
import { KANBAN_COLUMNS, mapStatusToColumnId, getStatusForColumn } from '../kanban/kanbanAdapter';
import { KanbanBoardHeader } from '../kanban/KanbanBoardHeader';
import { KanbanToolbar } from '../kanban/KanbanToolbar';
import { KanbanColumn } from '../kanban/KanbanColumn';
import { KanbanQuickCreateModal } from '../kanban/KanbanQuickCreateModal';
import { KanbanRequestTaskModal } from '../kanban/KanbanRequestTaskModal';

export const KanbanView = ({
  tasks = [],
  onTaskStatusChange,
  onTaskClick,
  onAddTask,
  onViewChange,
}) => {
  // Local filter states
  const [boardSearch, setBoardSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [compactView, setCompactView] = useState(false);

  // Modals state
  const [quickCreateColumnId, setQuickCreateColumnId] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setBoardSearch('');
    setPriorityFilter('ALL');
    setAssigneeFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('DEFAULT');
  };

  // Filter tasks locally by search query, priority, assignee, and status KPI card
  const filteredTasks = tasks.filter((t) => {
    if (boardSearch) {
      const q = boardSearch.toLowerCase();
      const titleMatch = t.title ? t.title.toLowerCase().includes(q) : false;
      const groupMatch = t.group ? t.group.toLowerCase().includes(q) : false;
      const descMatch = t.description ? t.description.toLowerCase().includes(q) : false;
      if (!titleMatch && !groupMatch && !descMatch) return false;
    }

    if (priorityFilter !== 'ALL') {
      const p = t.priority ? String(t.priority).toUpperCase() : 'MEDIUM';
      if (p !== priorityFilter) return false;
    }

    if (assigneeFilter !== 'ALL') {
      const assignees = t.assignees || [];
      const hasMember = assignees.some((a) => a.name === assigneeFilter);
      if (!hasMember && assigneeFilter === 'Claire Bure' && (!assignees || assignees.length === 0)) {
        // Fallback default assignee match
      } else if (!hasMember) {
        return false;
      }
    }

    if (statusFilter !== 'ALL') {
      const colId = mapStatusToColumnId(t.status);
      if (colId !== statusFilter) return false;
    }

    return true;
  });

  // Sort Tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'PRIORITY') {
      const pMap = { CRITICAL: 4, URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const pA = pMap[String(a.priority || '').toUpperCase()] || 2;
      const pB = pMap[String(b.priority || '').toUpperCase()] || 2;
      return pB - pA;
    }
    if (sortBy === 'DUE_DATE') {
      const dA = new Date(a.actualDate || a.plannedDate || '2099-12-31').getTime();
      const dB = new Date(b.actualDate || b.plannedDate || '2099-12-31').getTime();
      return dA - dB;
    }
    if (sortBy === 'PROGRESS') {
      return (b.progress || 0) - (a.progress || 0);
    }
    if (sortBy === 'TITLE') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  // Group tasks into 5 columns
  const getTasksByColumnId = (colId) => {
    return sortedTasks.filter((task) => mapStatusToColumnId(task.status) === colId);
  };

  // Drag & Drop Handler
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const targetColumnId = destination.droppableId;
    const newStatus = getStatusForColumn(targetColumnId);

    if (onTaskStatusChange) {
      onTaskStatusChange(draggableId, newStatus, destination.index);
    }
  };

  // 1-Click Quick Move Next Status Handler
  const handleMoveNextStatus = (taskId, currentStatus) => {
    const currentColId = mapStatusToColumnId(currentStatus);
    const colIndex = KANBAN_COLUMNS.findIndex((c) => c.id === currentColId);
    const nextColIndex = (colIndex + 1) % KANBAN_COLUMNS.length;
    const nextCol = KANBAN_COLUMNS[nextColIndex];
    const nextStatus = getStatusForColumn(nextCol.id);
    if (onTaskStatusChange) {
      onTaskStatusChange(taskId, nextStatus);
    }
  };

  // Handle Quick Create Task
  const handleCreateTask = (newTask) => {
    if (onAddTask) {
      onAddTask(newTask);
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Task ID', 'Title', 'Status', 'Priority', 'Group', 'Progress %', 'Due Date'];
    const rows = sortedTasks.map((t) => [
      `"${t._id || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.status || ''}"`,
      `"${t.priority || 'MEDIUM'}"`,
      `"${t.group || 'Development'}"`,
      `"${t.progress || 0}%"`,
      `"${t.actualDate || t.plannedDate || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Emaar_Kanban_Board_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="emaar-kanban-wrapper position-relative w-100">
      {/* 1. Header Section with Interactive KPI Cards */}
      <KanbanBoardHeader
        title="Tasks Kanban"
        subtitle="Manage real-estate development workflows and team deliverables"
        lastUpdated="Just now"
        tasks={tasks}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(st) => setStatusFilter(statusFilter === st ? 'ALL' : st)}
        onShare={() => alert('Kanban board link copied to clipboard!')}
      />

      {/* 2. Toolbar & Controls */}
      <KanbanToolbar
        search={boardSearch}
        onSearchChange={setBoardSearch}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        compactView={compactView}
        onToggleCompactView={() => setCompactView(!compactView)}
        onRequestTask={() => setShowRequestModal(true)}
        onExportCSV={handleExportCSV}
        onClearFilters={handleClearAllFilters}
      />

      {/* 3. Drag & Drop 5-Column Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-columns-container">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = getTasksByColumnId(col.id);
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={columnTasks}
                onCardClick={(task) => onTaskClick && onTaskClick(task)}
                onQuickCreate={(colId) => setQuickCreateColumnId(colId)}
                onMoveStatus={handleMoveNextStatus}
                compactView={compactView}
              />
            );
          })}
        </div>
      </DragDropContext>

      {/* Quick Create Inline Modal */}
      {quickCreateColumnId && (
        <KanbanQuickCreateModal
          columnId={quickCreateColumnId}
          onClose={() => setQuickCreateColumnId(null)}
          onCreateTask={handleCreateTask}
        />
      )}

      {/* Request Task Modal */}
      {showRequestModal && (
        <KanbanRequestTaskModal
          onClose={() => setShowRequestModal(false)}
          onRequestSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};
