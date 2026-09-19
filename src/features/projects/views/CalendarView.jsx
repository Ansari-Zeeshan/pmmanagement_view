import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSavedCalendarEvents, saveCalendarEvents } from '../../../lib/taskDatabase';
import '../calendar/calendar.css';
import {
    extractCalendarResources,
    transformTasksToCalendarEvents,
} from '../calendar/calendarAdapter';
import { CalendarAddWorkOrderModal } from '../calendar/CalendarAddWorkOrderModal';
import { CalendarDayView } from '../calendar/CalendarDayView';
import { CalendarEventDrawer } from '../calendar/CalendarEventDrawer';
import { CalendarHeader } from '../calendar/CalendarHeader';
import { CalendarMemberSelectorModal } from '../calendar/CalendarMemberSelectorModal';
import { CalendarMonthView } from '../calendar/CalendarMonthView';
import { checkTimeSlotConflict, formatTimeRange } from '../calendar/calendarUtils';
import { CalendarWeekView } from '../calendar/CalendarWeekView';

export const CalendarView = ({
  tasks = [],
  onTaskClick,
  onTaskStatusChange,
  onAddProject,
}) => {
  const VIEW_ORDER = { DAY: 0, WEEK: 1, MONTH: 2 };
  const MAX_VISIBLE_RESOURCES = 6;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState('DAY'); // 'DAY', 'WEEK', 'MONTH'
  const [slideDirection, setSlideDirection] = useState('right');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [conflictToast, setConflictToast] = useState(null);

  const handleViewChange = (newView) => {
    if (newView === activeView) return;
    const currentIdx = VIEW_ORDER[activeView] ?? 0;
    const newIdx = VIEW_ORDER[newView] ?? 0;
    setSlideDirection(newIdx > currentIdx ? 'right' : 'left');
    setActiveView(newView);
  };

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedResourceForAdd, setSelectedResourceForAdd] = useState(null);
  const [selectedSlotForAdd, setSelectedSlotForAdd] = useState(null);

  // Local Task Event & Resource Column State
  const [resourcesList, setResourcesList] = useState(() => extractCalendarResources(tasks));
  const [selectedResourceIds, setSelectedResourceIds] = useState(() =>
    resourcesList.slice(0, MAX_VISIBLE_RESOURCES).map((r) => r.id)
  );
  const [eventsList, setEventsList] = useState(() =>
    getSavedCalendarEvents(transformTasksToCalendarEvents(tasks, selectedDate, resourcesList))
  );

  useEffect(() => {
    saveCalendarEvents(eventsList);
  }, [eventsList]);

  // Filter visible resources based on max 5-6 member selection limit
  const visibleResources = resourcesList.filter((r) => selectedResourceIds.includes(r.id));

  const handleToggleResource = (resId) => {
    setSelectedResourceIds((prev) => {
      if (prev.includes(resId)) {
        if (prev.length <= 1) return prev; // Keep at least 1 resource visible
        return prev.filter((id) => id !== resId);
      } else {
        if (prev.length >= MAX_VISIBLE_RESOURCES) return prev; // Max 6 limit
        return [...prev, resId];
      }
    });
  };

  const handleAddNewMember = ({ name, role }) => {
    const newMember = {
      id: `res-${Date.now()}`,
      name,
      role: role || 'Team Member',
      avatar: `/img/client${Math.floor(1 + Math.random() * 3)}.jpg`,
      totalHours: '0 hours',
    };
    setResourcesList((prev) => [newMember, ...prev]);
    setSelectedResourceIds((prev) => {
      if (prev.length >= MAX_VISIBLE_RESOURCES) {
        return [...prev.slice(0, MAX_VISIBLE_RESOURCES - 1), newMember.id];
      }
      return [...prev, newMember.id];
    });
  };

  const handleRemoveResource = (resId) => {
    setSelectedResourceIds((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((id) => id !== resId);
    });
  };

  const handleReorderResources = (sourceId, targetId) => {
    setResourcesList((prev) => {
      const fromIdx = prev.findIndex((r) => r.id === sourceId);
      const toIdx = prev.findIndex((r) => r.id === targetId);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated;
    });
  };

  // Date Stepper Navigation (< > Today)
  const handleNavigate = (action) => {
    const newDate = new Date(selectedDate);
    if (action === 'PREV') {
      if (activeView === 'DAY') newDate.setDate(newDate.getDate() - 1);
      else if (activeView === 'WEEK') newDate.setDate(newDate.getDate() - 7);
      else newDate.setMonth(newDate.getMonth() - 1);
    } else if (action === 'NEXT') {
      if (activeView === 'DAY') newDate.setDate(newDate.getDate() + 1);
      else if (activeView === 'WEEK') newDate.setDate(newDate.getDate() + 7);
      else newDate.setMonth(newDate.getMonth() + 1);
    } else if (action === 'TODAY') {
      setSelectedDate(new Date());
      return;
    }
    setSelectedDate(newDate);
  };

  // Filter events based on search query
  const filteredEvents = eventsList.filter((ev) => {
    if (searchQuery && !ev.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Event Action Handlers
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    if (onTaskClick && event.rawTask) {
      onTaskClick(event.rawTask);
    }
  };

  const handleMenuAction = (action, event) => {
    if (action === 'DELETE') {
      setEventsList((prev) => prev.filter((e) => e.id !== event.id));
      if (selectedEvent?.id === event.id) setSelectedEvent(null);
    } else if (action === 'EDIT') {
      setEditingEvent(event);
      setShowAddModal(true);
    }
  };

  const parseTimeStringToHourMin = (timeStr) => {
    if (!timeStr) return { hour: 10, minute: 0 };
    const match = timeStr.trim().match(/^(\d+):(\d+)\s*(am|pm)?$/i);
    if (!match) return { hour: 10, minute: 0 };
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toLowerCase() : '';
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    return { hour, minute };
  };

  const handleEventDrop = (eventId, targetResourceId, targetSlot, targetDate = null) => {
    const baseDate = targetDate ? new Date(targetDate) : new Date(selectedDate);
    let targetHour = 10;
    let targetMin = 0;
    if (targetSlot) {
      targetHour = targetSlot.hour;
      targetMin = targetSlot.minute;
    }

    const proposedStart = new Date(baseDate.setHours(targetHour, targetMin, 0, 0));
    const origEvent = eventsList.find((e) => e.id === eventId);
    const durationMins = origEvent
      ? (new Date(origEvent.end).getTime() - new Date(origEvent.start).getTime()) / 60000
      : 30;
    const proposedEnd = new Date(proposedStart.getTime() + durationMins * 60000);

    const conflict = checkTimeSlotConflict(eventsList, targetResourceId, proposedStart, proposedEnd, eventId);
    const targetRes = resourcesList.find((r) => r.id === targetResourceId) || visibleResources[0];

    if (conflict) {
      setConflictToast({
        resourceName: targetRes.name,
        conflictTitle: conflict.title,
        timeRange: formatTimeRange(conflict.start, conflict.end),
      });
      setTimeout(() => setConflictToast(null), 6000);
      return;
    }

    setEventsList((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          resourceId: targetRes.id,
          resourceName: targetRes.name,
          resourceAvatar: targetRes.avatar,
          start: proposedStart,
          end: proposedEnd,
        };
      })
    );
  };

  const handleCreateWorkOrder = (formData) => {
    if (formData.isEdit && formData.targetId) {
      if (Array.isArray(formData.createdEvents) && formData.createdEvents.length > 0) {
        const targetGroup = formData.groupId;
        setEventsList((prev) => [
          ...prev.filter((ev) => ev.id !== formData.targetId && (targetGroup ? ev.groupId !== targetGroup : true)),
          ...formData.createdEvents,
        ]);
        if (selectedEvent?.id === formData.targetId || (targetGroup && selectedEvent?.groupId === targetGroup)) {
          setSelectedEvent(formData.createdEvents[0]);
        }
      } else if (formData.updatedEvent) {
        setEventsList((prev) =>
          prev.map((ev) => (ev.id === formData.targetId ? formData.updatedEvent : ev))
        );
        if (selectedEvent?.id === formData.targetId) {
          setSelectedEvent(formData.updatedEvent);
        }
      }
      setShowAddModal(false);
      setEditingEvent(null);
      return;
    }

    let newEvents = [];

    if (Array.isArray(formData.createdEvents) && formData.createdEvents.length > 0) {
      newEvents = formData.createdEvents;
    } else {
      const { hour, minute } = parseTimeStringToHourMin(formData.startTime);
      let startDate = new Date();
      if (formData.scheduleDate) {
        const [yr, mo, dy] = formData.scheduleDate.split('-').map(Number);
        startDate = new Date(yr, mo - 1, dy, hour, minute, 0, 0);
      } else {
        startDate = new Date(selectedDate);
        startDate.setHours(hour, minute, 0, 0);
      }

      const durationMins = formData.durationMinutes || 60;
      const endDate = new Date(startDate.getTime() + durationMins * 60000);

      let themeClass = 'theme-maintenance-amber';
      let iconType = 'wrench';
      if (formData.category === 'Internal Task') {
        themeClass = 'theme-internal-teal';
        iconType = 'clipboard';
      } else if (formData.category === 'Personal Task') {
        themeClass = 'theme-personal-blue';
        iconType = 'user';
      }

      newEvents = [
        {
          id: `ev-${Date.now()}`,
          title: `${formData.title} #${Math.floor(290 + Math.random() * 50)}`,
          resourceId: formData.resourceId,
          resourceName: formData.resourceName,
          resourceAvatar: formData.resourceAvatar || '/img/client1.jpg',
          start: startDate,
          end: endDate,
          badgeText: formData.category || 'Maintenance Request',
          themeClass,
          iconType,
          unitInfo: formData.unitInfo || {
            unitNumber: 'Unit 56',
            address: '225 Cherry Street #24 Brooklyn, NY',
            image: '/img/client1.jpg',
          },
        },
      ];
    }

    setEventsList((prev) => [...prev, ...newEvents]);
    setShowAddModal(false);
    setEditingEvent(null);
  };

  return (
    <div className="calendar active tab_content position-relative w-100 p-3">
      {/* Toast Conflict Alert Notification */}
      {conflictToast && (
        <div
          className="position-fixed top-4 end-4 bg-warning text-dark p-3 rounded-3 shadow-2xl border border-warning border-opacity-50 d-flex align-items-center gap-3"
          style={{ zIndex: 999999, maxWidth: '440px', animation: 'fadeIn 0.2s ease-out' }}
        >
          <AlertCircle size={22} className="text-warning-emphasis flex-shrink-0" />
          <div style={{ fontSize: '13px', lineHeight: 1.35 }}>
            <strong className="d-block mb-0.5 text-warning-emphasis">⚠️ Schedule Conflict Warning</strong>
            <span>
              <strong>{conflictToast.resourceName}</strong> already has a task allocated (
              <em>"{conflictToast.conflictTitle}"</em>) for this time slot (
              <strong>{conflictToast.timeRange}</strong>). Please try another open time slot.
            </span>
          </div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setConflictToast(null)}
          />
        </div>
      )}

      <div className="pm-calendar-container">
        {/* Top Header & Navigation Toolbar */}
        <CalendarHeader
          selectedDate={selectedDate}
          onNavigate={handleNavigate}
          activeView={activeView}
          onViewChange={handleViewChange}
          onAddWorkOrder={() => {
            setSelectedResourceForAdd(null);
            setSelectedSlotForAdd(null);
            setEditingEvent(null);
            setShowAddModal(true);
          }}
          onOpenMemberModal={() => setShowMemberModal(true)}
          selectedCount={visibleResources.length}
          maxLimit={MAX_VISIBLE_RESOURCES}
        />

        {/* View Component Render with Smooth Sliding Window Transition */}
        <div key={activeView} className={`pm-cal-view-slide-container slide-${slideDirection}`}>
          {activeView === 'DAY' && (
            <CalendarDayView
              selectedDate={selectedDate}
              resources={visibleResources}
              events={filteredEvents}
              onSelectEvent={handleSelectEvent}
              onSlotClick={(res, slot) => {
                setSelectedResourceForAdd(res);
                setSelectedSlotForAdd(slot);
                setEditingEvent(null);
                setShowAddModal(true);
              }}
              onMenuAction={handleMenuAction}
              onEventDrop={handleEventDrop}
              onReorderResources={handleReorderResources}
              onAddForResource={(res) => {
                setSelectedResourceForAdd(res);
                setSelectedSlotForAdd(null);
                setEditingEvent(null);
                setShowAddModal(true);
              }}
              onRemoveResource={handleRemoveResource}
              onOpenMemberModal={() => setShowMemberModal(true)}
              maxLimit={MAX_VISIBLE_RESOURCES}
            />
          )}

          {activeView === 'WEEK' && (
            <CalendarWeekView
              selectedDate={selectedDate}
              events={filteredEvents}
              onSelectEvent={handleSelectEvent}
              onMenuAction={handleMenuAction}
              onEventDrop={handleEventDrop}
              onSlotClick={(res, slot, day) => {
                setSelectedDate(day);
                setSelectedSlotForAdd(slot);
                setEditingEvent(null);
                setShowAddModal(true);
              }}
            />
          )}

          {activeView === 'MONTH' && (
            <CalendarMonthView
              selectedDate={selectedDate}
              events={filteredEvents}
              onSelectEvent={handleSelectEvent}
            />
          )}
        </div>
      </div>

      {/* Right Side Event Detail Drawer */}
      {selectedEvent && (
        <CalendarEventDrawer
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={(ev) => handleMenuAction('EDIT', ev)}
          onDelete={(ev) => handleMenuAction('DELETE', ev)}
        />
      )}

      {/* Member Selection Modal (Max 5-6 users) */}
      <CalendarMemberSelectorModal
        show={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        allResources={resourcesList}
        selectedResourceIds={selectedResourceIds}
        onToggleResource={handleToggleResource}
        onAddNewMember={handleAddNewMember}
        maxLimit={MAX_VISIBLE_RESOURCES}
      />

      {/* Work Order / Task Creation Modal */}
      {showAddModal && (
        <CalendarAddWorkOrderModal
          resources={visibleResources}
          events={eventsList}
          initialResource={selectedResourceForAdd}
          initialTimeSlot={selectedSlotForAdd}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
          onClose={() => {
            setShowAddModal(false);
            setEditingEvent(null);
          }}
          onSubmit={handleCreateWorkOrder}
        />
      )}
    </div>
  );
};
