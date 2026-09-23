import React, { useState } from 'react';

export const CalendarMonthView = ({ selectedDate, events = [], onSelectEvent }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate();

  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const daysArray = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDay + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      daysArray.push(new Date(year, month, dayNum));
    } else {
      daysArray.push(null);
    }
  }

  const [overflowDate, setOverflowDate] = useState(null);

  return (
    <div className="pm-cal-month-scroll-wrapper">
      <div className="pm-cal-month-canvas d-flex flex-column p-2">
        {/* Month Days of Week Header */}
        <div className="d-grid text-center fw-bold bg-light py-2 border-bottom" style={{ gridTemplateColumns: 'repeat(7, 1fr)', fontSize: '12px' }}>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Month Days Grid */}
        <div className="d-grid border-start border-top bg-white" style={{ gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '520px' }}>
          {daysArray.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="border-end border-bottom bg-light bg-opacity-50 p-2 min-h-100" />;
            }

            const isToday = day.toDateString() === new Date().toDateString();
            const dayEvents = events.filter((e) => new Date(e.start).toDateString() === day.toDateString());
            const visibleEvents = dayEvents.slice(0, 3);
            const hiddenCount = dayEvents.length - visibleEvents.length;

            return (
              <div
                key={idx}
                className="border-end border-bottom p-1 position-relative d-flex flex-column justify-content-between"
                style={{ minHeight: '95px', backgroundColor: isToday ? '#eff6ff' : '#ffffff' }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span
                      className={`small fw-bold px-1 py-0.5 rounded-circle ${isToday ? 'bg-primary text-white' : 'text-secondary'}`}
                      style={{ fontSize: '11px' }}
                    >
                      {day.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="badge bg-light text-muted border" style={{ fontSize: '9px' }}>
                        {dayEvents.length} items
                      </span>
                    )}
                  </div>

                  {/* Visible Event Badges */}
                  <div className="d-flex flex-column gap-1">
                    {visibleEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`px-1 py-0.5 rounded text-truncate cursor-pointer ${ev.themeClass}`}
                        style={{ fontSize: '10.5px', fontWeight: 600 }}
                        onClick={() => onSelectEvent(ev)}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* + X More Trigger */}
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-primary text-start fw-semibold border-0 bg-transparent mt-1"
                    style={{ fontSize: '10px' }}
                    onClick={() => setOverflowDate({ day, events: dayEvents })}
                  >
                    +{hiddenCount} more
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Overflow Event List Popover */}
        {overflowDate && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-40 d-flex align-items-center justify-content-center"
            style={{ zIndex: 999999 }}
            onClick={() => setOverflowDate(null)}
          >
            <div className="bg-white rounded-3 shadow-2xl p-3 border" style={{ width: '320px' }} onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <h6 className="m-0 fw-bold">{overflowDate.day.toDateString()}</h6>
                <button className="btn-close btn-sm" onClick={() => setOverflowDate(null)}></button>
              </div>
              <div className="d-flex flex-column gap-1 max-h-64 overflow-auto">
                {overflowDate.events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-2 rounded cursor-pointer ${ev.themeClass}`}
                    onClick={() => { onSelectEvent(ev); setOverflowDate(null); }}
                  >
                    <div className="fw-bold small">{ev.title}</div>
                    <div className="small opacity-75">{ev.badgeText}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
