import { Calendar, ChevronRight, Clock, Edit3, X } from 'lucide-react';
import { formatDateTitle, formatFullDateString, formatTimeRange } from './calendarUtils';

const DAYS_MAP = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun' };

const formatActiveDays = (daysArray) => {
  if (!Array.isArray(daysArray) || daysArray.length === 0) return 'Mon, Tue, Wed, Thu, Fri, Sat';
  const activeNames = daysArray.map((d) => DAYS_MAP[d]).filter(Boolean);
  return activeNames.join(', ');
};

const formatDateRangeDisplay = (event) => {
  if (event.dateRange?.startDate && event.dateRange?.endDate) {
    const s = new Date(event.dateRange.startDate);
    const e = new Date(event.dateRange.endDate);
    return `${formatDateTitle(s)} — ${formatDateTitle(e)}`;
  }
  return formatDateTitle(new Date(event.start));
};

export const CalendarEventDrawer = ({ event, onClose, onDelete, onEdit }) => {
  if (!event) return null;

  return (
    <>
      {/* Background Dim Backdrop Overlay */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-20"
        style={{ zIndex: 99990, backdropFilter: 'blur(1px)' }}
        onClick={onClose}
      />

      {/* Floating Detail Drawer (Matching Reference Screenshot) */}
      <div className="pm-cal-detail-drawer">
        {/* Drawer Header */}
        <div className="p-3 border-bottom d-flex align-items-start justify-content-between bg-white">
          <div>
            <h5 className="m-0 fw-bold text-dark fs-5" style={{ fontWeight: 700 }}>{event.title}</h5>
            <span className="badge bg-warning bg-opacity-20 text-warning-emphasis border border-warning border-opacity-30 mt-2 px-2 py-1 rounded-pill small fw-bold">
              {event.badgeText ? event.badgeText.toUpperCase() : 'MAINTENANCE SERVICE'}
            </span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle p-1 border-0"
              onClick={() => onEdit && onEdit(event)}
              title="Edit Task Details"
            >
              <Edit3 size={16} className="text-primary" />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle p-1 border-0 ms-1"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Content Sections */}
        <div className="p-3 d-flex flex-column gap-3 overflow-auto bg-white" style={{ maxHeight: '78vh' }}>
          {/* Unit Information Section */}
          <div>
            <div className="text-uppercase fw-bold mb-2" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', color: '#64748b' }}>
              UNIT INFORMATION
            </div>
            <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded-3 border cursor-pointer">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={event.unitInfo?.image || '/img/client1.jpg'}
                  alt="unit"
                  className="rounded-3 border object-fit-cover"
                  style={{ width: '42px', height: '42px' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                />
                <div>
                  <h6 className="m-0 fw-bold text-dark fs-6" style={{ fontWeight: 700 }}>{event.unitInfo?.unitNumber || 'Unit 56'}</h6>
                  <p className="m-0 text-muted fw-normal" style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>
                    {event.unitInfo?.address || '225 Cherry Street #24 Brooklyn, NY'}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted ms-2" />
            </div>
          </div>

          {/* Assignee Information Section */}
          <div>
            <div className="text-uppercase fw-bold mb-2" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', color: '#64748b' }}>
              ASSIGNEE INFORMATION
            </div>
            <div className="d-flex align-items-center gap-2">
              <img
                src={event.resourceAvatar || '/img/client1.jpg'}
                alt="Assignee"
                className="rounded-circle border"
                style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/img/client1.jpg'; }}
              />
              <div>
                <h6 className="m-0 fw-bold text-dark fs-6" style={{ fontWeight: 700 }}>{event.resourceName || 'Nicholas Amazon'}</h6>
                <p className="m-0 text-muted fw-normal" style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>Senior Project Lead</p>
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div>
            <div className="text-uppercase fw-bold mb-2" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', color: '#64748b' }}>
              DATE & TIME
            </div>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2 text-dark fw-normal" style={{ fontSize: '13px', fontWeight: 400 }}>
                <Calendar size={16} className="text-primary" />
                <span className="fw-normal" style={{ fontWeight: 400 }}>{formatFullDateString(event.start)}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-dark fw-normal" style={{ fontSize: '13px', fontWeight: 400 }}>
                <Clock size={16} className="text-primary" />
                <span className="fw-normal" style={{ fontWeight: 400 }}>{formatTimeRange(event.start, event.end)}</span>
              </div>
            </div>
          </div>

          {/* Active Days & Date Range Section */}
          <div>
            <div className="text-uppercase fw-bold mb-2" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', color: '#64748b' }}>
              ACTIVE DAYS & DATE RANGE
            </div>
            <div className="d-flex flex-column gap-2 p-2 bg-light rounded-3 border">
              <div className="d-flex align-items-center justify-content-between" style={{ fontSize: '12.5px' }}>
                <span className="fw-semibold text-muted">Active Days:</span>
                <span className="fw-bold text-dark">{formatActiveDays(event.activeDays)}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between" style={{ fontSize: '12.5px' }}>
                <span className="fw-semibold text-muted">Date Range:</span>
                <span className="fw-bold text-primary">{formatDateRangeDisplay(event)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-top bg-light d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm px-3 fw-bold d-flex align-items-center gap-1"
            onClick={() => onEdit && onEdit(event)}
          >
            <Edit3 size={15} />
            <span>Edit Task</span>
          </button>
          <button type="button" className="btn btn-outline-danger btn-sm px-3 fw-bold" onClick={() => onDelete && onDelete(event)}>
            Delete
          </button>
          <button type="button" className="btn btn-primary btn-sm px-4 fw-bold" style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};
