import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit3,
  FileText,
  Layers,
  MessageSquare,
  MoreVertical,
  Paperclip, Plus,
  Printer,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LeadProfileModal } from '../../components/common/LeadProfileModal';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

// Mock database of project items to find by ID, or generate fallback project
const MOCK_PROJECT_DATABASE = {
  'task-1': {
    _id: 'task-1',
    reference: 'PRJ-1024',
    title: 'Project 01 Enterprise Workspace Revamp',
    customer: 'Emaar Development PJSC',
    group: 'Research',
    startDate: '01 Aug 2026',
    dueDate: '31 Aug 2026',
    totalDays: '30 Days',
    submittedDate: '31/07/2026',
    actualBudget: '100 AED',
    plannedBudget: '100 AED',
    projectLead: 'John',
    domainLead: 'Smith',
    owner: 'Claire Bure',
    status: 'On Track',
    priority: 'High',
    progress: 75,
    description: 'Comprehensive enterprise project management portal modernization for Emaar real estate domain operations. Focuses on interactive Kanban workflows, Gantt timeline tracking, role-based governance controls, real-time activity feeds, multi-currency budget metrics, and optimized high-performance UI rendering.',
    assignees: [
      { _id: 'u1', name: 'Claire Bure', role: 'Project Lead', avatarUrl: '/img/client1.jpg' },
      { _id: 'u2', name: 'Ajmal Khan', role: 'UI Engineer', avatarUrl: '/img/client2.jpg' },
      { _id: 'u3', name: 'Smith Johnson', role: 'Domain Lead', avatarUrl: '/img/client3.jpg' },
    ],
    tasks: [
      { id: 'sub-1', title: 'Requirements gathering & stakeholder alignment', status: 'Completed', date: '05 Aug 2026', assignee: 'Claire Bure' },
      { id: 'sub-2', title: 'UI/UX Wireframing & Design System polish', status: 'Completed', date: '12 Aug 2026', assignee: 'Ajmal Khan' },
      { id: 'sub-3', title: 'Kanban drag and drop architecture implementation', status: 'In Progress', date: '20 Aug 2026', assignee: 'Claire Bure' },
      { id: 'sub-4', title: 'Gantt timeline filter component integration', status: 'In Progress', date: '25 Aug 2026', assignee: 'Smith Johnson' },
      { id: 'sub-5', title: 'Final QA, UAT testing and deployment sign-off', status: 'Pending', date: '31 Aug 2026', assignee: 'Ajmal Khan' },
    ],
    timeline: [
      { label: 'Project Submitted', date: '31/07/2026', done: true, current: false },
      { label: 'Project Kickoff & Approval', date: '01/08/2026', done: true, current: false },
      { label: 'Phase 1: Research & Wireframes', date: '15/08/2026', done: true, current: false },
      { label: 'Phase 2: Visual Development', date: '25/08/2026', done: false, current: true },
      { label: 'Target Launch & Due Date', date: '31/08/2026', done: false, current: false },
    ],
    files: [
      { id: 'f-1', name: 'Emaar_Project_Architecture_v2.pdf', size: '2.4 MB', date: '02 Aug 2026' },
      { id: 'f-2', name: 'UI_UX_Design_System_Spec.docx', size: '1.1 MB', date: '10 Aug 2026' },
      { id: 'f-3', name: 'Budget_Allocation_AED_Summary.xlsx', size: '850 KB', date: '15 Aug 2026' },
    ],
    activities: [
      { id: 'a-1', user: 'Claire Bure', action: 'updated status to On Track', time: '2 hours ago', avatar: '/img/client1.jpg' },
      { id: 'a-2', user: 'Smith Johnson', action: 'uploaded Budget_Allocation_AED_Summary.xlsx', time: '1 day ago', avatar: '/img/client3.jpg' },
      { id: 'a-3', user: 'Ajmal Khan', action: 'completed task UI/UX Wireframing', time: '3 days ago', avatar: '/img/client2.jpg' },
    ]
  }
};

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { setChatDrawerOpen, setActiveTaskDetail } = useWorkspaceStore();

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedLeadProfile, setSelectedLeadProfile] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  useEffect(() => {
    // Simulate API fetch delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      let found = MOCK_PROJECT_DATABASE[projectId];
      if (!found) {
        // Fallback generator for any custom project ID
        found = {
          _id: projectId || 'prj-detail',
          reference: `PRJ-${String(projectId).replace(/[^0-9]/g, '') || '1024'}`,
          title: `Project ${projectId?.replace('task-', '') || 'Details Workspace'}`,
          customer: 'Emaar Properties PJSC',
          group: 'Research',
          startDate: '01 Aug 2026',
          dueDate: '31 Aug 2026',
          totalDays: '30 Days',
          submittedDate: '31/07/2026',
          actualBudget: '100 AED',
          plannedBudget: '100 AED',
          projectLead: 'John',
          domainLead: 'Smith',
          owner: 'Claire Bure',
          status: 'On Track',
          priority: 'High',
          progress: 60,
          description: 'Dedicated enterprise project details workspace displaying full scope, milestone timelines, sub-task breakdowns, multi-currency budget metrics, and team assignees.',
          assignees: [
            { _id: 'u1', name: 'Claire Bure', role: 'Project Lead', avatarUrl: '/img/client1.jpg' },
            { _id: 'u2', name: 'Ajmal Khan', role: 'Senior Developer', avatarUrl: '/img/client2.jpg' },
          ],
          tasks: [
            { id: 'sub-1', title: 'Initial Project Setup & Governance', status: 'Completed', date: '05 Aug 2026', assignee: 'Claire Bure' },
            { id: 'sub-2', title: 'Architecture Review & API Design', status: 'In Progress', date: '18 Aug 2026', assignee: 'Smith Johnson' },
            { id: 'sub-3', title: 'Final Deployment & Handover', status: 'Pending', date: '31 Aug 2026', assignee: 'Ajmal Khan' },
          ],
          timeline: [
            { label: 'Project Submitted', date: '31/07/2026', done: true, current: false },
            { label: 'Project Started', date: '01/08/2026', done: true, current: false },
            { label: 'Mid-term Review', date: '15/08/2026', done: false, current: true },
            { label: 'Project Due Date', date: '31/08/2026', done: false, current: false },
          ],
          files: [
            { id: 'f-1', name: 'Project_Overview_Spec.pdf', size: '1.8 MB', date: '02 Aug 2026' },
          ],
          activities: [
            { id: 'a-1', user: 'Claire Bure', action: 'created project page', time: '3 hours ago', avatar: '/img/client1.jpg' },
          ]
        };
      }
      setProject(found);
      setSubTasks(found.tasks || []);
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [projectId]);

  const handleToggleSubTask = (id) => {
    setSubTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleAddSubTask = (e) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim()) return;
    const newTask = {
      id: `sub-${Date.now()}`,
      title: newSubTaskTitle.trim(),
      status: 'In Progress',
      date: '31 Aug 2026',
      assignee: 'Claire Bure'
    };
    setSubTasks(prev => [...prev, newTask]);
    setNewSubTaskTitle('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenChat = () => {
    if (project) {
      setActiveTaskDetail({ _id: project._id, title: project.title });
      setChatDrawerOpen(true);
    }
  };

  // Loading Skeleton View
  if (isLoading) {
    return (
      <div className="container-fluid p-4 bg-light min-vh-100">
        <div className="bg-white rounded-3 p-4 shadow-sm mb-4 animate-pulse">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="bg-secondary bg-opacity-20 rounded" style={{ width: '120px', height: '24px' }}></div>
            <div className="bg-secondary bg-opacity-20 rounded" style={{ width: '80px', height: '24px' }}></div>
          </div>
          <div className="bg-secondary bg-opacity-20 rounded mb-2" style={{ width: '50%', height: '32px' }}></div>
          <div className="bg-secondary bg-opacity-20 rounded" style={{ width: '30%', height: '20px' }}></div>
        </div>

        <div className="row g-3 mb-4">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="col-12 col-md">
              <div className="bg-white p-4 rounded-3 shadow-sm text-center">
                <div className="bg-secondary bg-opacity-20 rounded mx-auto mb-2" style={{ width: '60px', height: '16px' }}></div>
                <div className="bg-secondary bg-opacity-20 rounded mx-auto" style={{ width: '90px', height: '28px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 404 Project Not Found State
  if (!project) {
    return (
      <div className="container-fluid p-5 bg-light min-vh-100 d-flex align-items-center justify-content-center text-center">
        <div className="bg-white p-5 rounded-4 shadow-lg" style={{ maxWidth: '480px' }}>
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 d-inline-flex mb-3">
            <AlertCircle size={48} />
          </div>
          <h4 className="fw-bold text-dark mb-2">Project Not Found</h4>
          <p className="text-muted mb-4">
            The requested project ID <code className="text-danger">{projectId}</code> does not exist or has been archived.
          </p>
          <Link to="/projects" className="btn btn-primary px-4 fw-bold py-2 rounded-3">
            <ArrowLeft size={16} className="me-2" />
            Back to Projects List
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadgeStyle = (st) => {
    switch (st) {
      case 'On Track': return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
      case 'At Risk': return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
      case 'Stuck': return { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' };
      case 'Approved': return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      case 'Planned': return { bg: '#fefce8', color: '#a16207', border: '#fef08a' };
      default: return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    }
  };

  const getPriorityBadgeStyle = (pr) => {
    switch (pr) {
      case 'Critical': return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5' };
      case 'High': return { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' };
      case 'Medium': return { bg: '#fefce8', color: '#ca8a04', border: '#fef08a' };
      case 'Low': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      default: return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
    }
  };

  const stStyle = getStatusBadgeStyle(project.status);
  const prStyle = getPriorityBadgeStyle(project.priority);

  return (
    <div className="project-details-page-wrapper bg-light min-vh-100 p-4 p-md-5" style={{ fontFamily: "'Heebo', -apple-system, sans-serif" }}>
      {/* Printable CSS overrides */}
      <style>{`
        .project-details-page-wrapper,
        .project-details-page-wrapper * {
          font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        @media print {
          /* Hide non-printable UI elements */
          .sidebar, .header-container, .top_up, .btn, .no-print, nav, header {
            display: none !important;
          }
          body, .project-details-page-wrapper {
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-card {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Top Navigation & Breadcrumb */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 no-print">
        <div className="d-flex align-items-center gap-2">
          <Link
            to="/projects"
            className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2 fw-semibold bg-white"
            style={{ fontSize: '13.5px', borderColor: '#cbd5e1', color: '#0f172a' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>
          <span className="text-muted" style={{ fontSize: '13.5px' }}>/</span>
          <span className="text-muted font-monospace" style={{ fontSize: '13.5px', fontWeight: 600 }}>{project.reference}</span>
          <span className="text-muted" style={{ fontSize: '13.5px' }}>/</span>
          <span className="text-dark fw-bold" style={{ fontSize: '14px' }}>{project.title}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2 fw-bold bg-white"
            style={{ fontSize: '13.5px', height: '38px' }}
            onClick={handleOpenChat}
          >
            <MessageSquare size={16} />
            <span>Project Chat</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2 fw-bold bg-white"
            style={{ fontSize: '13.5px', height: '38px', borderColor: '#cbd5e1', color: '#0f172a' }}
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Print</span>
          </button>

          <div className="position-relative">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-3 rounded-3 bg-white"
              style={{ height: '38px', borderColor: '#cbd5e1', color: '#0f172a' }}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <MoreVertical size={18} />
            </button>

            {showMoreMenu && (
              <div className="dropdown-menu show shadow-lg position-absolute end-0 mt-1 rounded-3 p-2 bg-white" style={{ zIndex: 100, minWidth: '180px' }}>
                <button className="dropdown-item rounded-2 py-2 px-3 fw-medium" style={{ fontSize: '13.5px' }} onClick={() => { setShowMoreMenu(false); alert('Added to Favorites'); }}>★ Favorite</button>
                <button className="dropdown-item rounded-2 py-2 px-3 fw-medium" style={{ fontSize: '13.5px' }} onClick={() => { setShowMoreMenu(false); alert('Project Duplicated'); }}>📋 Duplicate</button>
                <button className="dropdown-item rounded-2 py-2 px-3 fw-medium" style={{ fontSize: '13.5px' }} onClick={() => { setShowMoreMenu(false); alert('Project Archived'); }}>📁 Archive</button>
                <hr className="dropdown-divider my-1.5" />
                <button className="dropdown-item rounded-2 py-2 px-3 fw-medium text-danger" style={{ fontSize: '13.5px' }} onClick={() => { setShowMoreMenu(false); alert('Delete Project requested'); }}>🗑 Delete Project</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-white rounded-4 p-4 p-md-4.5 shadow-sm border mb-4 print-card" style={{ borderColor: '#e2e8f0' }}>
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-4">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-2 font-monospace fw-bold" style={{ fontSize: '13.5px' }}>
                {project.reference}
              </span>
              <span className="text-muted" style={{ fontSize: '13.5px' }}>Submitted Date: <strong className="text-dark">{project.submittedDate}</strong></span>
              <span className="text-muted" style={{ fontSize: '13.5px' }}>• Group: <strong className="text-dark">{project.group}</strong></span>
            </div>

            <h2 className="fw-bold text-dark m-0 mb-2" style={{ fontSize: '26px', letterSpacing: '-0.01em' }}>{project.title}</h2>
            <p className="text-muted m-0" style={{ fontSize: '14px' }}>
              Customer: <strong className="text-dark">{project.customer}</strong>
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end pe-4 border-end">
              <div className="text-muted" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>STATUS</div>
              <span
                className="badge px-3 py-1 rounded-pill mt-1 fw-bold d-inline-block"
                style={{ backgroundColor: stStyle.bg, color: stStyle.color, border: `1px solid ${stStyle.border}`, fontSize: '13px' }}
              >
                {project.status}
              </span>
            </div>

            <div className="text-end">
              <div className="text-muted" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>PRIORITY</div>
              <span
                className="badge px-3 py-1 rounded-pill mt-1 fw-bold d-inline-block text-uppercase"
                style={{ backgroundColor: prStyle.bg, color: prStyle.color, border: `1px solid ${prStyle.border}`, fontSize: '12.5px', letterSpacing: '0.02em' }}
              >
                {project.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Header Metadata Bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 pt-4 mt-4 border-top" style={{ borderColor: '#f1f5f9' }}>
          <div className="d-flex flex-wrap align-items-center gap-5">
            <div className="d-flex align-items-center gap-3">
              <img src="/img/client1.jpg" alt="" className="rounded-circle shadow-xs" style={{ width: '38px', height: '38px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }} />
              <div>
                <div className="text-muted" style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.04em' }}>PROJECT OWNER</div>
                <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{project.owner}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <img src="/img/client2.jpg" alt="" className="rounded-circle shadow-xs" style={{ width: '38px', height: '38px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }} />
              <div>
                <div className="text-muted" style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.04em' }}>DOMAIN LEAD</div>
                <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{project.domainLead}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                {project.assignees.map((a, i) => (
                  <img
                    key={i}
                    src={a.avatarUrl || '/img/client1.jpg'}
                    alt={a.name}
                    className="rounded-circle border border-2 border-white shadow-xs"
                    style={{ width: '34px', height: '34px', objectFit: 'cover', marginLeft: i > 0 ? '-8px' : '0' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                  />
                ))}
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.04em' }}>TEAM MEMBERS</div>
                <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{project.assignees.length} Assigned</div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-primary px-4 py-2 rounded-3 d-inline-flex align-items-center gap-2 fw-bold shadow-sm"
              style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', fontSize: '14px', height: '40px' }}
              onClick={() => alert('Opening Edit Project Drawer...')}
            >
              <Edit3 size={16} strokeWidth={2.2} />
              <span>Edit Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Summary Cards */}
      <div className="row g-4 mb-4 print-card">
        {/* Card 1: % Complete */}
        <div className="col-12 col-sm-6 col-lg">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e2e8f0' }}>
            <div className="d-flex align-items-center justify-content-between text-muted mb-2" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
              <span>PROJECT PROGRESS</span>
              <TrendingUp size={18} className="text-primary" />
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-bold text-dark m-0" style={{ fontSize: '24px' }}>{project.progress}%</h3>
              <span className="text-success fw-bold" style={{ fontSize: '13px' }}>On Schedule</span>
            </div>
            <div className="progress mt-3" style={{ height: '7px', borderRadius: '4px' }}>
              <div className="progress-bar bg-primary rounded-pill" role="progressbar" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 2: Status */}
        <div className="col-12 col-sm-6 col-lg">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e2e8f0' }}>
            <div className="d-flex align-items-center justify-content-between text-muted mb-2" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
              <span>CURRENT STATUS</span>
              <CheckCircle2 size={18} className="text-success" />
            </div>
            <h4 className="fw-bold m-0 mb-1" style={{ color: stStyle.color, fontSize: '22px' }}>{project.status}</h4>
            <span className="text-muted" style={{ fontSize: '12.5px', fontWeight: 500 }}>Updated 2h ago</span>
          </div>
        </div>

        {/* Card 3: Priority */}
        <div className="col-12 col-sm-6 col-lg">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e2e8f0' }}>
            <div className="d-flex align-items-center justify-content-between text-muted mb-2" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
              <span>PRIORITY LEVEL</span>
              <Shield size={18} className="text-warning" />
            </div>
            <h4 className="fw-bold m-0 mb-1" style={{ color: prStyle.color, fontSize: '22px' }}>{project.priority}</h4>
            <span className="text-muted" style={{ fontSize: '12.5px', fontWeight: 500 }}>High Focus Tier</span>
          </div>
        </div>

        {/* Card 4: Total Duration */}
        <div className="col-12 col-sm-6 col-lg">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e2e8f0' }}>
            <div className="d-flex align-items-center justify-content-between text-muted mb-2" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
              <span>TOTAL DURATION</span>
              <Clock size={18} className="text-info" />
            </div>
            <h3 className="fw-bold text-dark m-0 mb-1" style={{ fontSize: '24px' }}>{project.totalDays}</h3>
            <span className="text-muted" style={{ fontSize: '12.5px', fontWeight: 500 }}>{project.startDate} - {project.dueDate}</span>
          </div>
        </div>

        {/* Card 5: Total Value */}
        <div className="col-12 col-sm-6 col-lg">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e2e8f0' }}>
            <div className="d-flex align-items-center justify-content-between text-muted mb-2" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
              <span>TOTAL VALUE</span>
              <DollarSign size={18} className="text-success" />
            </div>
            <h3 className="fw-bold text-success m-0 mb-1" style={{ fontSize: '24px' }}>{project.actualBudget}</h3>
            <span className="text-muted" style={{ fontSize: '12.5px', fontWeight: 500 }}>Planned: {project.plannedBudget}</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Header */}
      <div className="bg-white rounded-4 border shadow-sm mb-4 no-print" style={{ borderColor: '#e2e8f0' }}>
        <ul className="nav nav-tabs px-4 pt-3 border-0 gap-2">
          {[
            { id: 'OVERVIEW', label: 'Overview & Scope', icon: FileText },
            { id: 'TIMELINE', label: 'Timeline & Milestones', icon: Calendar },
            { id: 'TASKS', label: `Sub-Tasks (${subTasks.length})`, icon: Layers },
            { id: 'TEAM', label: `Team Members (${project.assignees.length})`, icon: Users },
            { id: 'FILES', label: `Files & Attachments (${project.files?.length || 0})`, icon: Paperclip },
            { id: 'ACTIVITY', label: 'Activity Feed', icon: MessageSquare },
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id} className="nav-item">
                <button
                  type="button"
                  className={`nav-link border-0 fw-bold px-4 py-3 d-inline-flex align-items-center gap-2 ${isActive ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontFamily: "'Heebo', sans-serif" }}
                >
                  <IconComp size={17} />
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* TAB CONTENT SECTIONS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="row g-4 print-card">
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4" style={{ borderColor: '#e2e8f0' }}>
              <h5 className="fw-bold text-dark mb-3" style={{ fontSize: '17px' }}>Project Description & Objectives</h5>
              <p className="text-secondary leading-relaxed" style={{ fontSize: '14px', lineHeight: '1.65' }}>
                {project.description}
              </p>
              <h6 className="fw-bold text-dark mt-4 mb-3" style={{ fontSize: '15px' }}>Key Objectives</h6>
              <div className="d-flex flex-column gap-2">
                {[
                  'Enhance project tracking visibility across Emaar business units.',
                  'Streamline task handovers with real-time status transitions.',
                  'Maintain strict SLA compliance and multi-currency (100 AED standard) budget governance.',
                  'Deliver zero-downtime deployment for internal enterprise users.',
                ].map((obj, iIdx) => (
                  <div key={iIdx} className="d-flex align-items-start gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                      style={{ width: '22px', height: '22px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb' }}
                    >
                      <CheckCircle2 size={13} strokeWidth={2.5} color="#2563eb" />
                    </div>
                    <span className="text-secondary" style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
                      {obj}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-4 border shadow-sm" style={{ borderColor: '#e2e8f0' }}>
              <h5 className="fw-bold text-dark mb-3" style={{ fontSize: '17px' }}>Client & Governance Details</h5>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted fw-bold" style={{ fontSize: '11.5px', letterSpacing: '0.04em' }}>CUSTOMER ENTITY</div>
                    <div className="fw-bold text-dark mt-1" style={{ fontSize: '14px' }}>{project.customer}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted fw-bold" style={{ fontSize: '11.5px', letterSpacing: '0.04em' }}>INTERNAL PMO REF</div>
                    <div className="fw-bold text-primary mt-1 font-monospace" style={{ fontSize: '14px' }}>{project.reference}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted fw-bold" style={{ fontSize: '11.5px', letterSpacing: '0.04em' }}>START DATE</div>
                    <div className="fw-bold text-dark mt-1" style={{ fontSize: '14px' }}>{project.startDate}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted fw-bold" style={{ fontSize: '11.5px', letterSpacing: '0.04em' }}>DUE DATE</div>
                    <div className="fw-bold text-dark mt-1" style={{ fontSize: '14px' }}>{project.dueDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4" style={{ borderColor: '#e2e8f0' }}>
              <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '16px' }}>Key Stakeholders</h6>
              <div className="d-flex flex-column gap-3">
                <div
                  className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border cursor-pointer hover-bg-white"
                  style={{ transition: 'all 0.15s ease' }}
                  onClick={() => setSelectedLeadProfile({ name: project.projectLead, type: 'Project Lead' })}
                >
                  <img src="/img/client1.jpg" alt="" className="rounded-circle shadow-xs" style={{ width: '42px', height: '42px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }} />
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{project.projectLead}</div>
                    <div className="text-muted" style={{ fontSize: '12px', fontWeight: 500 }}>Project Lead • Click for profile</div>
                  </div>
                </div>

                <div
                  className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border cursor-pointer hover-bg-white"
                  style={{ transition: 'all 0.15s ease' }}
                  onClick={() => setSelectedLeadProfile({ name: project.domainLead, type: 'Domain Lead' })}
                >
                  <img src="/img/client2.jpg" alt="" className="rounded-circle shadow-xs" style={{ width: '42px', height: '42px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar2.svg'; }} />
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{project.domainLead}</div>
                    <div className="text-muted" style={{ fontSize: '12px', fontWeight: 500 }}>Domain Lead • Click for profile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TIMELINE TAB */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4 print-card" style={{ borderColor: '#e2e8f0' }}>
          <h5 className="fw-bold text-dark mb-4" style={{ fontSize: '17px' }}>Project Milestone Timeline</h5>

          {/* Timeline Container with Precise Inter-Node Connecting Lines */}
          <div className="position-relative py-1 px-1">
            {project.timeline?.map((item, idx) => {
              const isLast = idx === (project.timeline.length - 1);
              return (
                <div key={idx} className={`position-relative d-flex align-items-start gap-3 ${isLast ? 'mb-0' : 'mb-4'}`} style={{ zIndex: 2 }}>
                  {/* Vertical Line Segment connecting this node to next node (omitted on last node) */}
                  {!isLast && (
                    <div
                      className="position-absolute"
                      style={{
                        top: '16px',
                        bottom: '-24px',
                        left: '15px',
                        width: '3px',
                        backgroundColor: '#cbd5e1',
                        borderRadius: '2px',
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Node Circle perfectly centered over 3px vertical line */}
                  <div
                    className={`rounded-circle border border-2 border-white d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm ${
                      item.done
                        ? 'bg-success text-white'
                        : item.current
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-secondary text-white'
                    }`}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: item.done ? '#16a34a' : item.current ? '#2563eb' : '#64748b',
                      zIndex: 3,
                    }}
                  >
                    {item.done ? <Check size={16} strokeWidth={3} /> : <span style={{ fontSize: '12px', fontWeight: 700 }}>{idx + 1}</span>}
                  </div>

                  {/* Milestone Card Content Aligned with Node Circle */}
                  <div
                    className="flex-grow-1 p-3 rounded-3 border"
                    style={{
                      borderColor: item.current ? '#bfdbfe' : '#e2e8f0',
                      backgroundColor: item.current ? '#f8fafc' : '#f8fafc',
                      boxShadow: item.current ? '0 2px 8px rgba(37,99,235,0.06)' : 'none',
                    }}
                  >
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold text-dark m-0" style={{ fontSize: '14.5px' }}>{item.label}</h6>
                        {item.done && (
                          <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '11px', fontWeight: 600 }}>
                            Completed
                          </span>
                        )}
                        {item.current && (
                          <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: 600 }}>
                            In Progress
                          </span>
                        )}
                      </div>
                      <span className="badge bg-white text-dark border font-monospace px-2 py-1 rounded-2" style={{ fontSize: '12px', fontWeight: 600 }}>
                        {item.date}
                      </span>
                    </div>
                    <p className="text-muted m-0" style={{ fontSize: '13px' }}>
                      {item.done ? 'Completed successfully' : item.current ? 'Currently in progress' : 'Scheduled upcoming milestone'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TASKS TAB */}
      {activeTab === 'TASKS' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4 print-card" style={{ borderColor: '#e2e8f0' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark m-0" style={{ fontSize: '17px' }}>Sub-Tasks Breakdown</h5>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill fw-bold" style={{ fontSize: '12.5px' }}>
              {subTasks.filter(t => t.status === 'Completed').length} / {subTasks.length} Completed
            </span>
          </div>

          <form onSubmit={handleAddSubTask} className="d-flex gap-2 mb-4 no-print">
            <input
              type="text"
              className="form-control rounded-3"
              style={{ height: '38px', fontSize: '13.5px' }}
              placeholder="Add a new sub-task..."
              value={newSubTaskTitle}
              onChange={(e) => setNewSubTaskTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-3 rounded-3 fw-bold d-inline-flex align-items-center gap-1" style={{ height: '38px', fontSize: '13px', backgroundColor: '#2563eb', borderColor: '#2563eb' }}>
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          <div className="list-group list-group-flush border rounded-3 overflow-hidden">
            {subTasks.map((t) => {
              const isDone = t.status === 'Completed';
              return (
                <div
                  key={t.id}
                  className="list-group-item d-flex align-items-center justify-content-between p-3 border-bottom hover-bg-light"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleSubTask(t.id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="checkbox"
                      className="form-check-input mt-0 cursor-pointer"
                      checked={isDone}
                      onChange={() => handleToggleSubTask(t.id)}
                      style={{ width: '17px', height: '17px' }}
                    />
                    <span className={`fw-semibold ${isDone ? 'text-decoration-line-through text-muted' : 'text-dark'}`} style={{ fontSize: '14px' }}>
                      {t.title}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted font-monospace" style={{ fontSize: '12.5px' }}>{t.date}</span>
                    <span className={`badge px-3 py-1 rounded-pill fw-bold ${isDone ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'}`} style={{ fontSize: '12px' }}>
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TEAM TAB */}
      {activeTab === 'TEAM' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4 print-card" style={{ borderColor: '#e2e8f0' }}>
          <h5 className="fw-bold text-dark mb-4" style={{ fontSize: '17px' }}>Assigned Team Members</h5>
          <div className="row g-3">
            {project.assignees.map((member, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div
                  className="p-3 bg-light rounded-3 border d-flex align-items-center gap-3 cursor-pointer hover-bg-white"
                  style={{ transition: 'all 0.15s ease' }}
                  onClick={() => setSelectedLeadProfile({ name: member.name, type: member.role || 'Team Member' })}
                >
                  <img
                    src={member.avatarUrl || '/img/client1.jpg'}
                    alt={member.name}
                    className="rounded-circle shadow-xs"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                  />
                  <div>
                    <h6 className="fw-bold text-dark m-0" style={{ fontSize: '14.5px' }}>{member.name}</h6>
                    <span className="text-muted" style={{ fontSize: '12.5px', fontWeight: 500 }}>{member.role || 'Assignee'}</span>
                    <div className="text-primary font-monospace mt-1" style={{ fontSize: '12px', fontWeight: 600 }}>Click for Profile</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. FILES TAB */}
      {activeTab === 'FILES' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4 print-card" style={{ borderColor: '#e2e8f0' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark m-0" style={{ fontSize: '17px' }}>Project Documentation & Attachments</h5>
            <button className="btn btn-outline-primary btn-sm px-3 rounded-3 fw-bold d-inline-flex align-items-center gap-1 no-print" style={{ height: '36px', fontSize: '13px' }}>
              <Plus size={15} />
              <span>Upload File</span>
            </button>
          </div>

          <div className="list-group border rounded-3 overflow-hidden">
            {project.files?.map(file => (
              <div key={file.id} className="list-group-item d-flex align-items-center justify-content-between p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                    <FileText size={22} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{file.name}</div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>{file.size} • Uploaded {file.date}</div>
                  </div>
                </div>
                <button className="btn btn-sm btn-light border fw-bold text-primary px-3 rounded-3 no-print" style={{ height: '34px', fontSize: '13px' }} onClick={() => alert(`Downloading ${file.name}...`)}>
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ACTIVITY TAB */}
      {activeTab === 'ACTIVITY' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4 print-card" style={{ borderColor: '#e2e8f0' }}>
          <h5 className="fw-bold text-dark mb-4" style={{ fontSize: '17px' }}>Project Activity & Audit Log</h5>
          <div className="d-flex flex-column gap-3">
            {project.activities?.map(act => (
              <div key={act.id} className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
                <img src={act.avatar} alt="" className="rounded-circle shadow-xs" style={{ width: '38px', height: '38px', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }} />
                <div>
                  <div className="text-dark" style={{ fontSize: '13.5px' }}>
                    <strong className="fw-bold">{act.user}</strong> {act.action}
                  </div>
                  <span className="text-muted font-monospace" style={{ fontSize: '11.5px' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Profile Popup Modal */}
      {selectedLeadProfile && (
        <LeadProfileModal
          leadName={selectedLeadProfile.name}
          leadType={selectedLeadProfile.type}
          onClose={() => setSelectedLeadProfile(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;
