import { apiClient } from './axios';

const TASKS_STORAGE_KEY = 'emaar_pm_database_tasks_v1';
const CALENDAR_EVENTS_STORAGE_KEY = 'emaar_pm_database_calendar_events_v1';

/**
 * Retrieve saved projects/tasks from persistent storage (or fallback seed data)
 */
export const getSavedTasks = (fallbackTasks = []) => {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading tasks from LocalStorage database:', err);
  }
  return fallbackTasks;
};

/**
 * Save projects/tasks array to persistent storage & attempt backend sync
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks to LocalStorage database:', err);
  }

  // Background sync attempt with backend if endpoint exists
  apiClient.post('/tasks/sync', { tasks }).catch(() => {
    // Graceful silent fallback in offline/demo mode
  });
};

/**
 * Add a new task to persistent storage
 */
export const saveNewTask = (newTask, currentTasks = []) => {
  const updated = [newTask, ...currentTasks];
  saveTasks(updated);
  return updated;
};

/**
 * Retrieve saved calendar events from persistent storage
 */
export const getSavedCalendarEvents = (fallbackEvents = []) => {
  try {
    const raw = localStorage.getItem(CALENDAR_EVENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Re-hydrate Date objects
        return parsed.map((ev) => ({
          ...ev,
          start: ev.start ? new Date(ev.start) : new Date(),
          end: ev.end ? new Date(ev.end) : new Date(),
        }));
      }
    }
  } catch (err) {
    console.warn('Error reading calendar events from LocalStorage database:', err);
  }
  return fallbackEvents;
};

/**
 * Save calendar events array to persistent storage & attempt backend sync
 */
export const saveCalendarEvents = (events) => {
  try {
    localStorage.setItem(CALENDAR_EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving calendar events to LocalStorage database:', err);
  }

  // Background sync attempt with backend
  apiClient.post('/calendar/sync', { events }).catch(() => {
    // Graceful silent fallback in offline/demo mode
  });
};

/**
 * Save single new calendar event
 */
export const saveNewCalendarEvent = (newEvent, currentEvents = []) => {
  const updated = [newEvent, ...currentEvents];
  saveCalendarEvents(updated);
  return updated;
};
