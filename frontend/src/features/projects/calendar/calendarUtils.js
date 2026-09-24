// ==========================================================================
// Emaar PM Connect - Calendar Utility & Positioning Math
// ==========================================================================

export const CALENDAR_CONFIG = {
  DAY_START_HOUR: 7,   // 7:00 AM (Morning Shift Start)
  DAY_END_HOUR: 23,    // 11:30 PM / 12:00 AM Midnight (Noon & Night Shift)
  SLOT_MINUTES: 30,    // 30-minute intervals
  SLOT_HEIGHT_PX: 64,  // 64px per 30 minutes (128px per hour)
};

/**
 * Format Date to Header String (e.g. "Mar 24, 2021")
 */
export const formatDateTitle = (date) => {
  if (!date) return 'Mar 24, 2021';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format Date to Full Day String (e.g. "Saturday, 12 March 2021")
 */
export const formatFullDateString = (date) => {
  if (!date) return 'Saturday, 12 March 2021';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Generate 30-minute Time Slots for Left Axis (7:00 AM to 12:00 AM Midnight)
 */
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = CALENDAR_CONFIG.DAY_START_HOUR; hour <= CALENDAR_CONFIG.DAY_END_HOUR; hour++) {
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    slots.push({
      hour,
      minute: 0,
      label: `${displayHour}:00 ${ampm}`,
      isHourStart: true,
    });

    if (hour < CALENDAR_CONFIG.DAY_END_HOUR) {
      slots.push({
        hour,
        minute: 30,
        label: `${displayHour}:30 ${ampm}`,
        isHourStart: false,
      });
    }
  }
  return slots;
};

/**
 * Calculate Y Position (top in px) from start time date
 */
export const calculateEventTopPx = (dateObj) => {
  const date = new Date(dateObj);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const startMinutes = CALENDAR_CONFIG.DAY_START_HOUR * 60;
  const eventMinutes = hour * 60 + minute;
  const diffMinutes = Math.max(0, eventMinutes - startMinutes);

  // 30 min = 40px -> 1 min = 40 / 30 = 1.3333 px
  return diffMinutes * (CALENDAR_CONFIG.SLOT_HEIGHT_PX / 30);
};

/**
 * Calculate Height (in px) from duration in minutes with 8px vertical gap
 */
export const calculateEventHeightPx = (durationMinutes) => {
  const mins = Math.max(25, durationMinutes || 30);
  const rawHeight = mins * (CALENDAR_CONFIG.SLOT_HEIGHT_PX / 30);
  return Math.max(36, rawHeight - 8); // 8px vertical spacing gap
};

/**
 * Format start and end Date to time range (e.g. "11:00 - 11:30")
 */
export const formatTimeRange = (startDate, endDate) => {
  if (!startDate) return '11:00 - 11:30';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 60000);

  const formatSingle = (d) => {
    let h = d.getHours();
    let m = d.getMinutes();
    h = h % 12;
    h = h ? h : 12;
    const mStr = m < 10 ? `0${m}` : m;
    return `${h}:${mStr}`;
  };

  return `${formatSingle(start)} - ${formatSingle(end)}`;
};

/**
 * Check if a resource has an overlapping event for a proposed start and end time
 */
export const checkTimeSlotConflict = (events = [], resourceId, proposedStart, proposedEnd, ignoreEventId = null) => {
  if (!events || !resourceId || !proposedStart || !proposedEnd) return null;

  const pStart = new Date(proposedStart).getTime();
  const pEnd = new Date(proposedEnd).getTime();

  return events.find((ev) => {
    if (ignoreEventId && ev.id === ignoreEventId) return false;
    if (ev.resourceId !== resourceId) return false;

    const evStart = new Date(ev.start).getTime();
    const evEnd = new Date(ev.end).getTime();

    // Overlap condition: proposedStart < evEnd AND proposedEnd > evStart
    return pStart < evEnd && pEnd > evStart;
  }) || null;
};

/**
 * Calculate Collision Groups & Side-by-Side Positioning for Overlapping Events with 8px gaps
 */
export const resolveEventCollisions = (events) => {
  if (!events || events.length === 0) return [];

  const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const columns = [];

  sorted.forEach((event) => {
    const eventStart = new Date(event.start).getTime();
    let placed = false;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const lastEvent = col[col.length - 1];
      const lastEnd = new Date(lastEvent.end).getTime();

      if (eventStart >= lastEnd) {
        col.push(event);
        event.colIndex = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([event]);
      event.colIndex = columns.length - 1;
    }
  });

  const totalCols = Math.max(1, columns.length);

  return sorted.map((event) => {
    const colIndex = event.colIndex || 0;
    const gapPercent = 2;
    const availableWidth = 90; // 5% inset from left and right column borders (10% total)
    const widthPercent = totalCols === 1 ? 90 : (availableWidth - (totalCols - 1) * gapPercent) / totalCols;
    const leftPercent = 5 + colIndex * (widthPercent + gapPercent);

    return {
      ...event,
      topPx: calculateEventTopPx(event.start) + 4, // 4px top margin offset (8px total vertical gap)
      heightPx: calculateEventHeightPx(
        (new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000
      ),
      widthPercent,
      leftPercent,
    };
  });
};

/**
 * Calculate dynamic work hours for a specific resource based on assigned events (day-wise)
 */
export const calculateResourceWorkHours = (events = [], resourceId, selectedDate = null) => {
  if (!events || !resourceId) return '0 hours';
  let resEvents = events.filter((e) => e.resourceId === resourceId);

  if (selectedDate) {
    const targetStr = new Date(selectedDate).toDateString();
    resEvents = resEvents.filter((e) => new Date(e.start).toDateString() === targetStr);
  }

  const totalMinutes = resEvents.reduce((acc, ev) => {
    const start = new Date(ev.start).getTime();
    const end = new Date(ev.end).getTime();
    const diff = Math.max(0, (end - start) / 60000);
    return acc + diff;
  }, 0);

  if (totalMinutes <= 0) return '0 hours';
  const hours = totalMinutes / 60;
  if (hours % 1 === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  const formatted = Math.round(hours * 10) / 10;
  return `${formatted} hours`;
};

