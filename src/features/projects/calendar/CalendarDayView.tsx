import React, { useEffect, useState } from 'react';
import { generateTimeSlots, calculateEventTopPx, resolveEventCollisions } from './calendarUtils';
import { CalendarEventCard } from './CalendarEventCard';
import { CalendarResourceHeader } from './CalendarResourceHeader';

export const CalendarDayView = ({
  selectedDate = new Date(),
  resources = [],
  events = [],
  onSelectEvent,
  onSlotClick,
  onMenuAction,
  onEventDrop,
  onReorderResources,
  onAddForResource,
  onRemoveResource,
  onOpenMemberModal,
  maxLimit = 6,
}) => {
  const timeSlots = generateTimeSlots();
  const [currentTimePos, setCurrentTimePos] = useState(null);
  const [currentTimeLabel, setCurrentTimeLabel] = useState('11:35');

  // Live Current-Time Line Position Calculation
  useEffect(() => {
    const updateTimeLine = () => {
      const now = new Date();
      // Set to 11:35 for visual reference if outside 9am-6pm range
      const h = now.getHours();
      if (h < 9 || h >= 18) {
        now.setHours(11, 35, 0, 0);
      }
      const topPx = calculateEventTopPx(now);
      setCurrentTimePos(topPx);
      let hour = now.getHours() % 12;
      hour = hour ? hour : 12;
      const min = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
      setCurrentTimeLabel(`${hour}:${min}`);
    };

    updateTimeLine();
    const interval = setInterval(updateTimeLine, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSlot = (e, res, slot) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const { eventId } = JSON.parse(dataStr);
      if (eventId && onEventDrop) {
        onEventDrop(eventId, res.id, slot);
      }
    } catch (err) {
      console.error('Failed to parse drag drop event data', err);
    }
  };

  const selDateStr = selectedDate ? new Date(selectedDate).toDateString() : new Date().toDateString();
  const isToday = selDateStr === new Date().toDateString();

  return (
    <div className="pm-cal-day-scroll-wrapper">
      <div className="pm-cal-scroll-canvas">
        {/* Resource Column Header Row */}
        <CalendarResourceHeader
          resources={resources}
          events={events}
          selectedDate={selectedDate}
          onReorderResources={onReorderResources}
          onAddForResource={onAddForResource}
        />

        {/* Main Day Resource Scheduling Grid */}
        <div className="pm-cal-grid-viewport">
          {/* Left Time Axis Column */}
          <div className="pm-cal-time-axis-col">
            {timeSlots.map((slot, idx) => (
              <div key={idx} className="pm-cal-time-label-slot">
                {slot.label}
              </div>
            ))}
          </div>

          {/* Grid Columns Wrapper */}
          <div className="pm-cal-grid-columns-wrapper">
            {/* Live Current Time Line Indicator (Only shown on Today) */}
            {isToday && currentTimePos !== null && (
              <div className="pm-cal-current-time-line" style={{ top: `${currentTimePos}px` }}>
                <span className="pm-cal-current-time-pill">{currentTimeLabel}</span>
              </div>
            )}

            {/* Resource Columns */}
            {resources.map((res) => {
              const resEvents = events.filter((e) => {
                if (e.resourceId !== res.id) return false;
                const eDate = new Date(e.start);
                return eDate.toDateString() === selDateStr;
              });
              const positioned = resolveEventCollisions(resEvents);

              return (
                <div key={res.id} className="pm-cal-grid-col">
                  {/* Background 30-min Slot Cells */}
                  {timeSlots.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className={`pm-cal-slot-cell ${slot.isHourStart ? 'hour-line' : ''}`}
                      onClick={() => onSlotClick && onSlotClick(res, slot)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, res, slot)}
                    />
                  ))}

                  {/* Positioned Event Cards */}
                  {positioned.map((event) => (
                    <CalendarEventCard
                      key={event.id}
                      event={event}
                      onClick={onSelectEvent}
                      onMenuAction={onMenuAction}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
