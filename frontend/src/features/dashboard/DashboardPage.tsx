import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Filter,
  PieChart,
  TrendingUp,
  UserCheck,
  Wallet,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEAD_PROFILES_DIRECTORY } from '../../data/initialData';
import { apiClient } from '../../lib/axios';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

const AnimatedCounter = ({ target, duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(target) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    const frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [target, duration]);

  return <>{count}</>;
};

const AdvancedDonutChart = ({ completedCount, onTrackCount, plannedCount, atRiskCount, totalProjectsCount }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const total = totalProjectsCount || 1;
  const segments = [
    { id: 'completed', label: 'Completed', count: completedCount, color: '#10B981', gradId: 'grad-completed', bg: '#F0FDF4', border: '#DCFCE7' },
    { id: 'onTrack', label: 'On Task', count: onTrackCount, color: '#2563EB', gradId: 'grad-onTrack', bg: '#EFF6FF', border: '#DBEAFE' },
    { id: 'planned', label: 'Planned', count: plannedCount, color: '#FF5454', gradId: 'grad-planned', bg: '#FEF2F2', border: '#FEE2E2' },
    { id: 'atRisk', label: 'At Risk', count: atRiskCount, color: '#F59E0B', gradId: 'grad-atRisk', bg: '#FFFBEB', border: '#FEF3C7' },
  ];

  const CIRCUMFERENCE = 427.25;
  const activeSegments = segments.filter((s) => s.count > 0);
  const totalGaps = activeSegments.length > 1 ? activeSegments.length * 8 : 0;
  const availableLength = CIRCUMFERENCE - totalGaps;

  let cumulativeOffset = 0;
  const arcSegments = segments.map((seg) => {
    const pct = seg.count / total;
    const arcLen = seg.count > 0 ? pct * availableLength : 0;
    const offset = cumulativeOffset;
    if (seg.count > 0) {
      cumulativeOffset += arcLen + 8;
    }
    return {
      ...seg,
      pct: Math.round(pct * 100),
      arcLen,
      dasharray: `${arcLen} ${CIRCUMFERENCE - arcLen}`,
      dashoffset: -offset,
    };
  });

  const activeInfo = hoveredSegment
    ? arcSegments.find((s) => s.id === hoveredSegment)
    : { label: 'Projects', count: totalProjectsCount, pct: 100, color: '#171E48' };

  return (
    <div className="row align-items-center g-3 my-auto w-100 m-0 pe-2">
      {/* Donut Chart Ring */}
      <div className="col-5 text-center position-relative">
        <div className="position-relative d-inline-block" style={{ width: '160px', height: '160px' }}>
          <svg width="160" height="160" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            <defs>
              <linearGradient id="grad-completed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="grad-onTrack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="grad-planned" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="grad-atRisk" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Background Track Circle */}
            <circle cx="90" cy="90" r="68" fill="none" stroke="#F1F5F9" strokeWidth="20" />

            {/* Segment Arc Slices */}
            {arcSegments.map((seg) => {
              if (seg.count === 0) return null;
              const isHovered = hoveredSegment === seg.id;
              const isDimmed = hoveredSegment && hoveredSegment !== seg.id;
              return (
                <circle
                  key={seg.id}
                  cx="90"
                  cy="90"
                  r="68"
                  fill="none"
                  stroke={`url(#${seg.gradId})`}
                  strokeWidth={isHovered ? 26 : 20}
                  strokeLinecap="round"
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.dashoffset}
                  filter={isHovered ? 'url(#donut-glow)' : undefined}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isDimmed ? 0.35 : 1,
                    transformOrigin: '90px 90px',
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredSegment(seg.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
          </svg>

          {/* Dynamic Donut Hole Content */}
          <div
            className="position-absolute top-50 start-50 translate-middle text-center pointer-events-none d-flex flex-column align-items-center justify-content-center"
            style={{ width: '92px', height: '92px', borderRadius: '50%', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <h4 className="fw-bold m-0 lh-1" style={{ fontSize: '24px', color: activeInfo.color, transition: 'color 0.2s ease' }}>
              <AnimatedCounter target={activeInfo.count} />
            </h4>
            <span className="text-muted d-block mt-1 fw-bold" style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {activeInfo.label}
            </span>
            {hoveredSegment && (
              <span className="badge rounded-pill mt-1" style={{ backgroundColor: activeInfo.color, color: '#ffffff', fontSize: '9px', padding: '2px 6px' }}>
                {activeInfo.pct}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Interactive Status Cards */}
      <div className="col-7">
        <div className="d-flex flex-column gap-2">
          {arcSegments.map((seg) => {
            const isHovered = hoveredSegment === seg.id;
            return (
              <div
                key={seg.id}
                className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3"
                style={{
                  backgroundColor: seg.bg,
                  border: `1px solid ${isHovered ? seg.color : seg.border}`,
                  boxShadow: isHovered ? `0 4px 12px ${seg.color}25` : 'none',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle d-inline-block" style={{ width: '9px', height: '9px', backgroundColor: seg.color }}></span>
                  <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{seg.label}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge rounded-pill fw-bold" style={{ backgroundColor: seg.color, color: '#FFFFFF', fontSize: '11px' }}>
                    {seg.pct}%
                  </span>
                  <span className="fw-bold text-secondary font-monospace" style={{ fontSize: '12px' }}>
                    {seg.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { tasks } = useWorkspaceStore();
  const [ownerSearch, setOwnerSearch] = useState('');
  const [showSearchCard, setShowSearchCard] = useState(false);

  // Modals state for "More +" and "See more +" with smooth open/close animations
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [isBudgetClosing, setIsBudgetClosing] = useState(false);

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [isMilestoneClosing, setIsMilestoneClosing] = useState(false);

  const [milestoneFilter, setMilestoneFilter] = useState('ALL');

  const closeBudgetModal = () => {
    setIsBudgetClosing(true);
    setTimeout(() => {
      setShowBudgetModal(false);
      setIsBudgetClosing(false);
    }, 220);
  };

  const closeMilestoneModal = () => {
    setIsMilestoneClosing(true);
    setTimeout(() => {
      setShowMilestoneModal(false);
      setIsMilestoneClosing(false);
    }, 220);
  };

  const { data: metricsRes } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => await apiClient.get('/dashboard/metrics'),
  });

  const owners = LEAD_PROFILES_DIRECTORY.map((l) => l.name);

  const totalProjectsCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed' || t.status === 'Approved' || t.progress === 100).length;
  const onTrackCount = tasks.filter((t) => t.status === 'On Track' || t.status === 'Active' || t.status === 'In Progress').length;
  const atRiskCount = tasks.filter((t) => t.status === 'At Risk' || t.status === 'Stuck').length;
  const plannedCount = tasks.filter((t) => t.status === 'Planned' || t.status === 'Ready to begin' || t.status === 'On Hold').length;

  const budgetProjects = tasks.map((t) => ({
    name: t.title,
    planned: t.plannedBudget || '100,000 AED',
    actual: t.actualBudget || '80,000 AED',
    spent: t.actualBudget || '80,000 AED',
    pPct: t.progress || 50,
    aPct: Math.min(100, (t.progress || 50) + 15),
    sPct: Math.min(100, t.progress || 50),
    status: t.status === 'At Risk' ? 'OVER_BUDGET' : 'ON_BUDGET',
  }));

  const milestonesData = tasks.flatMap((t) => {
    if (!t.milestones || !Array.isArray(t.milestones)) return [];
    return t.milestones.map((m, idx) => ({
      id: m.id || `${t._id}-m-${idx}`,
      name: m.title,
      project: t.title,
      status: m.status === 'Completed' || m.status === 'Approved' ? 'COMPLETED' : m.status === 'At Risk' ? 'AT_RISK' : 'IN_PROGRESS',
      progress: m.percentageDone !== undefined ? m.percentageDone : 60,
      targetDate: m.dueDate || m.date || '30 Nov 2026',
      owner: m.owner || t.owner || 'Claire Bure',
    }));
  });

  const filteredOwners = owners.filter((o) =>
    o.toLowerCase().includes(ownerSearch.toLowerCase())
  );

  const handleSelectOwner = (owner) => {
    setOwnerSearch(owner);
    setShowSearchCard(false);
    navigate('/owner-dashboard');
  };

  const filteredMilestonesModalList = milestonesData.filter((m) => {
    if (milestoneFilter === 'ALL') return true;
    return m.status === milestoneFilter;
  });

  return (
    <div
      className="div-dashboard w-100 min-vh-100"
      style={{
        backgroundColor: '#F4F6FA',
        padding: '1rem 2rem 2rem 2rem',
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <style>{`
        @keyframes modalBackdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalBackdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalCardPopIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes modalCardPopOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.94) translateY(8px);
          }
        }
        .animated-modal-backdrop {
          animation: modalBackdropFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animated-modal-backdrop.closing {
          animation: modalBackdropFadeOut 0.22s ease-in forwards;
        }
        .animated-modal-card {
          animation: modalCardPopIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animated-modal-card.closing {
          animation: modalCardPopOut 0.22s ease-in forwards;
        }
      `}</style>

      {/* Top Title & Search Header Row */}
      <div className="row top_row align-items-center g-3" style={{ margin: '0.5rem 0 5rem' }}>
        <div className="col-md-6 col-6">
          <div className="div-title">
            <h4 className="fw-semibold text-muted mb-1" style={{ fontSize: '14px' }}>Over View</h4>
            <h1 className="fw-bold m-0" style={{ color: '#171E48', fontSize: '32px' }}>Dashboard</h1>
          </div>
        </div>
        <div className="col-md-6 col-6 justify-content-end pe-4">
          <div className="searchdiv position-relative ms-auto" style={{ maxWidth: '320px' }}>
            <div className="searchhover position-relative">
              <div className="position-relative searchbox">
                <img src="/icons/search-1.svg" className="img-search" alt="Search" />
                <input
                  type="text"
                  className="form-control fw-bold"
                  placeholder="Search by project owner"
                  value={ownerSearch}
                  onFocus={() => setShowSearchCard(true)}
                  onBlur={() => setTimeout(() => setShowSearchCard(false), 200)}
                  onChange={(e) => {
                    setOwnerSearch(e.target.value);
                    setShowSearchCard(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredOwners.length > 0) {
                      handleSelectOwner(filteredOwners[0]);
                    }
                  }}
                />
                <div className="pipe m-none"></div>
                <img
                  src="/icons/chevdownblue.png"
                  className="img-last m-none"
                  alt="Dropdown"
                  onClick={() => setShowSearchCard(!showSearchCard)}
                />
              </div>

              {showSearchCard && (
                <div className="card shadow-lg border-0 position-absolute bg-white rounded-3 mt-1" style={{ zIndex: 1050, top: '45px', right: 0, width: '100%', borderRadius: '8px', overflow: 'hidden', display: 'block', visibility: 'visible' }}>
                  <div className="owner px-3 py-2 fw-bold text-muted small border-bottom">Project Owners</div>
                  <ul className="search-list p-0 m-0 list-unstyled" style={{ maxHeight: '230px', overflowY: 'auto' }}>
                    {filteredOwners.length > 0 ? (
                      filteredOwners.map((owner, idx) => (
                        <li key={idx} className="border-bottom" onMouseDown={() => handleSelectOwner(owner)}>
                          <a href="#owner" className="d-flex align-items-center text-dark text-decoration-none px-3 py-2 hover-bg-light small" onClick={(e) => e.preventDefault()}>
                            <img
                              src={`/img/client${(idx % 3) + 1}.jpg`}
                              className="rounded-circle me-3"
                              width="27"
                              height="27"
                              style={{ objectFit: 'cover' }}
                              alt="Owner"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                            />
                            <span className="fw-bold text-secondary">{owner}</span>
                          </a>
                        </li>
                      ))
                    ) : (
                      <li className="p-3 text-muted small">No project owner found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Top 4 KPI Summary Cards */}
      <div className="div-card" style={{ overflow: 'visible', marginBottom: '2rem' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between" style={{ gap: '2rem' }}>
          <div className="card border-0 rounded-3 p-4 bg-white position-relative shadow-sm" style={{ width: '18.3vw', flex: '0 0 18.3vw', minHeight: '120px', borderRadius: '12px', overflow: 'visible' }}>
            <div className="card-text p-0">
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={totalProjectsCount} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Total Projects</p>
              <span className="fw-bold text-success" style={{ fontSize: '13px', color: '#1FC875' }}>Active</span>
            </div>
            <div className="img-total position-absolute" style={{ right: '-12px', top: '-22px', width: '125px', zIndex: 10, pointerEvents: 'none' }}>
              <img src="/icons/total-project.svg" className="img-fluid" alt="Total Projects" style={{ overflow: 'visible', maxWidth: 'none' }} />
            </div>
          </div>

          <div className="card border-0 rounded-3 p-4 bg-white position-relative shadow-sm" style={{ width: '18.3vw', flex: '0 0 18.3vw', minHeight: '120px', borderRadius: '12px', overflow: 'visible' }}>
            <div className="card-text p-0">
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={completedCount} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Completed Projects</p>
              <span className="fw-bold text-success" style={{ fontSize: '13px', color: '#1FC875' }}>{Math.round((completedCount / (totalProjectsCount || 1)) * 100)}%</span>
            </div>
            <div className="img-total position-absolute" style={{ right: '-12px', top: '-22px', width: '125px', zIndex: 10, pointerEvents: 'none' }}>
              <img src="/icons/current-project.svg" className="img-fluid" alt="Completed Projects" style={{ overflow: 'visible', maxWidth: 'none' }} />
            </div>
          </div>

          <div className="card border-0 rounded-3 p-4 bg-white position-relative shadow-sm" style={{ width: '18.3vw', flex: '0 0 18.3vw', minHeight: '120px', borderRadius: '12px', overflow: 'visible' }}>
            <div className="card-text p-0">
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={onTrackCount} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>On Track / Active</p>
              <span className="fw-bold text-primary" style={{ fontSize: '13px', color: '#2563eb' }}>{Math.round((onTrackCount / (totalProjectsCount || 1)) * 100)}%</span>
            </div>
            <div className="img-total position-absolute" style={{ right: '-12px', top: '-22px', width: '125px', zIndex: 10, pointerEvents: 'none' }}>
              <img src="/icons/completed-project.svg" className="img-fluid" alt="Pending Projects" style={{ overflow: 'visible', maxWidth: 'none' }} />
            </div>
          </div>

          <div className="card border-0 rounded-3 p-4 bg-white position-relative shadow-sm" style={{ width: '18.3vw', flex: '0 0 18.3vw', minHeight: '120px', borderRadius: '12px', overflow: 'visible' }}>
            <div className="card-text p-0">
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={atRiskCount} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>At Risk Projects</p>
              <span className="fw-bold text-danger" style={{ fontSize: '13px', color: '#FF5454' }}>{Math.round((atRiskCount / (totalProjectsCount || 1)) * 100)}%</span>
            </div>
            <div className="img-total position-absolute" style={{ right: '-12px', top: '-22px', width: '125px', zIndex: 10, pointerEvents: 'none' }}>
              <img src="/icons/aproval.svg" className="img-fluid" alt="Approved Projects" style={{ overflow: 'visible', maxWidth: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts Section */}
      <div className="row g-4 mb-4">
        {/* Left Card: Projects Overview */}
        <div className="col-md-5">
          <div className="card1 bg-white p-4 rounded-3 border-0 h-100 shadow-sm d-flex flex-column justify-content-between" style={{ borderRadius: '12px', minHeight: '340px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold text-dark m-0" style={{ fontSize: '18px' }}>Projects Overview</h3>
              <span className="badge bg-light text-secondary rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '12px', border: '1px solid #E2E8F0' }}>{totalProjectsCount} Total</span>
            </div>

            <AdvancedDonutChart
              completedCount={completedCount}
              onTrackCount={onTrackCount}
              plannedCount={plannedCount}
              atRiskCount={atRiskCount}
              totalProjectsCount={totalProjectsCount}
            />
          </div>
        </div>

        {/* Right Card: Budget Insight */}
        <div className="col-md-7 budgetSection">
          <div className="card1 bg-white p-4 rounded-3 border-0 h-100 position-relative shadow-sm" style={{ borderRadius: '12px', minHeight: '340px', overflow: 'hidden' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h3 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>Budget Insight</h3>
                <div className="d-flex align-items-center gap-3">
                  <span className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                    <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', backgroundColor: '#B899FB' }}></span> Planned Budget
                  </span>
                  <span className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                    <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', backgroundColor: '#00C9B8' }}></span> Actual Budget
                  </span>
                  <span className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                    <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', backgroundColor: '#14A3D9' }}></span> Total Spent Amount
                  </span>
                </div>
              </div>

              {/* 3 Header Stat Cards */}
              <div className="d-flex budget-insight1">
                <div className="text-center me-2">
                  <p className="fs-6 fw-bolder mt-0 mb-0">$104,43,00</p>
                  <h6 className="m-0 text-muted" style={{ fontSize: '10px' }}>Total</h6>
                </div>
                <div className="text-center border2 me-2">
                  <p className="fs-6 fw-bolder mt-0 mb-0">$104,43,00</p>
                  <h6 className="m-0 text-muted" style={{ fontSize: '10px' }}>Total</h6>
                </div>
                <div className="text-center border3">
                  <p className="fs-6 fw-bolder mt-0 mb-0">$104,43,00</p>
                  <h6 className="m-0 text-muted" style={{ fontSize: '10px' }}>Total</h6>
                </div>
              </div>
            </div>

            {/* Multi-Bar Chart */}
            <div id="bar-chart" className="mt-3">
              <div className="graph" style={{ position: 'relative' }}>
                <ul className="y-axis p-0 m-0">
                  <li><span>$100</span></li>
                  <li><span>$80</span></li>
                  <li><span>$60</span></li>
                  <li><span>$40</span></li>
                  <li><span>$20</span></li>
                  <li><span>$0</span></li>
                </ul>
                <div className="bars">
                  {budgetProjects.map((p, idx) => (
                    <div key={idx} className="bar-group">
                      <div className="bar bar-1 stat-1" style={{ height: `${p.pPct}%` }}><span>{p.planned}</span></div>
                      <div className="bar bar-2 stat-2" style={{ height: `${p.aPct}%` }}><span>{p.actual}</span></div>
                      <div className="bar bar-3 stat-3" style={{ height: `${p.sPct}%` }}><span>{p.spent}</span></div>
                      <div className="bartooltip">
                        <p className="fw-bold">{p.name}</p>
                        <div className="grid">
                          <div className="grid1"><span className="bc1"></span></div>
                          <div className="grid2"><p>Total Spent <br /> {p.spent}</p></div>
                        </div>
                        <div className="grid">
                          <div className="grid1"><span className="bc2"></span></div>
                          <div className="grid2"><p>Actual Budget <br /> {p.actual}</p></div>
                        </div>
                        <div className="grid">
                          <div className="grid1"><span className="bc3"></span></div>
                          <div className="grid2"><p>Planned Budget <br /> {p.planned}</p></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* More + Popup Action Trigger */}
            <div className="position-absolute" style={{ bottom: '15px', right: '20px' }}>
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 border-0"
                onClick={() => {
                  setIsBudgetClosing(false);
                  setShowBudgetModal(true);
                }}
              >
                <span className="fw-bold text-primary" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  More +
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Project, Pending Approvals, Milestone */}
      <div className="row g-4 mb-4">
        {/* Card 1: Recent Project */}
        <div className="col-md-4">
          <div className="card1 recent-task bg-white p-4 rounded-3 border-0 h-100 shadow-sm d-flex flex-column justify-content-between" style={{ borderRadius: '12px', minHeight: '440px' }}>
            <div>
              <h3 className="fw-bold text-dark mb-3" style={{ fontSize: '18px', marginBottom: '1.25rem' }}>Recent Project</h3>
              <div className="table-responsive" style={{ overflow: 'visible' }}>
                <table className="table align-middle m-0">
                  <thead>
                    <tr>
                      <th className="fw-bold text-dark" style={{ fontSize: '14px' }}>Product Name</th>
                      <th className="fw-bold text-dark" style={{ fontSize: '14px' }}>Date</th>
                      <th className="fw-bold text-dark" style={{ fontSize: '14px' }}>Members</th>
                      <th className="fw-bold text-dark" style={{ fontSize: '14px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Project 01', date: '22/11/2021', status: '50%', tooltip: 'On Track', tooltipClass: 'ontrack' },
                      { name: 'Project 02', date: '22/11/2021', status: '70%', tooltip: 'At Risk', tooltipClass: 'atrisk' },
                      { name: 'Project 03', date: '22/11/2021', status: '20%', tooltip: 'On Track', tooltipClass: 'ontrack' },
                      { name: 'Project 04', date: '22/11/2021', status: '20%', tooltip: 'At Risk', tooltipClass: 'atrisk' },
                      { name: 'Project 05', date: '22/11/2021', status: '20%', tooltip: 'Approved', tooltipClass: 'approved' },
                      { name: 'Project 06', date: '22/11/2021', status: '20%', tooltip: 'Planned', tooltipClass: 'planned' },
                      { name: 'Project 07', date: '22/11/2021', status: '20%', tooltip: 'On Hold', tooltipClass: 'onholdstatus' },
                    ].map((p, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold text-secondary" style={{ fontSize: '13px' }}>{p.name}</td>
                        <td className="text-muted small" style={{ fontSize: '12px' }}>{p.date}</td>
                        <td>
                          <img src="/icons/avatar1.svg" width="17" alt="avatar" />
                          <img src="/icons/aprrover1.svg" width="17" alt="approver" />
                          <span className="dot1"><p>+2</p></span>
                        </td>
                        <td style={{ position: 'relative' }}>
                          <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: p.status }}></div>
                          </div>
                          <a className="fw-bold text-dark" style={{ fontSize: '12px' }}>{p.status}</a>

                          {/* Status Bar Hover Tooltip */}
                          <div className="statusTooltip">
                            <div className={p.tooltipClass}>
                              <p>{p.tooltip}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Approvals */}
        <div className="col-md-4">
          <div className="card1 pending-task bg-white p-4 rounded-3 border-0 h-100 shadow-sm d-flex flex-column justify-content-between" style={{ borderRadius: '12px', minHeight: '440px' }}>
            <div>
              <h3 className="fw-bold text-dark mb-3" style={{ fontSize: '18px', marginBottom: '1.25rem' }}>
                Pending Approvals <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 ms-1" style={{ fontSize: '12px' }}>9</span>
              </h3>
              <div className="table-responsive" style={{ overflow: 'visible' }}>
                <table className="table align-middle m-0">
                  <thead>
                    <tr>
                      <th className="fw-bold text-dark" style={{ fontSize: '14px' }}>Project Name</th>
                      <th className="fw-bold text-dark" style={{ fontSize: '14px' }}>Status</th>
                      <th className="fw-bold text-dark" style={{ fontSize: '14px' }}>Submitted on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Project 01', extra: null, date: '22/11/2021' },
                      { name: 'Project 01', extra: 'New', date: '22/11/2021' },
                      { name: 'Project 01', extra: 'Deligate', date: '22/11/2021' },
                      { name: 'Project 01', extra: null, date: '22/11/2021' },
                      { name: 'Project 01', extra: null, date: '22/11/2021' },
                      { name: 'Project 01', extra: null, date: '22/11/2021' },
                      { name: 'Project 01', extra: null, date: '22/11/2021' },
                    ].map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="fw-bold text-primary cursor-pointer" style={{ fontSize: '13px' }} onClick={() => navigate('/projects/approval-preview')}>
                            {item.name} <img src="/icons/right_aero.svg" className="mb-1 ms-1" alt="" />
                          </span>
                          {item.extra && <span className="fs-6 text-primary ms-1"> {item.extra}</span>}
                        </td>
                        <td><div className="text-muted small" style={{ fontSize: '12px' }}>In Review</div></td>
                        <td className="text-muted small" style={{ fontSize: '12px' }}>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Milestone Card */}
        <div className="col-md-4 milestone">
          <div className="card1 milestone1 bg-white p-4 rounded-3 border-0 h-100 d-flex flex-column justify-content-between shadow-sm" style={{ borderRadius: '12px', minHeight: '440px' }}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark m-0" style={{ fontSize: '18px' }}>Milestone</h3>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 fw-bold" style={{ fontSize: '12px' }}>11 Total</span>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 my-2">
                {/* Pill Legend List */}
                <ul className="list-unstyled p-0 m-0 d-flex flex-column flex-grow-1" style={{ gap: '12px' }}>
                  <li className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3" style={{ backgroundColor: '#F4F7FF' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: '#3B82F6' }}></span>
                      <span className="fw-bold text-secondary small">5 In progress</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3" style={{ backgroundColor: '#FFF5F5' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: '#FF5454' }}></span>
                      <span className="fw-bold text-secondary small">3 Completed</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3" style={{ backgroundColor: '#F0FCFA' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: '#00C9B8' }}></span>
                      <span className="fw-bold text-secondary small">3 At Risk</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: '#14244A' }}></span>
                      <span className="fw-bold text-dark small">11 Total Milestone</span>
                    </div>
                  </li>
                </ul>

                {/* Donut Ring Chart */}
                <div className="position-relative text-center flex-shrink-0" style={{ width: '150px', height: '150px' }}>
                  <svg width="150" height="150" viewBox="0 0 42 42" className="donut" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}>
                    <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                    <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="5.5"></circle>
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3B82F6" strokeWidth="5.5" strokeDasharray="45 55" strokeDashoffset="25"></circle>
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#FF5454" strokeWidth="5.5" strokeDasharray="27 73" strokeDashoffset="80"></circle>
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#00C9B8" strokeWidth="5.5" strokeDasharray="27 73" strokeDashoffset="53"></circle>
                  </svg>
                  <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ width: '90px' }}>
                    <h5 className="fw-bold m-0" style={{ fontSize: '22px', color: '#14244A' }}><AnimatedCounter target={11} /></h5>
                    <span className="text-muted small d-block" style={{ fontSize: '10px', fontWeight: 600 }}>Total Milestone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* See more + Popup Action Trigger */}
            <div className="text-end mt-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 border-0"
                onClick={() => {
                  setIsMilestoneClosing(false);
                  setShowMilestoneModal(true);
                }}
              >
                <span className="text-primary fw-bold small" style={{ cursor: 'pointer' }}>
                  See more +
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ULTRA-PREMIUM ANIMATED MODAL 1: BUDGET ANALYTICS          */}
      {/* ======================================================== */}
      {showBudgetModal && (
        <div
          className={`modal fade show d-block animated-modal-backdrop ${isBudgetClosing ? 'closing' : ''}`}
          tabIndex={-1}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeBudgetModal();
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxHeight: '90vh', margin: 'auto' }}>
            <div
              className={`modal-content border-0 rounded-4 shadow-2xl animated-modal-card ${isBudgetClosing ? 'closing' : ''}`}
              style={{
                backgroundColor: '#f8fafc',
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Luxury Header Banner */}
              <div
                className="p-4 text-white d-flex align-items-center justify-content-between position-relative flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #2563eb 100%)',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255, 255, 255, 0.25)' }}
                  >
                    <DollarSign size={28} className="text-white" />
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="fw-bold m-0 text-white" style={{ fontSize: '22px', letterSpacing: '-0.3px' }}>
                        Budget Insight & Financial Analytics
                      </h4>
                      <span className="badge rounded-pill text-white px-2 py-1 small fw-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                        Emaar Enterprise PMO
                      </span>
                    </div>
                    <p className="m-0 mt-1 small text-white-50" style={{ fontSize: '13px' }}>
                      Detailed financial breakdown, budget utilization, and planned vs. spent allocation
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-circle p-2 d-flex align-items-center justify-content-center text-dark border-0 shadow-sm"
                  style={{ width: '36px', height: '36px', opacity: 0.95 }}
                  onClick={closeBudgetModal}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 bg-light flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                {/* 4 Luxury KPI Stat Cards */}
                <div className="row g-3 mb-4">
                  {/* Card 1 */}
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="p-3 bg-white rounded-3 border shadow-xs transition-all hover-shadow" style={{ borderTop: '4px solid #3b82f6' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>PLANNED BUDGET</span>
                        <div className="p-1 rounded-circle bg-primary bg-opacity-10 text-primary">
                          <TrendingUp size={16} />
                        </div>
                      </div>
                      <h3 className="fw-bold m-0 text-dark" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>$1,044,300</h3>
                      <span className="text-muted small" style={{ fontSize: '11.5px' }}>Approved Baseline</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="p-3 bg-white rounded-3 border shadow-xs transition-all hover-shadow" style={{ borderTop: '4px solid #1e3a8a' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>ACTUAL ALLOCATION</span>
                        <div className="p-1 rounded-circle bg-info bg-opacity-10 text-info">
                          <Wallet size={16} />
                        </div>
                      </div>
                      <h3 className="fw-bold m-0 text-primary" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>$890,000</h3>
                      <span className="text-primary small fw-semibold" style={{ fontSize: '11.5px' }}>85.2% Committed</span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="p-3 bg-white rounded-3 border shadow-xs transition-all hover-shadow" style={{ borderTop: '4px solid #10b981' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>TOTAL SPENT AMOUNT</span>
                        <div className="p-1 rounded-circle bg-success bg-opacity-10 text-success">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                      <h3 className="fw-bold m-0 text-success" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>$580,000</h3>
                      <span className="text-success small fw-semibold" style={{ fontSize: '11.5px' }}>55.5% Executed</span>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="p-3 bg-white rounded-3 border shadow-xs transition-all hover-shadow" style={{ borderTop: '4px solid #06b6d4' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>REMAINING SURPLUS</span>
                        <div className="p-1 rounded-circle bg-cyan bg-opacity-10 text-cyan">
                          <PieChart size={16} />
                        </div>
                      </div>
                      <h3 className="fw-bold m-0 text-info" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>$310,000</h3>
                      <span className="text-info small fw-semibold" style={{ fontSize: '11.5px' }}>Available Balance</span>
                    </div>
                  </div>
                </div>

                {/* Financial Breakdown Table Container */}
                <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
                  <div className="p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="fw-bold m-0 text-dark" style={{ fontSize: '15px' }}>Category Financial Breakdown</h6>
                      <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-2 py-1 small">
                        6 Active Projects
                      </span>
                    </div>
                    <span className="text-muted small fw-semibold">Currency: USD ($)</span>
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle table-hover m-0">
                      <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr className="small text-muted border-bottom">
                          <th className="py-3 px-4 fw-bold">Project Category</th>
                          <th className="py-3 fw-bold">Planned Budget</th>
                          <th className="py-3 fw-bold">Actual Budget</th>
                          <th className="py-3 fw-bold">Spent Amount</th>
                          <th className="py-3 fw-bold text-center">Variance</th>
                          <th className="py-3 px-4 fw-bold" style={{ width: '220px' }}>Budget Utilization %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetProjects.map((item, idx) => (
                          <tr key={idx} className="border-bottom">
                            <td className="py-3 px-4">
                              <span className="fw-bold text-dark d-block" style={{ fontSize: '14px' }}>{item.name}</span>
                            </td>
                            <td className="py-3 fw-semibold text-secondary" style={{ fontSize: '13.5px' }}>{item.planned}</td>
                            <td className="py-3 fw-bold text-primary" style={{ fontSize: '13.5px' }}>{item.actual}</td>
                            <td className="py-3 fw-bold text-success" style={{ fontSize: '13.5px' }}>{item.spent}</td>
                            <td className="py-3 text-center">
                              <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-1 fw-semibold" style={{ fontSize: '11.5px' }}>
                                ✓ On Budget
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1" style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${item.pPct}%`,
                                      background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                                      borderRadius: '4px',
                                    }}
                                  ></div>
                                </div>
                                <span className="fw-bold text-dark small" style={{ fontSize: '12px', minWidth: '32px' }}>{item.pPct}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-white border-top p-3 px-4 d-flex justify-content-between align-items-center flex-shrink-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-3 py-2 rounded-2 fw-semibold d-inline-flex align-items-center gap-2"
                  onClick={() => alert('Exporting Financial Report (CSV)...')}
                  style={{ fontSize: '13px' }}
                >
                  <Download size={16} /> Export Financial CSV
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 rounded-2 fw-semibold shadow-sm"
                  onClick={closeBudgetModal}
                  style={{ fontSize: '13px', backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ULTRA-PREMIUM ANIMATED MODAL 2: MILESTONES OVERVIEW       */}
      {/* ========================================================= */}
      {showMilestoneModal && (
        <div
          className={`modal fade show d-block animated-modal-backdrop ${isMilestoneClosing ? 'closing' : ''}`}
          tabIndex={-1}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMilestoneModal();
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxHeight: '90vh', margin: 'auto' }}>
            <div
              className={`modal-content border-0 rounded-4 shadow-2xl animated-modal-card ${isMilestoneClosing ? 'closing' : ''}`}
              style={{
                backgroundColor: '#f8fafc',
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Luxury Header Banner */}
              <div
                className="p-4 text-white d-flex align-items-center justify-content-between position-relative flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #2563eb 100%)',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255, 255, 255, 0.25)' }}
                  >
                    <PieChart size={28} className="text-white" />
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="fw-bold m-0 text-white" style={{ fontSize: '22px', letterSpacing: '-0.3px' }}>
                        Milestones Analytics & Detailed Breakdown
                      </h4>
                      <span className="badge rounded-pill text-white px-2 py-1 small fw-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                        Delivery Health
                      </span>
                    </div>
                    <p className="m-0 mt-1 small text-white-50" style={{ fontSize: '13px' }}>
                      Track milestone schedules, target completion dates, and status health across Emaar portfolio
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-circle p-2 d-flex align-items-center justify-content-center text-dark border-0 shadow-sm"
                  style={{ width: '36px', height: '36px', opacity: 0.95 }}
                  onClick={closeMilestoneModal}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 bg-light flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                {/* Filter Tabs Toolbar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white p-3 rounded-3 border shadow-xs mb-4">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="text-muted fw-semibold small me-2 d-flex align-items-center gap-1">
                      <Filter size={14} /> Filter Status:
                    </span>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${milestoneFilter === 'ALL' ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary bg-white text-secondary border'}`}
                      style={{ fontSize: '12.5px' }}
                      onClick={() => setMilestoneFilter('ALL')}
                    >
                      All Milestones (11)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${milestoneFilter === 'IN_PROGRESS' ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary bg-white text-secondary border'}`}
                      style={{ fontSize: '12.5px' }}
                      onClick={() => setMilestoneFilter('IN_PROGRESS')}
                    >
                      In Progress (5)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${milestoneFilter === 'COMPLETED' ? 'btn-success text-white shadow-sm' : 'btn-outline-secondary bg-white text-secondary border'}`}
                      style={{ fontSize: '12.5px' }}
                      onClick={() => setMilestoneFilter('COMPLETED')}
                    >
                      Completed (3)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${milestoneFilter === 'AT_RISK' ? 'btn-warning text-dark shadow-sm' : 'btn-outline-secondary bg-white text-secondary border'}`}
                      style={{ fontSize: '12.5px' }}
                      onClick={() => setMilestoneFilter('AT_RISK')}
                    >
                      At Risk (3)
                    </button>
                  </div>
                </div>

                {/* Milestone Table */}
                <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover m-0">
                      <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr className="small text-muted border-bottom">
                          <th className="py-3 px-4 fw-bold">Milestone Name</th>
                          <th className="py-3 fw-bold">Project Name</th>
                          <th className="py-3 fw-bold">Lead Owner</th>
                          <th className="py-3 fw-bold">Target Date</th>
                          <th className="py-3 fw-bold">Status</th>
                          <th className="py-3 px-4 fw-bold" style={{ width: '180px' }}>Completion %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMilestonesModalList.map((m) => (
                          <tr key={m.id} className="border-bottom">
                            <td className="py-3 px-4">
                              <span className="fw-bold text-dark d-block" style={{ fontSize: '14px' }}>{m.name}</span>
                            </td>
                            <td className="py-3 fw-semibold text-primary" style={{ fontSize: '13.5px' }}>{m.project}</td>
                            <td className="py-3 text-muted small">
                              <span className="d-inline-flex align-items-center gap-1.5">
                                <UserCheck size={14} className="text-secondary" /> {m.owner}
                              </span>
                            </td>
                            <td className="py-3 text-muted small">
                              <span className="d-inline-flex align-items-center gap-1.5">
                                <Calendar size={14} /> {m.targetDate}
                              </span>
                            </td>
                            <td className="py-3">
                              {m.status === 'COMPLETED' && (
                                <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-1 fw-semibold" style={{ fontSize: '11.5px' }}>
                                  ✓ Completed
                                </span>
                              )}
                              {m.status === 'IN_PROGRESS' && (
                                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-1 fw-semibold" style={{ fontSize: '11.5px' }}>
                                  ⚡ In Progress
                                </span>
                              )}
                              {m.status === 'AT_RISK' && (
                                <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-1 fw-semibold" style={{ fontSize: '11.5px' }}>
                                  ⚠ At Risk
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1" style={{ height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                                  <div
                                    className={`progress-bar ${m.status === 'COMPLETED' ? 'bg-success' : m.status === 'AT_RISK' ? 'bg-warning' : 'bg-primary'}`}
                                    style={{ width: `${m.progress}%`, borderRadius: '4px' }}
                                  ></div>
                                </div>
                                <span className="fw-bold text-dark small" style={{ fontSize: '12px', minWidth: '32px' }}>{m.progress}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-white border-top p-3 px-4 d-flex justify-content-end flex-shrink-0">
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 rounded-2 fw-semibold shadow-sm"
                  onClick={closeMilestoneModal}
                  style={{ fontSize: '13px', backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
