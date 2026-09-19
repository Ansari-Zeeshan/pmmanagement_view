import React from 'react';
import { calculateResourceWorkHours } from './calendarUtils';

export const CalendarResourceHeader = ({
  resources = [],
  events = [],
  selectedDate = new Date(),
  onAddForResource,
  onReorderResources,
}) => {
  const handleDragStart = (e, resourceId) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'RESOURCE_COLUMN', resourceId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetResourceId) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const parsed = JSON.parse(dataStr);
      if (parsed.type === 'RESOURCE_COLUMN' && parsed.resourceId && onReorderResources) {
        onReorderResources(parsed.resourceId, targetResourceId);
      }
    } catch (err) {
      console.error('Failed to handle resource column drop', err);
    }
  };

  return (
    <div className="pm-cal-resource-header-row">
      {/* Left ALL DAY Label */}
      <div className="pm-cal-allday-col">
        All Day
      </div>

      {/* Resource Column Cards Header */}
      <div className="pm-cal-resource-cols-wrapper">
        {resources.map((res) => {
          const workHours = calculateResourceWorkHours(events, res.id, selectedDate);

          return (
            <div
              key={res.id}
              className="pm-cal-resource-card position-relative group"
              draggable={true}
              onDragStart={(e) => handleDragStart(e, res.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, res.id)}
              title="Drag column header to reorder employee column"
              style={{ cursor: 'grab' }}
            >
              <div className="d-flex align-items-center gap-2 overflow-hidden">
                <img
                  src={res.avatar}
                  alt={res.name}
                  className="pm-cal-avatar flex-shrink-0"
                  onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.15rem', flexDirection: 'column', minWidth: 0 }}>
                  <h6 className="pm-cal-resource-name text-truncate" title={res.name}>{res.name}</h6>
                  <span className="pm-cal-resource-hours">{workHours}</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-1">
                {/* Add Work Order Button */}
                <button
                  type="button"
                  className="pm-cal-plus-btn"
                  onClick={() => onAddForResource && onAddForResource(res)}
                  title={`Add Work Order for ${res.name}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
