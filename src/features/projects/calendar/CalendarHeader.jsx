import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LayoutList, Plus, Users } from 'lucide-react';

const formatHeaderDateDisplay = (selectedDate, activeView) => {
  if (!selectedDate) return '';
  const d = new Date(selectedDate);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();

  if (activeView === 'DAY') {
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (isToday) {
      return `${formattedDate} • ${dayName} (Today)`;
    }
    return `${formattedDate} • ${dayName}`;
  }

  if (activeView === 'WEEK') {
    const startOfWeek = new Date(d);
    const dayOfWeek = startOfWeek.getDay();
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMon);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} — ${endStr}`;
  }

  if (activeView === 'MONTH') {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const CalendarHeader = ({
  selectedDate,
  onNavigate,
  activeView,
  onViewChange,
  onAddWorkOrder,
  onOpenMemberModal,
}) => {
  return (
    <div className="pm-cal-toolbar-bar">
      {/* Left Stepper & Date Title */}
      <div className="d-flex align-items-center gap-3">
        {/* Left View Type Icons */}
        <div className="d-flex align-items-center bg-light p-1 rounded-3 border gap-1">
          <button type="button" className="btn btn-sm p-2 border-0 text-muted hover-text-dark" title="List View">
            <LayoutList size={16} />
          </button>
          <button type="button" className="btn btn-sm p-2 border-0 text-primary bg-white shadow-xs rounded-2" title="Calendar View">
            <CalendarIcon size={16} />
          </button>
        </div>

        {/* Stepper Navigation: < > Sep 16, 2026 • Wednesday */}
        <div className="pm-cal-stepper">
          <button
            type="button"
            className="pm-cal-stepper-btn"
            onClick={() => onNavigate('PREV')}
            title="Previous Date"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="pm-cal-stepper-btn"
            onClick={() => onNavigate('NEXT')}
            title="Next Date"
          >
            <ChevronRight size={16} />
          </button>

          <span className="pm-cal-date-text ms-2">
            {formatHeaderDateDisplay(selectedDate, activeView)}
          </span>
        </div>
      </div>

      {/* Right Controls: Members | Day Week Month | + Work Order */}
      <div className="d-flex align-items-center gap-3">
        {/* Manage Members Button */}
        {onOpenMemberModal && activeView === 'DAY' && (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary fw-bold px-3 py-1 rounded-pill d-flex align-items-center gap-2 shadow-xs"
            style={{ fontSize: '12.5px', height: '34px' }}
            onClick={onOpenMemberModal}
            title="Manage calendar team member columns"
          >
            <Users size={15} />
            <span>Members</span>
          </button>
        )}

        {/* Segmented View Switcher */}
        <div className="pm-cal-segmented">
          <button
            type="button"
            className={`pm-cal-seg-btn ${activeView === 'DAY' ? 'active' : ''}`}
            onClick={() => onViewChange('DAY')}
          >
            Day
          </button>
          <button
            type="button"
            className={`pm-cal-seg-btn ${activeView === 'WEEK' ? 'active' : ''}`}
            onClick={() => onViewChange('WEEK')}
          >
            Week
          </button>
          <button
            type="button"
            className={`pm-cal-seg-btn ${activeView === 'MONTH' ? 'active' : ''}`}
            onClick={() => onViewChange('MONTH')}
          >
            Month
          </button>
        </div>

        {/* Primary CTA Work Order Button */}
        <button
          type="button"
          className="pm-cal-btn-primary"
          onClick={onAddWorkOrder}
          style={{ height: '34px' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Work Order</span>
        </button>
      </div>
    </div>
  );
};
