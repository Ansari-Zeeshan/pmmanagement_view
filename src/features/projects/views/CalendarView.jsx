import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

export const CalendarView = ({ tasks = [] }) => {
  const events = tasks.map((t) => ({
    id: t._id,
    title: t.title,
    start: t.startDate ? new Date(t.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    end: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : undefined,
    color: t.status === 'COMPLETED' ? '#28a745' : t.status === 'IN_PROGRESS' ? '#0d6efd' : '#ffc107',
  }));

  return (
    <div className="calendar active tab_content position-relative w-100 p-3">
      <div className="bg-white rounded-3 shadow-sm border p-3">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          validRange={{ start: '1990-01-01', end: '2100-12-31' }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          events={events}
          height="650px"
        />
      </div>
    </div>
  );
};
