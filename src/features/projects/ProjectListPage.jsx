import {
  ArrowRight,
  Check,
  ChevronDown, Eye,
  Plus,
  Printer,
  Search,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { LeadProfileModal } from '../../components/common/LeadProfileModal';
import { getSavedTasks, saveTasks } from '../../lib/taskDatabase';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { ProjectDescriptionModal } from './ProjectDescriptionModal';

// Rich list of mock projects with all 12 column data fields
const INITIAL_PROJECTS = [
  { _id: 'task-1', reference: 'PRJ-1024', title: 'Plumbing Installation', customer: 'Cody Fisher', assignees: [{ name: 'Leslie Alexander', avatarUrl: '/img/client1.jpg' }], progress: 60, startDate: '01/08/2026', dueDate: '16/08/2026', totalDays: '15 Days', submittedDate: '31/07/2026', priority: 'High', status: 'Active', totalValue: '$87,500.00', group: 'Research' },
  { _id: 'task-2', reference: 'PRJ-1025', title: 'Wall Painting', customer: 'Leslie Alexander', assignees: [{ name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }, { name: 'Ajmal Khan', avatarUrl: '/img/client2.jpg' }], progress: 45, startDate: '02/08/2026', dueDate: '17/08/2026', totalDays: '15 Days', submittedDate: '01/08/2026', priority: 'Medium', status: 'Active', totalValue: '$87,500.00', group: 'Research' },
  { _id: 'task-3', reference: 'PRJ-1026', title: 'Preparing walls for painting', customer: 'Dianne Russell', assignees: [{ name: 'Dianne R.', avatarUrl: '/img/client2.jpg' }], progress: 30, startDate: '05/08/2026', dueDate: '19/09/2026', totalDays: '45 Days', submittedDate: '05/08/2026', priority: 'Low', status: 'Active', totalValue: '$87,500.00', group: 'Wireframe' },
  { _id: 'task-4', reference: 'PRJ-1027', title: 'Floor laying', customer: 'Jane Cooper', assignees: [{ name: 'Brooklyn Simmons', avatarUrl: '/img/client3.jpg' }], progress: 20, startDate: '10/08/2026', dueDate: '20/09/2026', totalDays: '41 Days', submittedDate: '10/08/2026', priority: 'Medium', status: 'On Hold', totalValue: '$87,500.00', group: 'Wireframe' },
  { _id: 'task-5', reference: 'PRJ-1028', title: 'Floor insulation', customer: 'Jacob Jones', assignees: [{ name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }, { name: 'Jacob J.', avatarUrl: '/img/client2.jpg' }], progress: 90, startDate: '12/08/2026', dueDate: '23/09/2026', totalDays: '42 Days', submittedDate: '12/08/2026', priority: 'High', status: 'Active', totalValue: '$87,500.00', group: 'Visual Studio' },
  { _id: 'task-6', reference: 'PRJ-1029', title: 'Installation works for Kitchen', customer: 'Cameron Williamson', assignees: [{ name: 'Claire B.', avatarUrl: '/img/client1.jpg' }, { name: 'Ajmal K.', avatarUrl: '/img/client2.jpg' }], progress: 45, startDate: '15/08/2026', dueDate: '12/10/2026', totalDays: '58 Days', submittedDate: '15/08/2026', priority: 'Critical', status: 'Active', totalValue: '$87,500.00', group: 'Visual Studio' },
  { _id: 'task-7', reference: 'PRJ-1030', title: 'Installation works for Bathroom', customer: 'Guy Hawkins', assignees: [{ name: 'Guy H.', avatarUrl: '/img/client2.jpg' }], progress: 45, startDate: '18/08/2026', dueDate: '12/10/2026', totalDays: '55 Days', submittedDate: '18/08/2026', priority: 'Medium', status: 'Active', totalValue: '$87,500.00', group: 'Research' },
  { _id: 'task-8', reference: 'PRJ-1031', title: 'Brick work', customer: 'Jerome Bell', assignees: [{ name: 'Brooklyn Simmons', avatarUrl: '/img/client3.jpg' }], progress: 45, startDate: '20/08/2026', dueDate: '12/10/2026', totalDays: '53 Days', submittedDate: '20/08/2026', priority: 'Low', status: 'Active', totalValue: '$87,500.00', group: 'Research' },
  { _id: 'task-9', reference: 'PRJ-1032', title: 'Wall putty', customer: 'Annette Black', assignees: [{ name: 'Brooklyn Simmons', avatarUrl: '/img/client3.jpg' }], progress: 45, startDate: '22/08/2026', dueDate: '12/10/2026', totalDays: '51 Days', submittedDate: '22/08/2026', priority: 'Medium', status: 'Active', totalValue: '$87,500.00', group: 'Wireframe' },
  { _id: 'task-10', reference: 'PRJ-1033', title: 'Plumbing Installation Phase 2', customer: 'Brooklyn Simmons', assignees: [{ name: 'Claire B.', avatarUrl: '/img/client1.jpg' }], progress: 45, startDate: '25/08/2026', dueDate: '12/10/2026', totalDays: '48 Days', submittedDate: '25/08/2026', priority: 'High', status: 'Active', totalValue: '$87,500.00', group: 'Visual Studio' },
  { _id: 'task-11', reference: 'PRJ-1034', title: 'Electrical Wiring Systems', customer: 'Eleanor Pena', assignees: [{ name: 'Leslie Alexander', avatarUrl: '/img/client1.jpg' }], progress: 85, startDate: '28/08/2026', dueDate: '15/11/2026', totalDays: '79 Days', submittedDate: '28/08/2026', priority: 'Critical', status: 'Active', totalValue: '$92,000.00', group: 'Research' },
  { _id: 'task-12', reference: 'PRJ-1035', title: 'HVAC Air Conditioning Setup', customer: 'Wade Warren', assignees: [{ name: 'Ajmal Khan', avatarUrl: '/img/client2.jpg' }], progress: 15, startDate: '01/09/2026', dueDate: '01/12/2026', totalDays: '91 Days', submittedDate: '01/09/2026', priority: 'Medium', status: 'On Hold', totalValue: '$110,000.00', group: 'Wireframe' },
  { _id: 'task-13', reference: 'PRJ-1036', title: 'Roof Waterproofing Membrane', customer: 'Kristin Watson', assignees: [{ name: 'Smith Johnson', avatarUrl: '/img/client3.jpg' }], progress: 95, startDate: '03/09/2026', dueDate: '05/12/2026', totalDays: '93 Days', submittedDate: '03/09/2026', priority: 'Low', status: 'Completed', totalValue: '$65,000.00', group: 'Visual Studio' },
  { _id: 'task-14', reference: 'PRJ-1037', title: 'Balcony Glass Railing Fitting', customer: 'Esther Howard', assignees: [{ name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }], progress: 35, startDate: '05/09/2026', dueDate: '10/12/2026', totalDays: '96 Days', submittedDate: '05/09/2026', priority: 'High', status: 'Active', totalValue: '$48,500.00', group: 'Research' },
  { _id: 'task-15', reference: 'PRJ-1038', title: 'Marble Flooring Polish & Seal', customer: 'Ralph Edwards', assignees: [{ name: 'Jacob J.', avatarUrl: '/img/client2.jpg' }], progress: 50, startDate: '08/09/2026', dueDate: '18/12/2026', totalDays: '101 Days', submittedDate: '08/09/2026', priority: 'Critical', status: 'At Risk', totalValue: '$76,000.00', group: 'Wireframe' },
  { _id: 'task-16', reference: 'PRJ-1039', title: 'Smart Home Automation Conduit', customer: 'Courtney Henry', assignees: [{ name: 'Brooklyn Simmons', avatarUrl: '/img/client3.jpg' }], progress: 70, startDate: '10/09/2026', dueDate: '22/12/2026', totalDays: '103 Days', submittedDate: '10/09/2026', priority: 'Medium', status: 'Active', totalValue: '$105,000.00', group: 'Visual Studio' },
  { _id: 'task-17', reference: 'PRJ-1040', title: 'Facade Cladding Panel Fixings', customer: 'Theresa Webb', assignees: [{ name: 'Leslie Alexander', avatarUrl: '/img/client1.jpg' }], progress: 10, startDate: '12/09/2026', dueDate: '05/01/2027', totalDays: '115 Days', submittedDate: '12/09/2026', priority: 'High', status: 'On Hold', totalValue: '$140,000.00', group: 'Research' },
  { _id: 'task-18', reference: 'PRJ-1041', title: 'Landscape Irrigation Piping', customer: 'Arlene McCoy', assignees: [{ name: 'Ajmal Khan', avatarUrl: '/img/client2.jpg' }], progress: 100, startDate: '14/09/2026', dueDate: '15/01/2027', totalDays: '123 Days', submittedDate: '14/09/2026', priority: 'Low', status: 'Completed', totalValue: '$32,500.00', group: 'Wireframe' },
  { _id: 'task-19', reference: 'PRJ-1042', title: 'Fire Alarm Detector Circuitry', customer: 'Marvin McKinney', assignees: [{ name: 'Smith Johnson', avatarUrl: '/img/client3.jpg' }], progress: 55, startDate: '15/09/2026', dueDate: '20/01/2027', totalDays: '127 Days', submittedDate: '15/09/2026', priority: 'Critical', status: 'Active', totalValue: '$88,000.00', group: 'Visual Studio' },
  { _id: 'task-20', reference: 'PRJ-1043', title: 'Basement Parking Epoxy Coating', customer: 'Floyd Miles', assignees: [{ name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }], progress: 40, startDate: '16/09/2026', dueDate: '30/01/2027', totalDays: '136 Days', submittedDate: '16/09/2026', priority: 'Medium', status: 'Active', totalValue: '$95,000.00', group: 'Research' },
];

// Circular SVG Progress Ring Component
const ProgressRing = ({ value = 0, size = 32, strokeWidth = 3.5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  let strokeColor = '#2563eb';
  if (value >= 80) strokeColor = '#16a34a';
  else if (value < 30) strokeColor = '#ca8a04';

  return (
    <div className="d-inline-flex align-items-center gap-2">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <span className="fw-bold text-dark font-monospace" style={{ fontSize: '13px' }}>
        {value}%
      </span>
    </div>
  );
};

export const ProjectListPage = () => {
  const navigate = useNavigate();
  const { setChatDrawerOpen, setActiveTaskDetail } = useWorkspaceStore();

  const [projectsList, setProjectsList] = useState(() => getSavedTasks(INITIAL_PROJECTS));
  const [search, setSearch] = useState('');

  // Filter Dropdown Open States
  const [showStatusFilterMenu, setShowStatusFilterMenu] = useState(false);
  const [showClientFilterMenu, setShowClientFilterMenu] = useState(false);
  const [showAssigneeFilterMenu, setShowAssigneeFilterMenu] = useState(false);
  const [showDateFilterMenu, setShowDateFilterMenu] = useState(false);

  // Selected Filter Value States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [clientFilter, setClientFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [dateSortOrder, setDateSortOrder] = useState('NEWEST');

  // Pagination & Items Per Page
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeActionsDropdown, setActiveActionsDropdown] = useState(null);
  const [actionsDropdownPos, setActionsDropdownPos] = useState(null);
  const [previewModalTask, setPreviewModalTask] = useState(null);
  const [selectedLeadProfile, setSelectedLeadProfile] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');

  // Extract unique clients & assignees for dropdown filter options
  const uniqueClients = useMemo(() => {
    const clients = new Set(projectsList.map((p) => p.customer).filter(Boolean));
    return Array.from(clients);
  }, [projectsList]);

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set();
    projectsList.forEach((p) => {
      p.assignees?.forEach((a) => {
        if (a.name) assignees.add(a.name);
      });
    });
    return Array.from(assignees);
  }, [projectsList]);

  // Reset to page 1 whenever search or filter selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, clientFilter, assigneeFilter, dateSortOrder, itemsPerPage]);

  // Close active dropdown menus on global click outside
  useEffect(() => {
    const handleGlobalClickOrScroll = () => {
      if (activeActionsDropdown) {
        setActiveActionsDropdown(null);
        setActionsDropdownPos(null);
      }
      setShowStatusFilterMenu(false);
      setShowClientFilterMenu(false);
      setShowAssigneeFilterMenu(false);
      setShowDateFilterMenu(false);
    };
    window.addEventListener('click', handleGlobalClickOrScroll);
    window.addEventListener('scroll', handleGlobalClickOrScroll, true);
    return () => {
      window.removeEventListener('click', handleGlobalClickOrScroll);
      window.removeEventListener('scroll', handleGlobalClickOrScroll, true);
    };
  }, [activeActionsDropdown]);

  // Master Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    let list = [...projectsList];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) => {
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCustomer = p.customer.toLowerCase().includes(q);
        const matchStatus = p.status.toLowerCase().includes(q);
        const matchRef = p.reference.toLowerCase().includes(q);
        return matchTitle || matchCustomer || matchStatus || matchRef;
      });
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((p) => p.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (clientFilter !== 'ALL') {
      list = list.filter((p) => p.customer === clientFilter);
    }

    if (assigneeFilter !== 'ALL') {
      list = list.filter((p) => p.assignees?.some((a) => a.name === assigneeFilter));
    }

    if (dateSortOrder === 'DUE_ASC') {
      list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    } else if (dateSortOrder === 'OLDEST') {
      list.sort((a, b) => a._id.localeCompare(b._id));
    } else {
      list.sort((a, b) => b._id.localeCompare(a._id));
    }

    return list;
  }, [projectsList, search, statusFilter, clientFilter, assigneeFilter, dateSortOrder]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProjects = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, validCurrentPage, itemsPerPage]);

  const getStatusPill = (statusStr) => {
    switch (statusStr) {
      case 'Active':
      case 'On Track':
      case 'Approved':
        return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', dot: '#10b981' };
      case 'On Hold':
        return { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b' };
      case 'At Risk':
      case 'Stuck':
        return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#ef4444' };
      case 'Completed':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' };
      default:
        return { bg: '#f8fafc', color: '#475569', border: '#cbd5e1', dot: '#64748b' };
    }
  };

  const getPriorityStyle = (priorityStr) => {
    switch (priorityStr) {
      case 'Critical': return { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' };
      case 'High': return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' };
      case 'Medium': return { bg: '#fefce8', color: '#854d0e', border: '#fef08a' };
      case 'Low': return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
      default: return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    }
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    const newPrj = {
      _id: `task-${Date.now()}`,
      reference: `PRJ-${Math.floor(1044 + Math.random() * 900)}`,
      title: newProjectTitle.trim(),
      customer: newCustomerName.trim() || 'Emaar Development PJSC',
      assignees: [{ name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }],
      progress: 0,
      startDate: '17/09/2026',
      dueDate: '31/12/2026',
      totalDays: '105 Days',
      submittedDate: '17/09/2026',
      priority: 'Medium',
      status: 'Active',
      totalValue: '$87,500.00',
      group: 'Research'
    };
    setProjectsList((prev) => {
      const updated = [newPrj, ...prev];
      saveTasks(updated);
      return updated;
    });
    setNewProjectTitle('');
    setNewCustomerName('');
    setShowAddProjectModal(false);
  };

  const handlePrint = (prj) => {
    window.print();
  };

  return (
    <div className="project-list-page-wrapper p-4 min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Heebo Font & Print Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');

        .project-list-page-wrapper,
        .project-list-page-wrapper *,
        .project-list-page-wrapper table,
        .project-list-page-wrapper th,
        .project-list-page-wrapper td,
        .project-list-page-wrapper button,
        .project-list-page-wrapper input,
        .project-list-page-wrapper select,
        .dropdown-menu,
        .dropdown-item {
          font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        @media print {
          .sidebar, nav, .no-print, button, .pagination-row {
            display: none !important;
          }
          body, .project-list-page-wrapper {
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .main-card {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Top Header Row */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 no-print">
        <div>
          <h1 className="fw-bold text-dark m-0" style={{ fontSize: '26px', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Projects
          </h1>
          <p className="text-muted m-0 mt-1" style={{ fontSize: '13.5px', color: '#64748b' }}>
            Take control of your construction projects from start to finish
          </p>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary px-4 py-2 rounded-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
            style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', fontSize: '13.5px' }}
            onClick={() => setShowAddProjectModal(true)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-4 border shadow-sm p-4 main-card" style={{ borderColor: '#e2e8f0' }}>
        {/* Filter Toolbar Row */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 no-print">
          {/* Left: Status Filter Dropdown Pill */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-3 rounded-pill border fw-bold text-dark d-inline-flex align-items-center gap-2 bg-white"
              style={{ borderColor: '#cbd5e1', fontSize: '13px', height: '38px' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusFilterMenu(!showStatusFilterMenu);
                setShowClientFilterMenu(false);
                setShowAssigneeFilterMenu(false);
                setShowDateFilterMenu(false);
              }}
            >
              <p className="fw-bold m-0 p-0" style={{ fontSize: '13px' }}>
                {statusFilter === 'ALL' ? 'All Projects' : statusFilter}
              </p>
              <span className="badge rounded-pill px-2 py-1 font-monospace" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '12px', fontWeight: 600 }}>
                • {filteredProjects.length}
              </span>
              <ChevronDown size={14} className="text-secondary ms-1" />
            </button>

            {showStatusFilterMenu && (
              <div
                className="dropdown-menu show shadow-xl p-2 border position-absolute start-0 mt-1 rounded-3 bg-white"
                style={{ zIndex: 100, minWidth: '180px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {['ALL', 'Active', 'On Hold', 'At Risk', 'Completed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 d-flex align-items-center justify-content-between fw-semibold ${statusFilter === st ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                    onClick={() => {
                      setStatusFilter(st);
                      setShowStatusFilterMenu(false);
                    }}
                  >
                    <p className="m-0 p-0 fw-semibold" style={{ fontSize: '13px' }}>
                      {st === 'ALL' ? 'All Projects' : st}
                    </p>
                    {statusFilter === st && <Check size={14} className="text-primary ms-2 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Search Bar & Filter Dropdowns */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Search Box */}
            <div
              className="d-flex align-items-center px-3 rounded-3 bg-light border"
              style={{ width: '270px', height: '38px', borderColor: '#e2e8f0' }}
            >
              <Search size={15} className="text-muted me-2 flex-shrink-0" />
              <input
                type="text"
                className="border-0 bg-transparent p-0 w-100 h-100"
                placeholder="Search by project name, Status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ outline: 'none', fontSize: '13px', color: '#0f172a' }}
              />
              {search && (
                <X size={14} className="text-muted cursor-pointer ms-1" onClick={() => setSearch('')} />
              )}
            </div>

            {/* Filter by Client Dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className={`btn btn-light btn-sm px-3 rounded-3 border fw-medium d-inline-flex align-items-center gap-1 bg-white ${clientFilter !== 'ALL' ? 'border-primary text-primary fw-bold' : 'text-secondary'}`}
                style={{ borderColor: clientFilter !== 'ALL' ? '#2563eb' : '#e2e8f0', fontSize: '13px', height: '38px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowClientFilterMenu(!showClientFilterMenu);
                  setShowStatusFilterMenu(false);
                  setShowAssigneeFilterMenu(false);
                  setShowDateFilterMenu(false);
                }}
              >
                <p className="m-0 p-0 fw-medium" style={{ fontSize: '13px' }}>
                  {clientFilter === 'ALL' ? 'Filter by Client' : clientFilter}
                </p>
                <ChevronDown size={14} />
              </button>

              {showClientFilterMenu && (
                <div
                  className="dropdown-menu show shadow-xl p-2 border position-absolute end-0 mt-1 rounded-3 bg-white"
                  style={{ zIndex: 100, minWidth: '200px', maxHeight: '240px', overflowY: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 fw-semibold ${clientFilter === 'ALL' ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                    onClick={() => { setClientFilter('ALL'); setShowClientFilterMenu(false); }}
                  >
                    <p className="m-0 p-0 fw-semibold" style={{ fontSize: '13px' }}>All Clients</p>
                  </button>
                  <hr className="dropdown-divider my-1" />
                  {uniqueClients.map((client) => (
                    <button
                      key={client}
                      type="button"
                      className={`dropdown-item rounded-2 py-2 px-3 fw-medium text-truncate ${clientFilter === client ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                      onClick={() => { setClientFilter(client); setShowClientFilterMenu(false); }}
                    >
                      <p className="m-0 p-0 fw-medium text-truncate" style={{ fontSize: '13px' }}>{client}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter by Employee Dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className={`btn btn-light btn-sm px-3 rounded-3 border fw-medium d-inline-flex align-items-center gap-1 bg-white ${assigneeFilter !== 'ALL' ? 'border-primary text-primary fw-bold' : 'text-secondary'}`}
                style={{ borderColor: assigneeFilter !== 'ALL' ? '#2563eb' : '#e2e8f0', fontSize: '13px', height: '38px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssigneeFilterMenu(!showAssigneeFilterMenu);
                  setShowStatusFilterMenu(false);
                  setShowClientFilterMenu(false);
                  setShowDateFilterMenu(false);
                }}
              >
                <p className="m-0 p-0 fw-medium" style={{ fontSize: '13px' }}>
                  {assigneeFilter === 'ALL' ? 'Filter by employee' : assigneeFilter}
                </p>
                <ChevronDown size={14} />
              </button>

              {showAssigneeFilterMenu && (
                <div
                  className="dropdown-menu show shadow-xl p-2 border position-absolute end-0 mt-1 rounded-3 bg-white"
                  style={{ zIndex: 100, minWidth: '190px', maxHeight: '240px', overflowY: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 fw-semibold ${assigneeFilter === 'ALL' ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                    onClick={() => { setAssigneeFilter('ALL'); setShowAssigneeFilterMenu(false); }}
                  >
                    <p className="m-0 p-0 fw-semibold" style={{ fontSize: '13px' }}>All Employees</p>
                  </button>
                  <hr className="dropdown-divider my-1" />
                  {uniqueAssignees.map((assignee) => (
                    <button
                      key={assignee}
                      type="button"
                      className={`dropdown-item rounded-2 py-2 px-3 fw-medium text-truncate ${assigneeFilter === assignee ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                      onClick={() => { setAssigneeFilter(assignee); setShowAssigneeFilterMenu(false); }}
                    >
                      <p className="m-0 p-0 fw-medium text-truncate" style={{ fontSize: '13px' }}>{assignee}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter by Date Dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className={`btn btn-light btn-sm px-3 rounded-3 border fw-medium d-inline-flex align-items-center gap-1 bg-white ${dateSortOrder !== 'NEWEST' ? 'border-primary text-primary fw-bold' : 'text-secondary'}`}
                style={{ borderColor: dateSortOrder !== 'NEWEST' ? '#2563eb' : '#e2e8f0', fontSize: '13px', height: '38px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDateFilterMenu(!showDateFilterMenu);
                  setShowStatusFilterMenu(false);
                  setShowClientFilterMenu(false);
                  setShowAssigneeFilterMenu(false);
                }}
              >
                <p className="m-0 p-0 fw-medium" style={{ fontSize: '13px' }}>
                  {dateSortOrder === 'NEWEST' ? 'Filter by Date' : dateSortOrder === 'DUE_ASC' ? 'Due Date (Earliest)' : 'Oldest First'}
                </p>
                <ChevronDown size={14} />
              </button>

              {showDateFilterMenu && (
                <div
                  className="dropdown-menu show shadow-xl p-2 border position-absolute end-0 mt-1 rounded-3 bg-white"
                  style={{ zIndex: 100, minWidth: '190px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 fw-medium ${dateSortOrder === 'NEWEST' ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                    onClick={() => { setDateSortOrder('NEWEST'); setShowDateFilterMenu(false); }}
                  >
                    <p className="m-0 p-0 fw-medium" style={{ fontSize: '13px' }}>Newest First</p>
                  </button>
                  <button
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 fw-medium ${dateSortOrder === 'DUE_ASC' ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                    onClick={() => { setDateSortOrder('DUE_ASC'); setShowDateFilterMenu(false); }}
                  >
                    <p className="m-0 p-0 fw-medium" style={{ fontSize: '13px' }}>Due Date (Earliest)</p>
                  </button>
                  <button
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 fw-medium ${dateSortOrder === 'OLDEST' ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                    onClick={() => { setDateSortOrder('OLDEST'); setShowDateFilterMenu(false); }}
                  >
                    <p className="m-0 p-0 fw-medium" style={{ fontSize: '13px' }}>Oldest First</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ALL 12 COLUMNS TABLE CONTAINER - Generous spacing & clean layout */}
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table align-middle m-0" style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                {/* 1. No. */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '50px', width: '50px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  No.
                </th>

                {/* 2. Project Name */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '240px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Project Name
                </th>

                {/* 3. Assigned to */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '150px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Assigned to
                </th>

                {/* 4. % Complete */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '120px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  % Complete
                </th>

                {/* 5. Start Date */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '105px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Start Date
                </th>

                {/* 6. Due Date */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '105px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Due Date
                </th>

                {/* 7. Total Days */}
                <th className="py-3 px-3 text-center" style={{ minWidth: '100px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Total Days
                </th>

                {/* 8. Project Submitted */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '105px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Submitted
                </th>

                {/* 9. Priority */}
                <th className="py-3 px-3 text-center" style={{ minWidth: '95px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Priority
                </th>

                {/* 10. Status */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '115px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Status
                </th>

                {/* 11. Total Value ($) */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '125px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Total Value ($)
                </th>

                {/* 12. Actions */}
                <th className="py-3 px-3 text-center" style={{ minWidth: '100px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <Search size={32} className="text-secondary opacity-40 mb-2" />
                      <h6 className="fw-bold text-dark m-0">No matching projects found</h6>
                      <p className="small text-muted m-0 mt-1">Try adjusting your search query or clear active filters.</p>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mt-3 rounded-3 px-3 fw-semibold"
                        onClick={() => {
                          setSearch('');
                          setStatusFilter('ALL');
                          setClientFilter('ALL');
                          setAssigneeFilter('ALL');
                          setDateSortOrder('NEWEST');
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((prj, idx) => {
                  const seqNo = (validCurrentPage - 1) * itemsPerPage + idx + 1;
                  const pill = getStatusPill(prj.status);
                  const prioStyle = getPriorityStyle(prj.priority);
                  const isActionsOpen = activeActionsDropdown === prj._id;

                  return (
                    <tr
                      key={prj._id || idx}
                      className="border-bottom hover-bg-light"
                      style={{ transition: 'background-color 0.15s ease' }}
                    >
                      {/* 1. Sequence No */}
                      <td className="py-3 px-3 text-start fw-semibold font-monospace" style={{ fontSize: '13px', color: '#475569' }}>
                        {seqNo}.
                      </td>

                      {/* 2. Project Name */}
                      <td className="py-3 px-3 text-start">
                        <Link
                          to={`/projects/${prj._id}`}
                          className="fw-bold text-decoration-none text-dark d-inline-block"
                          style={{
                            fontSize: '14px',
                            color: '#0f172a',
                            lineHeight: '1.4',
                            fontFamily: "'Heebo', sans-serif",
                            fontWeight: 700,
                            float: 'left',
                            maxWidth: '220px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={`View details for ${prj.title}`}
                        >
                          {prj.title}
                        </Link>
                      </td>

                      {/* 3. Assigned to */}
                      <td className="py-3 px-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center flex-nowrap">
                            {prj.assignees?.map((a, aIdx) => (
                              <img
                                key={aIdx}
                                src={a.avatarUrl || '/img/client1.jpg'}
                                alt={a.name}
                                className="rounded-circle border border-2 border-white shadow-sm"
                                style={{ width: '28px', height: '28px', objectFit: 'cover', marginLeft: aIdx > 0 ? '-8px' : '0' }}
                                onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                              />
                            ))}
                          </div>
                          <span className="fw-semibold text-dark text-truncate" style={{ fontSize: '13px', maxWidth: '100px' }}>
                            {prj.assignees?.[0]?.name || 'Leslie A.'}
                          </span>
                        </div>
                      </td>

                      {/* 4. % Complete */}
                      <td className="py-3 px-3">
                        <ProgressRing value={prj.progress} />
                      </td>

                      {/* 5. Start Date */}
                      <td className="py-3 px-3 font-monospace text-dark" style={{ fontSize: '13px' }}>
                        {prj.startDate || '01/08/2026'}
                      </td>

                      {/* 6. Due Date */}
                      <td className="py-3 px-3 font-monospace text-dark" style={{ fontSize: '13px' }}>
                        {prj.dueDate}
                      </td>

                      {/* 7. Total Days */}
                      <td className="py-3 px-3 text-center">
                        <span className="badge rounded-pill font-monospace px-2 py-1 fw-bold" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontSize: '11.5px' }}>
                          {prj.totalDays || '15 Days'}
                        </span>
                      </td>

                      {/* 8. Project Submitted */}
                      <td className="py-3 px-3 font-monospace text-muted" style={{ fontSize: '12px' }}>
                        {prj.submittedDate || '31/07/2026'}
                      </td>

                      {/* 9. Priority Badge */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className="badge px-2 py-1 rounded-pill fw-bold"
                          style={{
                            backgroundColor: prioStyle.bg,
                            color: prioStyle.color,
                            border: `1px solid ${prioStyle.border}`,
                            fontSize: '11px',
                            letterSpacing: '0.03em'
                          }}
                        >
                          {prj.priority || 'Medium'}
                        </span>
                      </td>

                      {/* 10. Status Pill */}
                      <td className="py-3 px-3">
                        <span
                          className="badge px-3 py-1 rounded-pill fw-bold d-inline-flex align-items-center gap-1"
                          style={{
                            backgroundColor: pill.bg,
                            color: pill.color,
                            fontSize: '12px',
                            border: `1px solid ${pill.border}`,
                            letterSpacing: '0.01em'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: pill.dot, display: 'inline-block' }} />
                          <span>{prj.status}</span>
                        </span>
                      </td>

                      {/* 11. Total Value ($) */}
                      <td className="py-3 px-3 fw-bold text-dark font-monospace" style={{ fontSize: '13.5px' }}>
                        {prj.totalValue}
                      </td>

                      {/* 12. Actions ([ Details ∨ ]) */}
                      <td className="py-3 px-3 text-center no-print">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary py-1 px-3 d-inline-flex align-items-center gap-1 rounded-3 fw-semibold bg-white"
                          style={{ fontSize: '12.5px', borderColor: '#cbd5e1', color: '#0f172a' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isActionsOpen) {
                              setActiveActionsDropdown(null);
                              setActionsDropdownPos(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActiveActionsDropdown(prj._id);
                              setActionsDropdownPos({
                                prj,
                                top: rect.bottom + 4,
                                left: Math.max(10, rect.right - 180),
                              });
                            }
                          }}
                        >
                          <span>Details</span>
                          <ChevronDown size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination & Rows Per Page Footer */}
        <div className="d-flex flex-wrap align-items-center justify-content-between pt-4 mt-3 border-top pagination-row no-print">
          <div className="d-flex align-items-center gap-3">
            <div className="text-muted small" style={{ fontSize: '13px' }}>
              Showing <strong className="text-dark">{filteredProjects.length > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong className="text-dark">{Math.min(validCurrentPage * itemsPerPage, filteredProjects.length)}</strong> of <strong className="text-dark">{filteredProjects.length}</strong> projects
            </div>

            {/* Page Size Selector */}
            <div className="d-flex align-items-center gap-1 ms-2">
              <span className="text-muted small" style={{ fontSize: '12px' }}>Rows per page:</span>
              <select
                className="form-select form-select-sm py-0 px-2 rounded-2"
                style={{ width: '65px', fontSize: '12px', height: '28px' }}
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
          </div>

          <div className="d-flex align-items-center gap-1">
            {/* Previous Page Button */}
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle fw-bold d-inline-flex align-items-center justify-content-center text-secondary border"
              style={{ width: '32px', height: '32px', backgroundColor: '#f8fafc', opacity: validCurrentPage === 1 ? 0.5 : 1 }}
              disabled={validCurrentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              title="Previous Page"
            >
              ❮
            </button>

            {/* Dynamic Numeric Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`btn btn-sm rounded-circle fw-bold d-inline-flex align-items-center justify-content-center ${pageNum === validCurrentPage ? 'btn-primary text-white shadow-sm' : 'btn-light text-secondary border'}`}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: pageNum === validCurrentPage ? '#2563eb' : '#f8fafc',
                  borderColor: pageNum === validCurrentPage ? '#2563eb' : '#e2e8f0',
                  fontSize: '13px',
                }}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle fw-bold d-inline-flex align-items-center justify-content-center text-secondary border"
              style={{ width: '32px', height: '32px', backgroundColor: '#f8fafc', opacity: validCurrentPage === totalPages ? 0.5 : 1 }}
              disabled={validCurrentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              title="Next Page"
            >
              ❯
            </button>
          </div>
        </div>
      </div>

      {/* Lead Profile Popup Modal */}
      {selectedLeadProfile && (
        <LeadProfileModal
          leadName={selectedLeadProfile.name}
          leadType={selectedLeadProfile.type}
          onClose={() => setSelectedLeadProfile(null)}
        />
      )}

      {/* Project Description Quick Preview Modal */}
      {previewModalTask && (
        <ProjectDescriptionModal
          task={previewModalTask}
          onClose={() => setPreviewModalTask(null)}
        />
      )}

      {/* Add New Project Modal */}
      {showAddProjectModal && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 100020 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white border-bottom">
                <h5 className="modal-title fw-bold">Create New Construction Project</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddProjectModal(false)}></button>
              </div>
              <form onSubmit={handleCreateProject}>
                <div className="modal-body p-4 bg-white">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small">Project Title</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Plumbing Installation Phase 2..."
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small">Client / Customer Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Cody Fisher..."
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary px-4 fw-medium" onClick={() => setShowAddProjectModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold" style={{ backgroundColor: '#2563eb' }}>
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL FOR ACTIONS MENU POPOVER */}
      {activeActionsDropdown && actionsDropdownPos && createPortal(
        <div
          className="dropdown-menu show shadow-xl p-1 border position-fixed bg-white rounded-3"
          style={{
            position: 'fixed',
            top: `${actionsDropdownPos.top}px`,
            left: `${actionsDropdownPos.left}px`,
            zIndex: 999999,
            width: '185px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="dropdown-item small rounded-2 py-2 px-3 d-flex align-items-center gap-2 fw-medium text-dark"
            onClick={() => {
              setPreviewModalTask(actionsDropdownPos.prj);
              setActiveActionsDropdown(null);
              setActionsDropdownPos(null);
            }}
          >
            <Eye size={14} className="text-primary" />
            <span>View Description</span>
          </button>

          <button
            type="button"
            className="dropdown-item small rounded-2 py-2 px-3 d-flex align-items-center gap-2 fw-medium text-dark"
            onClick={() => {
              navigate(`/projects/${actionsDropdownPos.prj._id}`);
              setActiveActionsDropdown(null);
              setActionsDropdownPos(null);
            }}
          >
            <ArrowRight size={14} className="text-success" />
            <span>View Full Details</span>
          </button>

          <button
            type="button"
            className="dropdown-item small rounded-2 py-2 px-3 d-flex align-items-center gap-2 fw-medium text-dark"
            onClick={() => {
              handlePrint(actionsDropdownPos.prj);
              setActiveActionsDropdown(null);
              setActionsDropdownPos(null);
            }}
          >
            <Printer size={14} className="text-secondary" />
            <span>Print Project</span>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectListPage;
