import { AlertCircle, Calendar, Clock, FileText, Home, MapPin, Plus, Tag, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { checkTimeSlotConflict, formatTimeRange } from './calendarUtils';

export const CalendarAddWorkOrderModal = ({
  resources = [],
  events = [],
  initialResource = null,
  initialTimeSlot = null,
  selectedDate = new Date(),
  editingEvent = null,
  onClose,
  onSubmit,
}) => {
  const isEdit = !!editingEvent;

  // Date formatting for date input: YYYY-MM-DD
  const formatDateForInput = (d) => {
    if (!d) return '';
    const dateObj = new Date(d);
    const yr = dateObj.getFullYear();
    const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dy = String(dateObj.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
  };

  const formatTimeLabel = (dateObj) => {
    if (!dateObj) return '10:00 am';
    const d = new Date(dateObj);
    let h = d.getHours();
    const m = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  const [title, setTitle] = useState(editingEvent ? editingEvent.title.replace(/#\d+$/, '').trim() : '');
  const [resourceId, setResourceId] = useState(editingEvent?.resourceId || initialResource?.id || '');
  const [unitNumber, setUnitNumber] = useState(editingEvent?.unitInfo?.unitNumber || '');
  const [address, setAddress] = useState(editingEvent?.unitInfo?.address || '');
  const [validationError, setValidationError] = useState('');

  const [scheduleDate, setScheduleDate] = useState(() => {
    if (editingEvent?.start) return formatDateForInput(editingEvent.start);
    return formatDateForInput(selectedDate || new Date());
  });

  const [startTime, setStartTime] = useState(() => {
    if (editingEvent?.start) return formatTimeLabel(editingEvent.start);
    return initialTimeSlot?.label || '10:00 am';
  });

  const [duration, setDuration] = useState(() => {
    if (editingEvent?.start && editingEvent?.end) {
      const diffMins = Math.round((new Date(editingEvent.end).getTime() - new Date(editingEvent.start).getTime()) / 60000);
      return String(diffMins || 60);
    }
    return '60';
  });

  const [category, setCategory] = useState(editingEvent?.badgeText || '');
  const [priority, setPriority] = useState(editingEvent?.priority || 'Medium');

  const [selectedDays, setSelectedDays] = useState(editingEvent?.activeDays || [1, 2, 3, 4, 5, 6]);
  const [isRecurring, setIsRecurring] = useState(!!editingEvent?.dateRange?.endDate || !!editingEvent?.isRecurring);

  const [endDate, setEndDate] = useState(() => {
    if (editingEvent?.dateRange?.endDate) return formatDateForInput(editingEvent.dateRange.endDate);
    const d = new Date(selectedDate || new Date());
    d.setDate(d.getDate() + 30);
    return formatDateForInput(d);
  });

  const DAYS_LIST = [
    { label: 'Mon', val: 1 },
    { label: 'Tue', val: 2 },
    { label: 'Wed', val: 3 },
    { label: 'Thu', val: 4 },
    { label: 'Fri', val: 5 },
    { label: 'Sat', val: 6 },
    { label: 'Sun (Off)', val: 0 },
  ];

  const toggleDay = (val) => {
    if (selectedDays.includes(val)) {
      setSelectedDays(selectedDays.filter((d) => d !== val));
    } else {
      setSelectedDays([...selectedDays, val]);
    }
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 10, minute: 0 };
    const match = timeStr.trim().match(/^(\d+):(\d+)\s*(am|pm)?$/i);
    let hour = 10;
    let minute = 0;
    if (match) {
      hour = parseInt(match[1], 10);
      minute = parseInt(match[2], 10);
      const ampm = match[3] ? match[3].toLowerCase() : '';
      if (ampm === 'pm' && hour < 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
    }
    return { hour, minute };
  };

  // Calculate proposed start & end Date objects
  const { proposedStart, proposedEnd } = useMemo(() => {
    if (!startTime || !scheduleDate) return { proposedStart: null, proposedEnd: null };
    const { hour, minute } = parseTime(startTime);
    const [yr, mo, dy] = scheduleDate.split('-').map(Number);
    const start = new Date(yr, mo - 1, dy, hour, minute, 0, 0);
    const end = new Date(start.getTime() + (parseInt(duration, 10) || 60) * 60000);
    return { proposedStart: start, proposedEnd: end };
  }, [scheduleDate, startTime, duration]);

  // Real-time conflict detection
  const conflict = useMemo(() => {
    if (!proposedStart || !proposedEnd || !resourceId) return null;
    return checkTimeSlotConflict(events, resourceId, proposedStart, proposedEnd, editingEvent?.id);
  }, [events, resourceId, proposedStart, proposedEnd, editingEvent]);

  const selectedResource = resources.find((r) => r.id === resourceId) || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a Work Order Title.');
      return;
    }
    if (!resourceId) {
      setValidationError('Please select an Assignee Resource.');
      return;
    }
    if (!category) {
      setValidationError('Please select a Service Category.');
      return;
    }

    if (conflict && !isRecurring) {
      setValidationError(
        `Schedule Conflict Error: ${selectedResource?.name || 'Assignee'} already has a task allocated ('${conflict.title}') for this time slot (${formatTimeRange(conflict.start, conflict.end)}). Please select another time slot or assignee.`
      );
      return;
    }

    setValidationError('');
    const targetRes = selectedResource || resources[0];

    const { hour, minute } = parseTime(startTime);
    const durationMins = parseInt(duration, 10) || 60;

    let themeClass = 'theme-maintenance-amber';
    let iconType = 'wrench';
    if (category === 'Internal Task') {
      themeClass = 'theme-internal-teal';
      iconType = 'clipboard';
    } else if (category === 'Personal Task') {
      themeClass = 'theme-personal-blue';
      iconType = 'user';
    }

    const cleanTitle = title.trim();
    const hasNumTag = /#\d+$/.test(cleanTitle);
    const displayTitle = hasNumTag ? cleanTitle : `${cleanTitle} #${Math.floor(290 + Math.random() * 50)}`;

    const useRecurring = isRecurring || (endDate && endDate >= scheduleDate && selectedDays.length > 0);

    if (useRecurring && endDate && endDate >= scheduleDate) {
      const createdEvents = [];
      const [startYr, startMo, startDy] = scheduleDate.split('-').map(Number);
      const [endYr, endMo, endDy] = endDate.split('-').map(Number);

      const curr = new Date(startYr, startMo - 1, startDy);
      const endLimit = new Date(endYr, endMo - 1, endDy);
      const groupId = isEdit && editingEvent ? (editingEvent.groupId || editingEvent.id) : `group-${Date.now()}`;

      let counter = 0;
      while (curr <= endLimit && counter < 100) {
        counter++;
        const dayOfWeek = curr.getDay(); // 0=Sun, 1=Mon...
        if (selectedDays.includes(dayOfWeek)) {
          const evStart = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), hour, minute, 0, 0);
          const evEnd = new Date(evStart.getTime() + durationMins * 60000);

          createdEvents.push({
            id: isEdit && counter === 1 ? editingEvent.id : `ev-${Date.now()}-${counter}`,
            groupId,
            title: displayTitle,
            resourceId: targetRes.id,
            resourceName: targetRes.name,
            resourceAvatar: targetRes.avatar || '/img/client1.jpg',
            start: evStart,
            end: evEnd,
            badgeText: category || 'Maintenance Service',
            themeClass,
            iconType,
            unitInfo: {
              unitNumber: unitNumber || 'Unit 56',
              address: address || '225 Cherry Street #24 Brooklyn, NY',
              image: editingEvent?.unitInfo?.image || '/img/client1.jpg',
            },
            activeDays: selectedDays,
            dateRange: {
              startDate: scheduleDate,
              endDate,
            },
            isRecurring: true,
          });
        }
        curr.setDate(curr.getDate() + 1);
      }

      if (isEdit && editingEvent) {
        onSubmit({ isEdit: true, targetId: editingEvent.id, groupId, createdEvents });
      } else {
        onSubmit({ createdEvents });
      }
      return;
    }

    // Single-day event creation or edit
    const [yr, mo, dy] = scheduleDate.split('-').map(Number);
    const start = new Date(yr, mo - 1, dy, hour, minute, 0, 0);
    const end = new Date(start.getTime() + durationMins * 60000);

    const singleEvent = {
      id: isEdit && editingEvent ? editingEvent.id : `ev-${Date.now()}`,
      title: displayTitle,
      resourceId: targetRes.id,
      resourceName: targetRes.name,
      resourceAvatar: targetRes.avatar || '/img/client1.jpg',
      start,
      end,
      badgeText: category || 'Maintenance Service',
      themeClass,
      iconType,
      unitInfo: {
        unitNumber: unitNumber || 'Unit 56',
        address: address || '225 Cherry Street #24 Brooklyn, NY',
        image: editingEvent?.unitInfo?.image || '/img/client1.jpg',
      },
      activeDays: selectedDays,
      dateRange: {
        startDate: scheduleDate,
        endDate: null,
      },
      isRecurring: false,
    };

    if (isEdit && editingEvent) {
      onSubmit({ isEdit: true, targetId: editingEvent.id, updatedEvent: singleEvent });
    } else {
      onSubmit({ createdEvents: [singleEvent] });
    }
  };

  const inputStyle = {
    height: '44px',
    minHeight: '44px',
    width: '100%',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    padding: '0 14px',
    fontSize: '13.5px',
    fontWeight: '500',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box' as const,
  };

  const selectStyle = {
    ...inputStyle,
    paddingRight: '36px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    cursor: 'pointer',
  };

  return (
    <div className="pm-cal-modal-backdrop" onClick={onClose}>
      <div className="pm-cal-modal-card" style={{ maxWidth: '600px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
        {/* Header - Clean & Minimal */}
        <div
          className="p-4 text-white d-flex align-items-center justify-content-between position-relative"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}>
              <Plus size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h5 className="m-0 fw-bold text-white fs-6" style={{ fontSize: '16.5px', letterSpacing: '-0.2px' }}>
              {isEdit ? 'Edit Scheduled Work Order' : 'Create Scheduled Work Order'}
            </h5>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            style={{ opacity: 0.85, cursor: 'pointer' }}
          />
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="p-4 bg-white d-flex flex-column" style={{ fontSize: '13.5px', gap: '1.2rem', maxHeight: '76vh', overflowY: 'auto' }}>
            {/* Conflict Notification Alert Banner */}
            {conflict && !isRecurring && (
              <div className="alert alert-danger border border-danger border-opacity-50 rounded-3 p-3 mb-0 d-flex align-items-start gap-2 bg-danger bg-opacity-10 text-dark">
                <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
                  <strong className="text-danger-emphasis d-block mb-1 fs-6 fw-bold">
                    ⛔ Schedule Conflict Error
                  </strong>
                  <span>
                    <strong>{selectedResource?.name || 'Selected Assignee'}</strong> already has a task allocated (
                    <em>"{conflict.title}"</em>) for this time slot (
                    <strong>{formatTimeRange(conflict.start, conflict.end)}</strong>). Please select another time slot or assignee.
                  </span>
                </div>
              </div>
            )}

            {/* Validation Error Alert Banner */}
            {validationError && (
              <div className="alert alert-warning border border-warning border-opacity-50 rounded-3 p-3 mb-0 d-flex align-items-center gap-2 bg-warning bg-opacity-10 text-dark">
                <AlertCircle size={18} className="text-warning flex-shrink-0" />
                <span className="fw-semibold text-warning-emphasis" style={{ fontSize: '13px' }}>
                  {validationError}
                </span>
              </div>
            )}

            {/* Work Order Title Input Box */}
            <div>
              <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <FileText size={15} className="text-primary" />
                <span>Work Order Title *</span>
              </label>
              <input
                type="text"
                className="form-control pm-cal-input"
                placeholder="Enter Work Order Title (e.g. Bathroom Remodeling)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus={true}
                required
                style={{ ...inputStyle, cursor: 'text' }}
              />
            </div>

            {/* Editable Unit Info & Address Inputs */}
            <div className="row g-2">
              <div className="col-5">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <Home size={15} className="text-primary" />
                  <span>Unit Number</span>
                </label>
                <input
                  type="text"
                  className="form-control pm-cal-input"
                  placeholder="Enter Unit (e.g. Unit 56)"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  style={{ ...inputStyle, cursor: 'text' }}
                />
              </div>

              <div className="col-7">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <MapPin size={15} className="text-primary" />
                  <span>Address</span>
                </label>
                <input
                  type="text"
                  className="form-control pm-cal-input"
                  placeholder="Enter Address (e.g. 225 Cherry Street)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ ...inputStyle, cursor: 'text' }}
                />
              </div>
            </div>

            {/* Assignee & Category Row */}
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <User size={15} className="text-primary" />
                  <span>Assignee Resource *</span>
                </label>
                <select
                  className="form-select"
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  style={{
                    ...selectStyle,
                    borderColor: conflict && !isRecurring ? '#ef4444' : '#cbd5e1',
                  }}
                  required
                >
                  <option value="">-- Select Assignee Resource --</option>
                  {resources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name} ({res.role || 'Lead'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <Tag size={15} className="text-primary" />
                  <span>Service Category *</span>
                </label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={selectStyle}
                  required
                >
                  <option value="">-- Select Service Category --</option>
                  <option value="Maintenance Request">Maintenance Service</option>
                  <option value="Internal Task">Internal Task</option>
                  <option value="Personal Task">Personal Task</option>
                </select>
              </div>
            </div>

            {/* Premium Active Schedule Days Selector */}
            <div className="p-3 rounded-3 border" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <label className="form-label fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <Calendar size={15} className="text-primary" />
                  <span>Active Working Days</span>
                </label>
                <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="recurringSwitch"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    style={{ cursor: 'pointer', height: '18px', width: '36px' }}
                  />
                  <label className="form-check-label small fw-bold text-dark" htmlFor="recurringSwitch" style={{ cursor: 'pointer', userSelect: 'none', fontSize: '12px' }}>
                    Repeat across Date Range
                  </label>
                </div>
              </div>

              {/* Day Pills with Generous 10px Gap */}
              <div className="d-flex flex-wrap align-items-center" style={{ gap: '10px' }}>
                {DAYS_LIST.map((day) => {
                  const active = selectedDays.includes(day.val);
                  const isSun = day.val === 0;
                  return (
                    <button
                      key={day.val}
                      type="button"
                      onClick={() => toggleDay(day.val)}
                      className="btn btn-sm fw-bold border transition-all"
                      style={{
                        fontSize: '12px',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        backgroundColor: active ? (isSun ? '#fef3c7' : '#2563eb') : '#ffffff',
                        color: active ? (isSun ? '#b45309' : '#ffffff') : '#64748b',
                        borderColor: active ? (isSun ? '#fde68a' : '#2563eb') : '#cbd5e1',
                        boxShadow: active && !isSun ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Start Time Controls (Start Time ALWAYS Visible!) */}
            <div className="row g-3">
              <div className={isRecurring ? "col-4" : "col-6"}>
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <Calendar size={15} className="text-primary" />
                  <span>{isRecurring ? 'Start Date' : 'Scheduled Date'}</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {isRecurring && (
                <div className="col-4">
                  <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                    <Calendar size={15} className="text-primary" />
                    <span>End Date</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              )}

              <div className={isRecurring ? "col-4" : "col-6"}>
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <Clock size={15} className="text-primary" />
                  <span>Start Time</span>
                </label>
                <select
                  className="form-select"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={selectStyle}
                >
                  {[
                    '7:00 am', '7:30 am', '8:00 am', '8:30 am',
                    '9:00 am', '9:30 am', '10:00 am', '10:30 am',
                    '11:00 am', '11:30 am', '12:00 pm', '12:30 pm',
                    '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
                    '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm',
                    '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm',
                    '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm',
                    '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm'
                  ].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration (15-min Intervals up to 4 Hours) & Priority */}
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <Clock size={15} className="text-primary" />
                  <span>Duration</span>
                </label>
                <select
                  className="form-select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={selectStyle}
                >
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                  <option value="45">45 mins</option>
                  <option value="60">1 hour</option>
                  <option value="75">1 hr 15 mins</option>
                  <option value="90">1.5 hours (1 hr 30 mins)</option>
                  <option value="105">1 hr 45 mins</option>
                  <option value="120">2 hours</option>
                  <option value="135">2 hrs 15 mins</option>
                  <option value="150">2.5 hours (2 hrs 30 mins)</option>
                  <option value="165">2 hrs 45 mins</option>
                  <option value="180">3 hours</option>
                  <option value="195">3 hrs 15 mins</option>
                  <option value="210">3.5 hours (3 hrs 30 mins)</option>
                  <option value="225">3 hrs 45 mins</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <Tag size={15} className="text-primary" />
                  <span>Priority</span>
                </label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={selectStyle}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-light border-top d-flex gap-3 justify-content-end align-items-center">
            <button
              type="button"
              className="btn fw-bold"
              onClick={onClose}
              style={{
                height: '44px',
                minHeight: '44px',
                padding: '0 24px',
                borderRadius: '12px',
                fontSize: '13.5px',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#475569',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn fw-bold"
              disabled={!!conflict && !isRecurring}
              style={{
                height: '44px',
                minHeight: '44px',
                padding: '0 26px',
                borderRadius: '12px',
                fontSize: '13.5px',
                backgroundColor: conflict && !isRecurring ? '#ef4444' : '#2563eb',
                borderColor: conflict && !isRecurring ? '#ef4444' : '#2563eb',
                color: '#ffffff',
                boxShadow: conflict && !isRecurring
                  ? '0 4px 14px rgba(239, 68, 68, 0.35)'
                  : '0 4px 14px rgba(37, 99, 235, 0.35)',
                cursor: conflict && !isRecurring ? 'not-allowed' : 'pointer',
              }}
            >
              {conflict && !isRecurring ? '⛔ Schedule Conflict' : isEdit ? 'Update Work Order' : 'Create Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
