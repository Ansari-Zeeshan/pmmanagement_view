import { ArrowRight, X, Check, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectDescriptionModal = ({ task, onClose }) => {
  const navigate = useNavigate();

  if (!task) return null;

  const handleNavigateToDetails = () => {
    onClose();
    navigate(`/projects/${task._id || 'task-1'}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Track': return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
      case 'At Risk': return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
      case 'Stuck': return { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' };
      case 'Approved': return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      case 'Done': return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' };
      case 'Planned': return { bg: '#fefce8', color: '#a16207', border: '#fef08a' };
      case 'On Hold': return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
      default: return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' };
      case 'High': return { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' };
      case 'Medium': return { bg: '#fefce8', color: '#ca8a04', border: '#fef08a' };
      case 'Low': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      default: return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
    }
  };

  const statusStyle = getStatusBadge(task.status);
  const priorityStyle = getPriorityBadge(task.priority || 'Medium');

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 100010, backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow-2xl p-0 overflow-hidden"
        style={{ width: '640px', maxWidth: '94vw', zIndex: 100015, border: '1px solid #e2e8f0', fontFamily: "'Heebo', sans-serif" }}
      >
        {/* Header */}
        <div
          className="p-4 position-relative text-white"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-3 p-2 border-0 shadow-sm"
            onClick={onClose}
            title="Close Modal"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} className="text-dark" />
          </button>

          <div className="pe-5">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-white bg-opacity-20 text-white border border-white border-opacity-25 px-2 py-1 rounded small font-monospace">
                PRJ-{task._id || '1024'}
              </span>
              <span className="text-white-50 small">• Submitted: {task.submittedDate || '31/07/2026'}</span>
            </div>
            <h4 className="fw-bold text-white m-0 fs-5">{task.title || 'Enterprise Portal Modernization'}</h4>
            <p className="text-white-50 small m-0 mt-1">
              Customer: <strong className="text-white">{task.customer || 'Emaar Properties PJSC'}</strong>
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 bg-white" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Key Metric Tags Row */}
          <div className="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-3 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small fw-semibold">Status:</span>
              <span
                className="badge px-2 py-1 rounded-pill small fw-bold"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
              >
                {task.status || 'On Track'}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small fw-semibold">Priority:</span>
              <span
                className="badge px-2 py-1 rounded-pill small fw-bold"
                style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.color, border: `1px solid ${priorityStyle.border}` }}
              >
                {task.priority || 'High'}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small fw-semibold">Total Value:</span>
              <span className="fw-bold text-dark fs-6">{task.actualBudget || task.plannedBudget || '100 AED'}</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3 bg-light border text-center">
                <div className="text-muted small fw-medium">Start Date</div>
                <div className="fw-bold text-dark mt-1" style={{ fontSize: '13px' }}>{task.startDate || '01 Aug 2026'}</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3 bg-light border text-center">
                <div className="text-muted small fw-medium">Due Date</div>
                <div className="fw-bold text-dark mt-1" style={{ fontSize: '13px' }}>{task.dueDate || '31 Aug 2026'}</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3 bg-light border text-center">
                <div className="text-muted small fw-medium">Duration</div>
                <div className="fw-bold text-dark mt-1" style={{ fontSize: '13px' }}>{task.totalDays || '30 Days'}</div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 rounded-3 bg-light border text-center">
                <div className="text-muted small fw-medium">% Complete</div>
                <div className="fw-bold text-primary mt-1" style={{ fontSize: '13px' }}>{task.progress ? `${task.progress}%` : '75%'}</div>
              </div>
            </div>
          </div>

          {/* Project Leads & Assignees */}
          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-2 fs-6">Project Leadership & Assignees</h6>
            <div className="d-flex flex-wrap align-items-center gap-3 p-3 rounded-3 bg-light border">
              <div className="d-flex align-items-center gap-2 pe-3 border-end">
                <img src="/img/client1.jpg" alt="" className="rounded-circle" style={{ width: '32px', height: '32px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/icons/avatar1.svg'; }} />
                <div>
                  <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600 }}>PROJECT LEAD</div>
                  <div className="fw-semibold text-dark small">{task.projectLead || 'John Doe'}</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 pe-3 border-end">
                <img src="/img/client2.jpg" alt="" className="rounded-circle" style={{ width: '32px', height: '32px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/icons/avatar2.svg'; }} />
                <div>
                  <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600 }}>DOMAIN LEAD</div>
                  <div className="fw-semibold text-dark small">{task.domainLead || 'Smith Johnson'}</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center ms-1">
                  {task.assignees?.map((a, i) => (
                    <img
                      key={i}
                      src={a.avatarUrl || '/img/client1.jpg'}
                      alt=""
                      className="rounded-circle border border-2 border-white shadow-sm"
                      style={{ width: '28px', height: '28px', objectFit: 'cover', marginLeft: i > 0 ? '-8px' : '0' }}
                      onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                    />
                  ))}
                </div>
                <div className="text-muted small font-monospace">({task.assignees?.length || 2} Team Members)</div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-2 fs-6">Detailed Project Scope & Description</h6>
            <div className="p-3 bg-light rounded-3 border text-secondary leading-relaxed" style={{ fontSize: '13.5px' }}>
              <p className="m-0 mb-2">
                {task.description ||
                  `This project encompasses the full enterprise digital transformation initiative for Emaar ${task.group || 'Research'} operational workflows. The scope includes front-end UI/UX modernizations, secure API integrations, automated status tracking, real-time workload synchronization, and executive reporting modules.`}
              </p>
              <p className="m-0">
                Key deliverables feature high-availability cloud architecture deployment, automated milestone tracking, SLA notifications, multi-currency budget allocation (including 100 AED standard unit accounting), and cross-domain stakeholder collaboration drawers.
              </p>
            </div>
          </div>

          {/* Key Objectives Section */}
          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-2.5 fs-6">Key Objectives & Scope</h6>
            <div className="d-flex flex-column gap-2 p-3 bg-light rounded-3 border">
              {[
                'Enhance project tracking visibility across Emaar business units.',
                'Streamline task handovers with real-time status transitions.',
                'Maintain strict SLA compliance and multi-currency (100 AED standard) budget governance.',
                'Deliver zero-downtime deployment for internal enterprise users.',
              ].map((obj, iIdx) => (
                <div key={iIdx} className="d-flex align-items-start gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                    style={{ width: '20px', height: '20px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb' }}
                  >
                    <CheckCircle2 size={12} strokeWidth={2.5} color="#2563eb" />
                  </div>
                  <span className="text-secondary" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Timeline Section */}
          <div className="mb-2">
            <h6 className="fw-bold text-dark mb-3 fs-6">Project Milestone Timeline</h6>
            <div className="position-relative py-1 px-1">
              {[
                { label: 'Project Submitted', date: task.submittedDate || '31/07/2026', done: true },
                { label: 'Project Kickoff & Scope Approval', date: task.startDate || '01/08/2026', done: true },
                { label: 'Phase 1: Architecture & Development', date: '15/08/2026', current: true },
                { label: 'Project Due Date', date: task.dueDate || task.endDate || '31/08/2026', done: false },
              ].map((item, idx, listArr) => {
                const isLast = idx === listArr.length - 1;
                return (
                  <div key={idx} className={`position-relative d-flex align-items-start gap-3 ${isLast ? 'mb-0' : 'mb-3'}`} style={{ zIndex: 2 }}>
                    {/* Vertical Line Segment connecting this node to next node (omitted on last node) */}
                    {!isLast && (
                      <div
                        className="position-absolute"
                        style={{
                          top: '14px',
                          bottom: '-16px',
                          left: '13px',
                          width: '3px',
                          backgroundColor: '#cbd5e1',
                          borderRadius: '2px',
                          zIndex: 1,
                        }}
                      />
                    )}

                    <div
                      className={`rounded-circle border border-2 border-white d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm ${
                        item.done
                          ? 'bg-success text-white'
                          : item.current
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-secondary text-white'
                      }`}
                      style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: item.done ? '#16a34a' : item.current ? '#2563eb' : '#64748b',
                        zIndex: 3,
                      }}
                    >
                      {item.done ? <Check size={14} strokeWidth={3} /> : <span style={{ fontSize: '11px', fontWeight: 700 }}>{idx + 1}</span>}
                    </div>

                    <div
                      className="flex-grow-1 p-2.5 rounded-3 border"
                      style={{
                        borderColor: item.current ? '#bfdbfe' : '#e2e8f0',
                        backgroundColor: item.current ? '#f8fafc' : '#f8fafc',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                        <span className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>{item.label}</span>
                        <span className="badge bg-white text-dark border font-monospace px-2 py-1 rounded-2" style={{ fontSize: '11.5px', fontWeight: 600 }}>
                          {item.date}
                        </span>
                      </div>
                      <span className="text-muted" style={{ fontSize: '12px' }}>
                        {item.done ? 'Completed successfully' : item.current ? 'Currently in progress' : 'Scheduled upcoming milestone'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-light border-top d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-3 fw-medium"
            onClick={onClose}
          >
            Close Preview
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm px-4 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
            style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
            onClick={handleNavigateToDetails}
          >
            <span>View Full Project Details</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectDescriptionModal;
