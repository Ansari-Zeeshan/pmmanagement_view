import { CalendarEventCard } from './CalendarEventCard';
import { generateTimeSlots, resolveEventCollisions } from './calendarUtils';

export const CalendarWeekView = ({
  selectedDate,
  events = [],
  onSelectEvent,
  onMenuAction,
  onEventDrop,
  onSlotClick,
}) => {
  const timeSlots = generateTimeSlots();

  // Calculate Monday to Sunday dates for selected week
  const startOfWeek = new Date(selectedDate);
  const dayOfWeek = startOfWeek.getDay();
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMon);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnDaySlot = (e, dayDate, slot) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const { eventId, originResourceId } = JSON.parse(dataStr);
      if (eventId && onEventDrop) {
        onEventDrop(eventId, originResourceId, slot, dayDate);
      }
    } catch (err) {
      console.error('Failed to handle week drag drop', err);
    }
  };

  return (
    <div className="pm-cal-week-scroll-wrapper">
      <div className="pm-cal-scroll-canvas">
        {/* Week Header Row (Matches All Day Column & 7 Days) */}
        <div className="pm-cal-resource-header-row">
          <div className="pm-cal-allday-col">Week View</div>
          <div className="pm-cal-resource-cols-wrapper">
            {weekDays.map((day, idx) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={idx}
                  className="pm-cal-resource-card flex-column justify-content-center text-center py-2"
                  style={{
                    background: isToday ? '#eff6ff' : '#ffffff',
                    borderBottom: isToday ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: isToday ? '#2563eb' : '#64748b',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: isToday ? '#2563eb' : '#0f172a',
                      lineHeight: 1.1,
                    }}
                  >
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Week Grid Viewport */}
        <div className="pm-cal-grid-viewport">
          {/* Left Time Axis Column */}
          <div className="pm-cal-time-axis-col">
            {timeSlots.map((slot, idx) => (
              <div key={idx} className="pm-cal-time-label-slot">
                {slot.label}
              </div>
            ))}
          </div>

          {/* 7 Days Columns Wrapper */}
          <div className="pm-cal-grid-columns-wrapper">
            {weekDays.map((day, dIdx) => {
              const dayEvents = events.filter((e) => {
                const eDate = new Date(e.start);
                return eDate.toDateString() === day.toDateString();
              });
              const positioned = resolveEventCollisions(dayEvents);

              return (
                <div key={dIdx} className="pm-cal-grid-col">
                  {/* 30-min Background Time Slot Cells */}
                  {timeSlots.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className={`pm-cal-slot-cell ${slot.isHourStart ? 'hour-line' : ''}`}
                      onClick={() => onSlotClick && onSlotClick(null, slot, day)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnDaySlot(e, day, slot)}
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
