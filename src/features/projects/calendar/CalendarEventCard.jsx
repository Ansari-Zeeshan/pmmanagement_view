import { Calendar, ChevronRight, ClipboardList, Clock, MoreHorizontal, User, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

export const CalendarEventCard = ({ event, onClick, onMenuAction }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState(null);

  const [isHovered, setIsHovered] = useState(false);
  const [hoverPos, setHoverPos] = useState(null);
  const cardRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (showMenu) {
        setShowMenu(false);
        setMenuPos(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [showMenu]);

  const getIcon = (type) => {
    switch (type) {
      case 'user': return <User size={13} className="flex-shrink-0" />;
      case 'clipboard': return <ClipboardList size={13} className="flex-shrink-0" />;
      default: return <Wrench size={13} className="flex-shrink-0" />;
    }
  };

  const style = {
    top: `${event.topPx}px`,
    height: `${event.heightPx}px`,
    width: `${event.widthPercent}%`,
    left: `${event.leftPercent}%`,
  };

  // Called when mouse enters the event card
  const handleMouseEnter = () => {
    if (showMenu) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Only compute position if not already hovered to prevent re-render loops
    if (!isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const popoverWidth = 340;
      const popoverHeight = 360;

      let left = rect.right + 14;
      if (left + popoverWidth > window.innerWidth - 14) {
        left = rect.left - popoverWidth - 14;
      }
      if (left < 14) {
        left = Math.max(14, Math.min(rect.left, window.innerWidth - popoverWidth - 14));
      }

      let top = rect.top;
      if (top + popoverHeight > window.innerHeight - 14) {
        top = Math.max(14, window.innerHeight - popoverHeight - 14);
      }
      if (top < 14) {
        top = 14;
      }

      setHoverPos({ top, left });
      setIsHovered(true);
    }
  };

  // Called when mouse enters the popover card: simply clear timeout without setting state
  const handlePopoverMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  // Called when mouse leaves card or popover card
  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setHoverPos(null);
    }, 150);
  };

  const handleThreeDotsClick = (e) => {
    e.stopPropagation();
    setIsHovered(false);
    if (showMenu) {
      setShowMenu(false);
      setMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        left: Math.max(10, rect.right - 140),
      });
      setShowMenu(true);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ eventId: event.id, originResourceId: event.resourceId }));
    e.dataTransfer.effectAllowed = 'move';
    setIsHovered(false);
  };

  const truncateTitle = (str, maxLength = 80) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  };

  const getCleanTitle = (rawTitle) => {
    if (!rawTitle) return 'Bathroom Remodeling';
    return rawTitle.replace(/#\d+$/, '').trim();
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`pm-cal-event-card ${event.themeClass}`}
        style={style}
        draggable={true}
        onDragStart={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          onClick(event);
        }}
      >
        <div className="d-flex align-items-start justify-content-between gap-1 w-100">
          <div className="d-flex align-items-center gap-1 min-w-0 flex-grow-1" style={{ overflow: 'hidden' }}>
            {getIcon(event.iconType)}
            <h6
              className="pm-cal-event-title-text"
              title={event.title}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {truncateTitle(event.title, 80)}
            </h6>
          </div>

          <button
            type="button"
            className="btn btn-link p-0 border-0 text-current opacity-70 hover-opacity-100 flex-shrink-0"
            onClick={handleThreeDotsClick}
            title="Options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>

        <p className="pm-cal-event-subtext mt-0.5">
          {formatTimeRange(event.start, event.end)} • {event.badgeText}
        </p>
      </div>

      {/* PORTAL ELEVATED 3-DOT DROPDOWN MENU */}
      {showMenu && menuPos && createPortal(
        <div
          className="position-fixed bg-white rounded-3 shadow-2xl border py-1"
          style={{
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            zIndex: 999999,
            width: '140px',
            color: '#1e293b',
            fontSize: '12.5px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22)',
            border: '1px solid #e2e8f0',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="dropdown-item px-3 py-1 fw-medium d-flex align-items-center gap-2"
            onClick={() => { setShowMenu(false); onClick(event); }}
          >
            View Details
          </button>
          <button
            className="dropdown-item px-3 py-1 text-primary fw-semibold d-flex align-items-center gap-2"
            onClick={() => { setShowMenu(false); onMenuAction && onMenuAction('EDIT', event); }}
          >
            Edit Task
          </button>
          <div className="dropdown-divider my-1"></div>
          <button
            className="dropdown-item px-3 py-1 text-danger fw-semibold d-flex align-items-center gap-2"
            onClick={() => { setShowMenu(false); onMenuAction && onMenuAction('DELETE', event); }}
          >
            Delete
          </button>
        </div>,
        document.body
      )}

      {/* PORTAL ELEVATED TASK INFO HOVER CARD (EXACT MATCH FOR SCREENSHOT media_1789400701748.png) */}
      {isHovered && hoverPos && !showMenu && createPortal(
        <div
          className="pm-cal-hover-popover-card"
          style={{
            top: `${hoverPos.top}px`,
            left: `${hoverPos.left}px`,
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top-Right Floating Circular Arrow Button */}
          <button
            type="button"
            className="pm-cal-floating-arrow-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsHovered(false);
              onClick(event);
            }}
            title="View Details"
          >
            <ChevronRight size={18} />
          </button>

          {/* Header Title & Three Dots */}
          <div className="d-flex align-items-start justify-content-between pe-4">
            <h5 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.2px', lineHeight: 1.25 }}>
              {getCleanTitle(event.title)}
            </h5>
            <button
              type="button"
              className="btn btn-link p-0 border-0 text-secondary opacity-70 hover-opacity-100"
              onClick={handleThreeDotsClick}
              title="More actions"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Category Pill Tag */}
          <div className="mt-2 mb-1">
            <span className="pm-cal-popover-badge">
              {event.badgeText === 'Maintenance Request' || !event.badgeText ? 'MAINTENANCE SERVICE' : event.badgeText.toUpperCase()}
            </span>
          </div>

          {/* UNIT INFORMATION */}
          <div className="pm-cal-section-label">UNIT INFORMATION</div>
          <div
            className="pm-cal-unit-row"
            onClick={() => {
              setIsHovered(false);
              onClick(event);
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <img
                src={event.unitInfo?.image || '/img/client1.jpg'}
                alt="Unit thumbnail"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  flexShrink: 0,
                }}
                onError={(e) => { e.target.src = '/img/client1.jpg'; }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '1px' }}>
                  {event.unitInfo?.unitNumber || 'Unit 56'}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', fontWeight: 400, lineHeight: 1.3 }}>
                  {event.unitInfo?.address || '225 Cherry Street #24 Brooklyn, NY'}
                </div>
              </div>
            </div>
            <ChevronRight size={15} style={{ color: '#64748b', flexShrink: 0 }} />
          </div>

          {/* Divider */}
          <hr style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '14px 0', border: 'none' }} />

          {/* Assignee Information */}
          <div className="pm-cal-section-label" style={{ marginTop: 0 }}>
            ASSIGNEE INFORMATION
          </div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <img
              src={event.resourceAvatar || '/img/client1.jpg'}
              alt="Assignee"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}
              onError={(e) => { e.target.src = '/img/client1.jpg'; }}
            />
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', alignSelf: 'center' }}>
              {event.resourceName || 'Nicholas Amazon'}
            </div>
          </div>

          {/* DATE & TIME */}
          <div className="pm-cal-section-label">DATE & TIME</div>
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-2">
              <div className="pm-cal-icon-square">
                <Calendar size={14} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>
                {formatFullDateString(event.start)}
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="pm-cal-icon-square">
                <Clock size={14} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>
                {formatTimeRange(event.start, event.end)}
              </div>
            </div>
          </div>

          {/* ACTIVE DAYS & DATE RANGE */}
          <div className="pm-cal-section-label">ACTIVE DAYS & DATE RANGE</div>
          <div className="d-flex flex-column gap-1 p-2 bg-light rounded-3 border" style={{ fontSize: '12px' }}>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted fw-medium">Active Days:</span>
              <span className="fw-bold text-dark">{formatActiveDays(event.activeDays)}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted fw-medium">Date Range:</span>
              <span className="fw-bold text-primary">{formatDateRangeDisplay(event)}</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
