import { INITIAL_NOTIFICATIONS, INITIAL_PROJECTS } from '../data/initialData';
import { apiClient } from './axios';

const TASKS_STORAGE_KEY = 'emaar_pm_database_tasks_v2';
const CALENDAR_EVENTS_STORAGE_KEY = 'emaar_pm_database_calendar_events_v2';
const NOTIFICATIONS_STORAGE_KEY = 'emaar_pm_database_notifications_v2';

/**
 * Retrieve saved projects/tasks from persistent storage (or fallback seed data)
 */
export const getSavedTasks = (fallbackTasks = INITIAL_PROJECTS) => {
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
  return fallbackTasks && fallbackTasks.length > 0 ? fallbackTasks : INITIAL_PROJECTS;
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
 * Update an existing task in persistent storage
 */
export const updateTaskInDatabase = (updatedTask, currentTasks = []) => {
  const existingTasks = currentTasks && currentTasks.length > 0 ? currentTasks : getSavedTasks();
  const exists = existingTasks.some((t) => t._id === updatedTask._id);
  let updatedList;
  if (exists) {
    updatedList = existingTasks.map((t) => (t._id === updatedTask._id ? { ...t, ...updatedTask } : t));
  } else {
    updatedList = [updatedTask, ...existingTasks];
  }
  saveTasks(updatedList);
  return updatedList;
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

  apiClient.post('/calendar/sync', { events }).catch(() => {});
};

/**
 * Retrieve saved notifications from persistent storage
 */
export const getSavedNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Error reading notifications:', err);
  }
  return INITIAL_NOTIFICATIONS;
};

/**
 * Save notification array
 */
export const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.error('Error saving notifications:', err);
  }
};

/**
 * Push new notification
 */
export const addNotificationToDatabase = (notification) => {
  const current = getSavedNotifications();
  const updated = [notification, ...current];
  saveNotifications(updated);
  return updated;
};
