import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';

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

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [ownerSearch, setOwnerSearch] = useState('');
  const [showSearchCard, setShowSearchCard] = useState(false);

  const { data: metricsRes } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => await apiClient.get('/dashboard/metrics'),
  });

  const owners = [
    'Project Owner 01',
    'Project Owner 02',
    'Project Owner 03',
    'Project Owner 04',
    'Project Owner 05',
    'Project Owner 06',
  ];

  const budgetProjects = [
    { name: 'Major work permit', planned: '$85,000', actual: '$62,000', spent: '$41,000', pPct: 51, aPct: 100, sPct: 13 },
    { name: 'RDT - Fitout Process', planned: '$95,000', actual: '$80,000', spent: '$55,000', pPct: 65, aPct: 80, sPct: 25 },
    { name: 'Insurance', planned: '$60,000', actual: '$45,000', spent: '$30,000', pPct: 40, aPct: 60, sPct: 18 },
    { name: 'Trade License', planned: '$120,000', actual: '$105,000', spent: '$75,000', pPct: 75, aPct: 90, sPct: 30 },
    { name: 'Event proposal', planned: '$70,000', actual: '$50,000', spent: '$32,000', pPct: 40, aPct: 60, sPct: 18 },
    { name: 'Raise Ticket', planned: '$110,000', actual: '$90,000', spent: '$65,000', pPct: 75, aPct: 90, sPct: 30 },
  ];

  const filteredOwners = owners.filter((o) =>
    o.toLowerCase().includes(ownerSearch.toLowerCase())
  );

  const handleSelectOwner = (owner) => {
    setOwnerSearch(owner);
    setShowSearchCard(false);
    navigate('/owner-dashboard');
  };

  return (
    <div
      className="div-dashboard w-100 min-vh-100"
      style={{
        backgroundColor: '#F4F6FA',
        padding: '1rem 2rem 2rem 2rem',
        fontFamily: "'Lato', sans-serif",
      }}
    >
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
                              onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
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
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={50} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Total Projects</p>
              <span className="fw-bold text-success" style={{ fontSize: '13px', color: '#1FC875' }}>+10%</span>
            </div>
            <div className="img-total position-absolute" style={{ right: '-12px', top: '-22px', width: '125px', zIndex: 10, pointerEvents: 'none' }}>
              <img src="/icons/total-project.svg" className="img-fluid" alt="Total Projects" style={{ overflow: 'visible', maxWidth: 'none' }} />
            </div>
          </div>

          <div className="card border-0 rounded-3 p-4 bg-white position-relative shadow-sm" style={{ width: '18.3vw', flex: '0 0 18.3vw', minHeight: '120px', borderRadius: '12px', overflow: 'visible' }}>
            <div className="card-text p-0">
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={15} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Completed Projects</p>
              <span className="fw-bold text-danger spanred" style={{ fontSize: '13px', color: '#FF5454' }}>-12%</span>
            </div>
            <div className="img-total position-absolute" style={{ right: '-12px', top: '-22px', width: '125px', zIndex: 10, pointerEvents: 'none' }}>
              <img src="/icons/current-project.svg" className="img-fluid" alt="Completed Projects" style={{ overflow: 'visible', maxWidth: 'none' }} />
            </div>
          </div>

          <div className="card border-0 rounded-3 p-4 bg-white position-relative shadow-sm" style={{ width: '18.3vw', flex: '0 0 18.3vw', minHeight: '120px', borderRadius: '12px', overflow: 'visible' }}>
            <div className="card-text p-0">
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={30} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Pending Projects</p>
              <span className="fw-bold text-danger spanred" style={{ fontSize: '13px', color: '#FF5454' }}>-16%</span>
            </div>
            <div className="img-total position-absolute" style={{ right: '-12px', top: '-22px', width: '125px', zIndex: 10, pointerEvents: 'none' }}>
              <img src="/icons/completed-project.svg" className="img-fluid" alt="Pending Projects" style={{ overflow: 'visible', maxWidth: 'none' }} />
            </div>
          </div>

          <div className="card border-0 rounded-3 p-4 bg-white position-relative shadow-sm" style={{ width: '18.3vw', flex: '0 0 18.3vw', minHeight: '120px', borderRadius: '12px', overflow: 'visible' }}>
            <div className="card-text p-0">
              <h1 className="fw-bold m-0" style={{ fontSize: '3.2rem', color: '#171E48' }}><AnimatedCounter target={5} /></h1>
              <p className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Approved Projects</p>
              <span className="fw-bold text-success" style={{ fontSize: '13px', color: '#1FC875' }}>+5%</span>
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
              <span className="badge bg-light text-secondary rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '12px', border: '1px solid #E2E8F0' }}>50 Total</span>
            </div>

            <div className="row align-items-center g-3 my-auto">
              {/* Donut Chart Ring */}
              <div className="col-5 text-center position-relative">
                <div className="position-relative d-inline-block">
                  <svg width="150" height="150" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="90" cy="90" r="68" fill="none" stroke="#F1F5F9" strokeWidth="22" />

                    {/* Completed (60%) - Green */}
                    <circle cx="90" cy="90" r="68" fill="none" stroke="#1FC875" strokeWidth="22"
                            strokeDasharray="256 171" strokeDashoffset="0" />

                    {/* On Task (35%) - Blue */}
                    <circle cx="90" cy="90" r="68" fill="none" stroke="#2D62ED" strokeWidth="22"
                            strokeDasharray="149 278" strokeDashoffset="-256" />

                    {/* Planned (10%) - Red */}
                    <circle cx="90" cy="90" r="68" fill="none" stroke="#FF5454" strokeWidth="22"
                            strokeDasharray="43 384" strokeDashoffset="-405" />

                    {/* At Risk (5%) - Orange */}
                    <circle cx="90" cy="90" r="68" fill="none" stroke="#F6BE75" strokeWidth="22"
                            strokeDasharray="21 406" strokeDashoffset="-448" />
                  </svg>

                  {/* Center Donut Hole Text */}
                  <div className="position-absolute top-50 start-50 translate-middle text-center pointer-events-none" style={{ width: '90px' }}>
                    <h4 className="fw-bold text-dark m-0 lh-1" style={{ fontSize: '24px', color: '#171E48' }}><AnimatedCounter target={50} /></h4>
                    <span className="text-muted d-block mt-1 fw-semibold" style={{ fontSize: '11px' }}>Projects</span>
                  </div>
                </div>
              </div>

              {/* Status Pill Cards on Right */}
              <div className="col-7">
                <div className="d-flex flex-column gap-2">
                  {/* Completed Projects (60%) */}
                  <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '9px', height: '9px', backgroundColor: '#1FC875' }}></span>
                      <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>Completed</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#1FC875', color: '#FFFFFF', fontSize: '11px' }}>60%</span>
                      <span className="fw-bold text-secondary" style={{ fontSize: '12px' }}>30</span>
                    </div>
                  </div>

                  {/* Projects on Task (35%) */}
                  <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3" style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '9px', height: '9px', backgroundColor: '#2D62ED' }}></span>
                      <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>On Task</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#2D62ED', color: '#FFFFFF', fontSize: '11px' }}>35%</span>
                      <span className="fw-bold text-secondary" style={{ fontSize: '12px' }}>17</span>
                    </div>
                  </div>

                  {/* Planned Projects (10%) */}
                  <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '9px', height: '9px', backgroundColor: '#FF5454' }}></span>
                      <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>Planned</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#FF5454', color: '#FFFFFF', fontSize: '11px' }}>10%</span>
                      <span className="fw-bold text-secondary" style={{ fontSize: '12px' }}>5</span>
                    </div>
                  </div>

                  {/* Projects at Risk (5%) */}
                  <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: '9px', height: '9px', backgroundColor: '#F6BE75' }}></span>
                      <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>At Risk</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#F6BE75', color: '#FFFFFF', fontSize: '11px' }}>5%</span>
                      <span className="fw-bold text-secondary" style={{ fontSize: '12px' }}>2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Budget Insight */}
        <div className="col-md-7 budgetSection">
          <div className="card1 bg-white p-4 rounded-3 border-0 h-100 position-relative shadow-sm" style={{ borderRadius: '12px', minHeight: '340px' }}>
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

            {/* More + Button Positioned Cleanly at Bottom Right */}
            <div className="position-absolute" style={{ bottom: '15px', right: '20px' }}>
              <a href="#more" onClick={(e) => e.preventDefault()} className="text-decoration-none">
                <span className="fw-bold text-primary" style={{ fontSize: '14px' }}>More +</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Project, Pending Approvals, Premium Milestone */}
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

        {/* Card 3: Premium Milestone Card */}
        <div className="col-md-4 milestone">
          <div className="card1 milestone1 bg-white p-4 rounded-3 border-0 h-100 d-flex flex-column justify-content-between shadow-sm" style={{ borderRadius: '12px', minHeight: '440px' }}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark m-0" style={{ fontSize: '18px' }}>Milestone</h3>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 fw-bold" style={{ fontSize: '12px' }}>11 Total</span>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 my-2">
                {/* Premium Pill Legend List */}
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

                {/* Premium Donut Ring Chart */}
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

            <div className="text-end mt-3">
              <a href="#seemore" onClick={(e) => e.preventDefault()} className="text-primary fw-bold small text-decoration-none">See more +</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
