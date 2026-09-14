import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const KanbanView = ({ tasks = [], onTaskStatusChange, onTaskClick }) => {
  const columns = [
    { id: 'TO_DO', title: 'To Do', badgeClass: 'bg-secondary' },
    { id: 'IN_PROGRESS', title: 'In Progress', badgeClass: 'bg-primary' },
    { id: 'IN_REVIEW', title: 'In Review', badgeClass: 'bg-warning text-dark' },
    { id: 'COMPLETED', title: 'Completed', badgeClass: 'bg-success' },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((t) => t.status === status);
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    if (onTaskStatusChange) {
      onTaskStatusChange(draggableId, newStatus, destination.index);
    }
  };

  return (
    <div className="kanban active tab_content position-relative w-100 p-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row g-3 overflow-auto pb-4" style={{ minHeight: '600px' }}>
          {columns.map((col) => {
            const colTasks = getTasksByStatus(col.id);
            return (
              <div key={col.id} className="col-12 col-md-6 col-xl-3">
                <div className="dropzone bg-light rounded-3 border p-3 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge ${col.badgeClass} rounded-circle p-1`} style={{ width: '10px', height: '10px' }}></span>
                      <h6 className="fw-bold m-0 text-dark">{col.title}</h6>
                    </div>
                    <span className="badge bg-white text-muted border rounded-pill px-2">{colTasks.length}</span>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow-1 ${snapshot.isDraggingOver ? 'bg-white bg-opacity-50' : ''}`}
                        style={{ minHeight: '150px' }}
                      >
                        {colTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(providedDrag, snapshotDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                {...providedDrag.dragHandleProps}
                                className={`card border-0 shadow-sm mb-3 p-3 ${
                                  snapshotDrag.isDragging ? 'shadow-lg border-primary' : ''
                                }`}
                                onClick={() => onTaskClick && onTaskClick(task)}
                                style={{
                                  ...providedDrag.draggableProps.style,
                                  cursor: 'grab',
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="fw-bold text-dark fs-6 mb-0 text-truncate" style={{ maxWidth: '180px' }}>
                                    {task.title}
                                  </h6>
                                  {task.priority && (
                                    <span
                                      className={`badge small ${
                                        task.priority === 'URGENT' || task.priority === 'HIGH'
                                          ? 'bg-danger'
                                          : 'bg-info text-dark'
                                      }`}
                                    >
                                      {task.priority}
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted small mb-3 text-truncate-2" style={{ fontSize: '12px' }}>
                                  {task.description || 'No detailed description available.'}
                                </p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
