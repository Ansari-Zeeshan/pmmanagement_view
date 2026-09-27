import {
  Activity,
  ArrowRight,
  ArrowUpDown,
  Building,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  DollarSign,
  Download,
  Eye,
  Filter,
  Layers,
  Maximize2,
  MessageSquare,
  MoreHorizontal,
  PieChart,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
  Square,
  Trash2,
  TrendingUp,
  UserCheck,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { LeadProfileModal } from '../../components/common/LeadProfileModal';
import { saveTasks } from '../../lib/taskDatabase';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { ProjectDescriptionModal } from './ProjectDescriptionModal';
import { AddProjectModalPopup } from './modals/AddProjectModalPopup';

// Truncated Text Cell Component (with Ellipsis & Hover Tooltip)
const TruncatedTextCell = ({
  text,
  maxLength = 100,
  className = '',
  style = {},
  isLink,
}: {
  text: string;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
  isLink?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textStr = String(text || '');
  const isOverLength = textStr.length > maxLength;
  const displayText = isOverLength ? `${textStr.slice(0, maxLength)}...` : textStr;

  const content = (
    <span
      className={className}
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {displayText}
    </span>
  );

  return (
    <div
      className="position-relative d-inline-block mw-100"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      title={textStr}
      style={{ maxWidth: '100%', verticalAlign: 'middle' }}
    >
      {isLink ? (
        <Link to={isLink} className="text-decoration-none">
          {content}
        </Link>
      ) : (
        content
      )}

      {showTooltip && (
        <div
          className="position-absolute bg-dark text-white rounded-3 px-3 py-2 shadow-lg"
          style={{
            bottom: '125%',
            left: '0',
            zIndex: 999999,
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: 'normal',
            maxWidth: '360px',
            minWidth: '180px',
            width: 'max-content',
            pointerEvents: 'none',
            lineHeight: 1.4,
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.45), 0 8px 10px -6px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {textStr}
          <div
            className="position-absolute"
            style={{
              bottom: '-5px',
              left: '16px',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #212529',
            }}
          />
        </div>
      )}
    </div>
  );
};

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
  const { setChatDrawerOpen, setActiveTaskDetail, tasks: storeTasks, setTasks, addProject } = useWorkspaceStore();

  const projectsList = storeTasks;
  const [search, setSearch] = useState('');

  // Filter Dropdown Open States
  const [showStatusFilterMenu, setShowStatusFilterMenu] = useState(false);
  const [showClientFilterMenu, setShowClientFilterMenu] = useState(false);
  const [showAssigneeFilterMenu, setShowAssigneeFilterMenu] = useState(false);
  const [showDateFilterMenu, setShowDateFilterMenu] = useState(false);
  const [showColumnToggleMenu, setShowColumnToggleMenu] = useState(false);

  // Selected Filter Value States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [clientFilter, setClientFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [dateSortOrder, setDateSortOrder] = useState('NEWEST');

  // Column Sorting State
  const [sortColumn, setSortColumn] = useState<string>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Multi-Select Bulk Actions State
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [showBulkStatusMenu, setShowBulkStatusMenu] = useState(false);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    customer: true,
    assignees: true,
    progress: true,
    startDate: true,
    dueDate: true,
    totalDays: true,
    submittedDate: true,
    priority: true,
    status: true,
    totalValue: true,
  });

  // Right Flyout Quick Peek Drawer State
  const [quickDetailProject, setQuickDetailProject] = useState<any | null>(null);

  // Pagination & Items Per Page
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeActionsDropdown, setActiveActionsDropdown] = useState<any | null>(null);
  const [actionsDropdownPos, setActionsDropdownPos] = useState<any | null>(null);
  const [previewModalTask, setPreviewModalTask] = useState<any | null>(null);
  const [selectedLeadProfile, setSelectedLeadProfile] = useState<any | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [addProjectInitialGroup] = useState('Research');

  // Extract unique clients & assignees for dropdown filter options
  const uniqueClients = useMemo(() => {
    const clients = new Set(projectsList.map((p) => p.customer).filter(Boolean));
    return Array.from(clients);
  }, [projectsList]);

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>();
    projectsList.forEach((p) => {
      p.assignees?.forEach((a: any) => {
        if (a.name) assignees.add(a.name);
      });
    });
    return Array.from(assignees);
  }, [projectsList]);

  // Executive KPI Stats Calculation
  const kpiStats = useMemo(() => {
    const total = projectsList.length;
    const active = projectsList.filter((p) => p.status === 'Active' || p.status === 'On Track').length;
    const atRisk = projectsList.filter((p) => p.status === 'At Risk' || p.status === 'Stuck').length;
    const completed = projectsList.filter((p) => p.status === 'Completed').length;
    const avgProg = total > 0 ? Math.round(projectsList.reduce((acc, p) => acc + (p.progress || 0), 0) / total) : 0;

    let totalValNumeric = 0;
    projectsList.forEach((p) => {
      const num = Number((p.totalValue || '0').replace(/[^0-9.-]+/g, ''));
      if (!isNaN(num)) totalValNumeric += num;
    });
    const formattedTotalVal = `$${totalValNumeric.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return { total, active, atRisk, completed, avgProg, formattedTotalVal };
  }, [projectsList]);

  // Reset to page 1 whenever search, filter, or sort selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, clientFilter, assigneeFilter, dateSortOrder, sortColumn, sortDirection, itemsPerPage]);

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
      setShowColumnToggleMenu(false);
      setShowBulkStatusMenu(false);
    };
    window.addEventListener('click', handleGlobalClickOrScroll);
    window.addEventListener('scroll', handleGlobalClickOrScroll, true);
    return () => {
      window.removeEventListener('click', handleGlobalClickOrScroll);
      window.removeEventListener('scroll', handleGlobalClickOrScroll, true);
    };
  }, [activeActionsDropdown]);

  // Master Filter & Clickable Sort Logic
  const filteredProjects = useMemo(() => {
    let list = [...projectsList];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) => {
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchCustomer = (p.customer || '').toLowerCase().includes(q);
        const matchStatus = (p.status || '').toLowerCase().includes(q);
        const matchRef = (p.reference || '').toLowerCase().includes(q);
        return matchTitle || matchCustomer || matchStatus || matchRef;
      });
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((p) => (p.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    if (clientFilter !== 'ALL') {
      list = list.filter((p) => p.customer === clientFilter);
    }

    if (assigneeFilter !== 'ALL') {
      list = list.filter((p) => p.assignees?.some((a: any) => a.name === assigneeFilter));
    }

    // Column Header Sorting
    if (sortColumn !== 'default') {
      list.sort((a: any, b: any) => {
        let valA: any = a[sortColumn] ?? '';
        let valB: any = b[sortColumn] ?? '';

        if (sortColumn === 'progress') {
          valA = Number(a.progress) || 0;
          valB = Number(b.progress) || 0;
        } else if (sortColumn === 'totalValue') {
          valA = Number((a.totalValue || '0').replace(/[^0-9.-]+/g, '')) || 0;
          valB = Number((b.totalValue || '0').replace(/[^0-9.-]+/g, '')) || 0;
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      if (dateSortOrder === 'DUE_ASC') {
        list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
      } else if (dateSortOrder === 'OLDEST') {
        list.sort((a, b) => (a._id || '').localeCompare(b._id || ''));
      } else {
        list.sort((a, b) => (b._id || '').localeCompare(a._id || ''));
      }
    }

    return list;
  }, [projectsList, search, statusFilter, clientFilter, assigneeFilter, dateSortOrder, sortColumn, sortDirection]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProjects = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, validCurrentPage, itemsPerPage]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn('default');
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Multi-Select Handlers
  const allPaginatedIds = useMemo(() => paginatedProjects.map((p) => p._id), [paginatedProjects]);
  const isAllSelected = allPaginatedIds.length > 0 && allPaginatedIds.every((id) => selectedProjectIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProjectIds((prev) => prev.filter((id) => !allPaginatedIds.includes(id)));
    } else {
      setSelectedProjectIds((prev) => Array.from(new Set([...prev, ...allPaginatedIds])));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (newStatus: string) => {
    const updated = projectsList.map((p) =>
      selectedProjectIds.includes(p._id) ? { ...p, status: newStatus } : p
    );
    setTasks(updated);
    saveTasks(updated);
    setShowBulkStatusMenu(false);
  };

  const handleBulkExportCSV = () => {
    const selectedList = projectsList.filter((p) => selectedProjectIds.includes(p._id));
    if (selectedList.length === 0) return;

    const headers = ['Reference', 'Title', 'Customer', 'Status', 'Progress', 'Priority', 'StartDate', 'DueDate', 'TotalValue'];
    const rows = selectedList.map((p) => [
      p.reference || '',
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.customer || '').replace(/"/g, '""')}"`,
      p.status || '',
      `${p.progress || 0}%`,
      p.priority || '',
      p.startDate || '',
      p.dueDate || '',
      `"${p.totalValue || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `emaar_projects_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProjectIds.length} selected project(s)?`)) {
      const updated = projectsList.filter((p) => !selectedProjectIds.includes(p._id));
      setTasks(updated);
      saveTasks(updated);
      setSelectedProjectIds([]);
    }
  };

  const getStatusPill = (statusStr: string) => {
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

  const getPriorityStyle = (priorityStr: string) => {
    switch (priorityStr) {
      case 'Critical': return { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' };
      case 'High': return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' };
      case 'Medium': return { bg: '#fefce8', color: '#854d0e', border: '#fef08a' };
      case 'Low': return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
      default: return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    }
  };

  const handlePrint = () => {
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

        .table-responsive {
          overflow-x: auto !important;
          scrollbar-width: thin !important;
          scrollbar-color: #94a3b8 #f1f5f9 !important;
          padding-bottom: 8px !important;
        }
        .table-responsive::-webkit-scrollbar {
          height: 9px !important;
          width: 9px !important;
          display: block !important;
        }
        .table-responsive::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
          border-radius: 6px !important;
        }
        .table-responsive::-webkit-scrollbar-thumb {
          background: #94a3b8 !important;
          border-radius: 6px !important;
          border: 2px solid #f1f5f9 !important;
        }
        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: #64748b !important;
        }

        .sort-header-btn {
          background: none;
          border: none;
          padding: 0;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .sort-header-btn:hover {
          color: #2563eb;
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
            Projects Workspace
          </h1>
          <p className="text-muted m-0 mt-1" style={{ fontSize: '13.5px', color: '#64748b' }}>
            Executive command center & portfolio analytics for Emaar Construction Management
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

      {/* EXECUTIVE TOP STATS RIBBON (4 KPI CARDS) */}
      <div className="row g-3 mb-4 no-print">
        {/* KPI 1: Total Portfolio Projects */}
        <div className="col-md-3 col-sm-6">
          <div className="bg-white p-3.5 rounded-4 border shadow-sm h-100 position-relative overflow-hidden" style={{ borderColor: '#e2e8f0', borderRadius: '14px' }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-bold small text-uppercase tracking-wider" style={{ fontSize: '11px', color: '#64748b' }}>Total Portfolio</span>
                <h2 className="fw-extrabold m-0 mt-1" style={{ fontSize: '24px', color: '#0f172a' }}>{kpiStats.total} <span className="fs-6 fw-normal text-muted">Projects</span></h2>
              </div>
              <div className="rounded-3 p-2.5 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Building size={22} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 pt-2 border-top" style={{ borderColor: '#f1f5f9' }}>
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success fw-bold px-2 py-0.5" style={{ fontSize: '11px' }}>
                {kpiStats.active} Active
              </span>
              <span className="small text-muted" style={{ fontSize: '11.5px' }}>• {kpiStats.completed} Completed</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Portfolio Value */}
        <div className="col-md-3 col-sm-6">
          <div className="bg-white p-3.5 rounded-4 border shadow-sm h-100 position-relative overflow-hidden" style={{ borderColor: '#e2e8f0', borderRadius: '14px' }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-bold small text-uppercase tracking-wider" style={{ fontSize: '11px', color: '#64748b' }}>Total Portfolio Value</span>
                <h2 className="fw-extrabold m-0 mt-1 text-primary" style={{ fontSize: '20px' }}>{kpiStats.formattedTotalVal}</h2>
              </div>
              <div className="rounded-3 p-2.5 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <DollarSign size={22} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 pt-2 border-top" style={{ borderColor: '#f1f5f9' }}>
              <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary fw-bold px-2 py-0.5" style={{ fontSize: '11px' }}>
                Emaar Enterprise
              </span>
              <span className="small text-muted" style={{ fontSize: '11.5px' }}>Live Valuation</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Average Progress Gauge */}
        <div className="col-md-3 col-sm-6">
          <div className="bg-white p-3.5 rounded-4 border shadow-sm h-100 position-relative overflow-hidden" style={{ borderColor: '#e2e8f0', borderRadius: '14px' }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-bold small text-uppercase tracking-wider" style={{ fontSize: '11px', color: '#64748b' }}>Average Completion</span>
                <h2 className="fw-extrabold m-0 mt-1" style={{ fontSize: '24px', color: '#0f172a' }}>{kpiStats.avgProg}%</h2>
              </div>
              <div className="rounded-3 p-2.5 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                <TrendingUp size={22} />
              </div>
            </div>
            <div className="progress mt-2.5" style={{ height: '6px', borderRadius: '4px', backgroundColor: '#f1f5f9' }}>
              <div
                className="progress-bar"
                style={{ width: `${kpiStats.avgProg}%`, background: 'linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* KPI 4: At Risk Projects */}
        <div className="col-md-3 col-sm-6">
          <div className="bg-white p-3.5 rounded-4 border shadow-sm h-100 position-relative overflow-hidden" style={{ borderColor: '#e2e8f0', borderRadius: '14px' }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-bold small text-uppercase tracking-wider" style={{ fontSize: '11px', color: '#64748b' }}>At Risk / Delayed</span>
                <h2 className="fw-extrabold m-0 mt-1 text-danger" style={{ fontSize: '24px' }}>{kpiStats.atRisk} <span className="fs-6 fw-normal text-muted">Items</span></h2>
              </div>
              <div className="rounded-3 p-2.5 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                <Activity size={22} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 pt-2 border-top" style={{ borderColor: '#f1f5f9' }}>
              <span className={`badge rounded-pill fw-bold px-2 py-0.5 ${kpiStats.atRisk > 0 ? 'bg-danger text-white' : 'bg-success text-white'}`} style={{ fontSize: '11px' }}>
                {kpiStats.atRisk > 0 ? 'Requires Review' : 'All Clear'}
              </span>
              <span className="small text-muted" style={{ fontSize: '11.5px' }}>Delivery Health</span>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING BULK ACTIONS TOOLBAR */}
      {selectedProjectIds.length > 0 && (
        <div
          className="position-sticky top-0 bg-dark text-white rounded-3 p-3 shadow-2xl mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{ zIndex: 1050, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary px-3 py-1.5 rounded-pill fw-bold font-monospace" style={{ fontSize: '12px' }}>
              {selectedProjectIds.length} Selected
            </span>
            <span className="text-white-50 small">Execute batch operations on selected projects</span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
            {/* Bulk Change Status Dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBulkStatusMenu(!showBulkStatusMenu);
                }}
              >
                <span>Change Status</span>
                <ChevronDown size={14} />
              </button>
              {showBulkStatusMenu && (
                <div
                  className="dropdown-menu show shadow-xl p-1 border position-absolute end-0 mt-1 rounded-3 bg-white"
                  style={{ zIndex: 1100, minWidth: '150px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {['Active', 'On Hold', 'At Risk', 'Completed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className="dropdown-item rounded-2 py-1.5 px-3 small fw-semibold text-dark hover-bg-light"
                      onClick={() => handleBulkStatusChange(st)}
                    >
                      Mark as {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bulk Export CSV */}
            <button
              type="button"
              className="btn btn-sm btn-outline-light rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1.5"
              onClick={handleBulkExportCSV}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {/* Bulk Delete */}
            <button
              type="button"
              className="btn btn-sm btn-danger rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1.5"
              onClick={handleBulkDelete}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>

            {/* Deselect All */}
            <button
              type="button"
              className="btn btn-sm btn-link text-white-50 p-0 ms-2 text-decoration-none small"
              onClick={() => setSelectedProjectIds([])}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Card Container */}
      <div className="bg-white rounded-4 border shadow-sm p-4 main-card" style={{ borderColor: '#e2e8f0', borderRadius: '16px' }}>
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
                setShowColumnToggleMenu(false);
              }}
            >
              <p className="fw-bold m-0 p-0" style={{ fontSize: '13px' }}>
                {statusFilter === 'ALL' ? 'All Statuses' : statusFilter}
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
                      {st === 'ALL' ? 'All Statuses' : st}
                    </p>
                    {statusFilter === st && <Check size={14} className="text-primary ms-2 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Search Bar & Filter Dropdowns & Column Visibility Toggle */}
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
                placeholder="Search project name, client..."
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
                  setShowColumnToggleMenu(false);
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
                  {uniqueClients.map((client: any) => (
                    <button
                      key={String(client)}
                      type="button"
                      className={`dropdown-item rounded-2 py-2 px-3 fw-medium text-truncate ${clientFilter === client ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                      onClick={() => { setClientFilter(client); setShowClientFilterMenu(false); }}
                    >
                      <p className="m-0 p-0 fw-medium text-truncate" style={{ fontSize: '13px' }}>{String(client)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter by Assignee Dropdown */}
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
                  setShowColumnToggleMenu(false);
                }}
              >
                <p className="m-0 p-0 fw-medium" style={{ fontSize: '13px' }}>
                  {assigneeFilter === 'ALL' ? 'Filter by Assignee' : assigneeFilter}
                </p>
                <ChevronDown size={14} />
              </button>

              {showAssigneeFilterMenu && (
                <div
                  className="dropdown-menu show shadow-xl p-2 border position-absolute end-0 mt-1 rounded-3 bg-white"
                  style={{ zIndex: 100, minWidth: '200px', maxHeight: '240px', overflowY: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className={`dropdown-item rounded-2 py-2 px-3 fw-semibold ${assigneeFilter === 'ALL' ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                    onClick={() => { setAssigneeFilter('ALL'); setShowAssigneeFilterMenu(false); }}
                  >
                    <p className="m-0 p-0 fw-semibold" style={{ fontSize: '13px' }}>All Assignees</p>
                  </button>
                  <hr className="dropdown-divider my-1" />
                  {uniqueAssignees.map((assignee: any) => (
                    <button
                      key={String(assignee)}
                      type="button"
                      className={`dropdown-item rounded-2 py-2 px-3 fw-medium text-truncate ${assigneeFilter === assignee ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'}`}
                      onClick={() => { setAssigneeFilter(assignee); setShowAssigneeFilterMenu(false); }}
                    >
                      <p className="m-0 p-0 fw-medium text-truncate" style={{ fontSize: '13px' }}>{String(assignee)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Column Visibility Selector Dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className="btn btn-light btn-sm px-3 rounded-3 border fw-medium d-inline-flex align-items-center gap-1.5 bg-white text-secondary"
                style={{ borderColor: '#e2e8f0', fontSize: '13px', height: '38px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColumnToggleMenu(!showColumnToggleMenu);
                  setShowStatusFilterMenu(false);
                  setShowClientFilterMenu(false);
                  setShowAssigneeFilterMenu(false);
                  setShowDateFilterMenu(false);
                }}
                title="Customize Table Columns"
              >
                <SlidersHorizontal size={14} />
                <span>Columns</span>
              </button>

              {showColumnToggleMenu && (
                <div
                  className="dropdown-menu show shadow-xl p-2 border position-absolute end-0 mt-1 rounded-3 bg-white"
                  style={{ zIndex: 110, minWidth: '190px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="small text-muted fw-bold px-2 py-1 d-block text-uppercase" style={{ fontSize: '11px' }}>
                    Toggle Columns
                  </span>
                  <hr className="dropdown-divider my-1" />
                  {Object.keys(visibleColumns).map((colKey) => (
                    <label key={colKey} className="dropdown-item rounded-2 py-1.5 px-2 d-flex align-items-center gap-2 cursor-pointer small">
                      <input
                        type="checkbox"
                        className="form-check-input m-0 cursor-pointer"
                        checked={visibleColumns[colKey]}
                        onChange={() =>
                          setVisibleColumns((prev) => ({ ...prev, [colKey]: !prev[colKey] }))
                        }
                      />
                      <span className="text-capitalize fw-semibold text-dark">{colKey.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
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
                {/* Checkbox Column */}
                <th className="py-3 px-3 text-center" style={{ width: '40px' }}>
                  <button
                    type="button"
                    className="btn btn-link p-0 border-0 text-secondary"
                    onClick={handleToggleSelectAll}
                  >
                    {isAllSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                  </button>
                </th>

                {/* 1. No. */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '50px', width: '50px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  No.
                </th>

                {/* 2. Project Name */}
                <th className="py-3 px-3 text-start" style={{ minWidth: '240px' }}>
                  <button type="button" className="sort-header-btn" onClick={() => handleSort('title')}>
                    Project Name
                    <ArrowUpDown size={12} className={sortColumn === 'title' ? 'text-primary' : 'text-muted'} />
                  </button>
                </th>

                {/* 3. Assigned to */}
                {visibleColumns.assignees && (
                  <th className="py-3 px-3 text-start" style={{ minWidth: '150px' }}>
                    <button type="button" className="sort-header-btn" onClick={() => handleSort('customer')}>
                      Assigned to
                      <ArrowUpDown size={12} className={sortColumn === 'customer' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 4. % Complete */}
                {visibleColumns.progress && (
                  <th className="py-3 px-3 text-start" style={{ minWidth: '130px' }}>
                    <button type="button" className="sort-header-btn" onClick={() => handleSort('progress')}>
                      % Complete
                      <ArrowUpDown size={12} className={sortColumn === 'progress' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 5. Start Date */}
                {visibleColumns.startDate && (
                  <th className="py-3 px-3 text-start" style={{ minWidth: '105px' }}>
                    <button type="button" className="sort-header-btn" onClick={() => handleSort('startDate')}>
                      Start Date
                      <ArrowUpDown size={12} className={sortColumn === 'startDate' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 6. Due Date */}
                {visibleColumns.dueDate && (
                  <th className="py-3 px-3 text-start" style={{ minWidth: '105px' }}>
                    <button type="button" className="sort-header-btn" onClick={() => handleSort('dueDate')}>
                      Due Date
                      <ArrowUpDown size={12} className={sortColumn === 'dueDate' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 7. Total Days */}
                {visibleColumns.totalDays && (
                  <th className="py-3 px-3 text-center" style={{ minWidth: '100px' }}>
                    <button type="button" className="sort-header-btn mx-auto" onClick={() => handleSort('totalDays')}>
                      Total Days
                      <ArrowUpDown size={12} className={sortColumn === 'totalDays' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 8. Project Submitted */}
                {visibleColumns.submittedDate && (
                  <th className="py-3 px-3 text-start" style={{ minWidth: '105px' }}>
                    <button type="button" className="sort-header-btn" onClick={() => handleSort('submittedDate')}>
                      Submitted
                      <ArrowUpDown size={12} className={sortColumn === 'submittedDate' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 9. Priority */}
                {visibleColumns.priority && (
                  <th className="py-3 px-3 text-center" style={{ minWidth: '95px' }}>
                    <button type="button" className="sort-header-btn mx-auto" onClick={() => handleSort('priority')}>
                      Priority
                      <ArrowUpDown size={12} className={sortColumn === 'priority' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 10. Status */}
                {visibleColumns.status && (
                  <th className="py-3 px-3 text-start" style={{ minWidth: '115px' }}>
                    <button type="button" className="sort-header-btn" onClick={() => handleSort('status')}>
                      Status
                      <ArrowUpDown size={12} className={sortColumn === 'status' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 11. Total Value ($) */}
                {visibleColumns.totalValue && (
                  <th className="py-3 px-3 text-start" style={{ minWidth: '135px' }}>
                    <button type="button" className="sort-header-btn" onClick={() => handleSort('totalValue')}>
                      Total Value ($)
                      <ArrowUpDown size={12} className={sortColumn === 'totalValue' ? 'text-primary' : 'text-muted'} />
                    </button>
                  </th>
                )}

                {/* 12. Actions */}
                <th className="py-3 px-3 text-center" style={{ minWidth: '100px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-5 text-muted">
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
                          setSortColumn('default');
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
                  const isSelected = selectedProjectIds.includes(prj._id);

                  return (
                    <tr
                      key={prj._id || idx}
                      className={`border-bottom ${isSelected ? 'bg-primary bg-opacity-10' : 'hover-bg-light'}`}
                      style={{ transition: 'background-color 0.15s ease' }}
                    >
                      {/* Checkbox Cell */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          className="form-check-input m-0 cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(prj._id)}
                        />
                      </td>

                      {/* 1. Sequence No */}
                      <td className="py-3 px-3 text-start fw-semibold font-monospace" style={{ fontSize: '13px', color: '#475569' }}>
                        {seqNo}.
                      </td>

                      {/* 2. Project Name */}
                      <td className="py-3 px-3 text-start">
                        <TruncatedTextCell
                          text={prj.title}
                          className="fw-bold text-dark d-inline-block text-decoration-none hover-underline"
                          style={{
                            fontSize: '14px',
                            color: '#0f172a',
                            fontFamily: "'Heebo', sans-serif",
                            fontWeight: 700,
                          }}
                          isLink={`/projects/${prj._id}`}
                        />
                      </td>

                      {/* 3. Assigned to */}
                      {visibleColumns.assignees && (
                        <td className="py-3 px-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center flex-nowrap">
                              {prj.assignees?.map((a: any, aIdx: number) => (
                                <img
                                  key={aIdx}
                                  src={a.avatarUrl || '/img/client1.jpg'}
                                  alt={a.name}
                                  className="rounded-circle border border-2 border-white shadow-sm"
                                  style={{ width: '28px', height: '28px', objectFit: 'cover', marginLeft: aIdx > 0 ? '-8px' : '0' }}
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                                />
                              ))}
                            </div>
                            <span className="fw-semibold text-dark text-truncate" style={{ fontSize: '13px', maxWidth: '100px' }}>
                              {prj.assignees?.[0]?.name || 'Leslie A.'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* 4. % Complete */}
                      {visibleColumns.progress && (
                        <td className="py-3 px-3">
                          <ProgressRing value={prj.progress} />
                        </td>
                      )}

                      {/* 5. Start Date */}
                      {visibleColumns.startDate && (
                        <td className="py-3 px-3 font-monospace text-dark" style={{ fontSize: '13px' }}>
                          {prj.startDate || '01/08/2026'}
                        </td>
                      )}

                      {/* 6. Due Date */}
                      {visibleColumns.dueDate && (
                        <td className="py-3 px-3 font-monospace text-dark" style={{ fontSize: '13px' }}>
                          {prj.dueDate}
                        </td>
                      )}

                      {/* 7. Total Days */}
                      {visibleColumns.totalDays && (
                        <td className="py-3 px-3 text-center">
                          <span className="badge rounded-pill font-monospace px-2 py-1 fw-bold" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontSize: '11.5px' }}>
                            {prj.totalDays || '15 Days'}
                          </span>
                        </td>
                      )}

                      {/* 8. Project Submitted */}
                      {visibleColumns.submittedDate && (
                        <td className="py-3 px-3 font-monospace text-muted" style={{ fontSize: '12.5px' }}>
                          {prj.submittedDate || '31/07/2026'}
                        </td>
                      )}

                      {/* 9. Priority */}
                      {visibleColumns.priority && (
                        <td className="py-3 px-3 text-center">
                          <span
                            className="badge rounded-pill px-2.5 py-1 fw-bold"
                            style={{
                              backgroundColor: prioStyle.bg,
                              color: prioStyle.color,
                              border: `1px solid ${prioStyle.border}`,
                              fontSize: '11.5px',
                            }}
                          >
                            {prj.priority || 'Medium'}
                          </span>
                        </td>
                      )}

                      {/* 10. Status */}
                      {visibleColumns.status && (
                        <td className="py-3 px-3 text-start">
                          <span
                            className="badge rounded-pill px-2.5 py-1 fw-bold d-inline-flex align-items-center gap-1.5"
                            style={{
                              backgroundColor: pill.bg,
                              color: pill.color,
                              border: `1px solid ${pill.border}`,
                              fontSize: '11.5px',
                            }}
                          >
                            <span className="rounded-circle d-inline-block" style={{ width: '6px', height: '6px', backgroundColor: pill.dot }} />
                            {prj.status}
                          </span>
                        </td>
                      )}

                      {/* 11. Total Value ($) */}
                      {visibleColumns.totalValue && (
                        <td className="py-3 px-3 text-start font-monospace fw-bold text-dark" style={{ fontSize: '13px' }}>
                          {prj.totalValue || '$87,500.00'}
                        </td>
                      )}

                      {/* 12. Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          {/* Quick Peek Drawer Button */}
                          <button
                            type="button"
                            className="btn btn-sm btn-light rounded-circle p-1 text-secondary"
                            onClick={() => setQuickDetailProject(prj)}
                            title="Quick Detail Flyout"
                          >
                            <Maximize2 size={14} />
                          </button>

                          {/* Chat Drawer Button */}
                          <button
                            type="button"
                            className="btn btn-sm btn-light rounded-circle p-1 text-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatDrawerOpen(true, prj);
                            }}
                            title="Open Chat"
                          >
                            <MessageSquare size={14} />
                          </button>

                          {/* 3 Dots Menu */}
                          <button
                            type="button"
                            className="btn btn-sm btn-light rounded-circle p-1 text-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActionsDropdownPos({
                                top: rect.bottom + 4,
                                left: Math.max(10, rect.right - 185),
                                prj,
                              });
                              setActiveActionsDropdown(isActionsOpen ? null : prj._id);
                            }}
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION & FOOTER TOOLBAR ROW */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 pt-3 border-top no-print" style={{ borderColor: '#f1f5f9' }}>
          <div className="d-flex align-items-center gap-3">
            <span className="small text-muted" style={{ fontSize: '13px' }}>
              Showing {filteredProjects.length === 0 ? 0 : (validCurrentPage - 1) * itemsPerPage + 1} to {Math.min(validCurrentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} entries
            </span>

            <div className="d-flex align-items-center gap-2 border-start ps-3">
              <span className="small text-muted" style={{ fontSize: '12.5px' }}>Per page:</span>
              <select
                className="form-select form-select-sm fw-semibold rounded-2 text-dark bg-white border"
                style={{ width: '70px', fontSize: '12.5px', borderColor: '#cbd5e1' }}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
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

      {/* QUICK DETAIL FLYOUT DRAWER */}
      {quickDetailProject && (
        <div
          className="position-fixed top-0 end-0 h-100 bg-white shadow-2xl border-start overflow-auto"
          style={{ width: '480px', maxWidth: '100vw', zIndex: 10000, backgroundColor: '#ffffff', transition: 'all 0.3s ease' }}
        >
          {/* Drawer Header */}
          <div className="p-4 bg-dark text-white d-flex align-items-center justify-content-between border-bottom border-secondary">
            <div>
              <span className="badge bg-primary bg-opacity-20 text-primary-light border border-primary border-opacity-30 rounded-pill px-2.5 py-1 small fw-bold font-monospace mb-1">
                {quickDetailProject.reference || 'PRJ-1024'}
              </span>
              <h4 className="fw-bold m-0 text-white" style={{ fontSize: '18px' }}>{quickDetailProject.title}</h4>
              <p className="text-white-50 m-0 small mt-0.5">{quickDetailProject.customer || 'Emaar Properties PJSC'}</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-light rounded-circle p-1.5"
              onClick={() => setQuickDetailProject(null)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-4 bg-light min-vh-100">
            {/* Quick Metrics Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="bg-white p-3 rounded-3 border shadow-xs">
                  <span className="text-muted small fw-semibold d-block">Completion Progress</span>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <ProgressRing value={quickDetailProject.progress || 0} size={36} strokeWidth={4} />
                    <span className="fw-bold text-dark font-monospace" style={{ fontSize: '16px' }}>{quickDetailProject.progress || 0}%</span>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-white p-3 rounded-3 border shadow-xs">
                  <span className="text-muted small fw-semibold d-block">Total Value</span>
                  <h5 className="fw-bold text-dark m-0 mt-1" style={{ fontSize: '16px' }}>{quickDetailProject.totalValue || '$87,500.00'}</h5>
                </div>
              </div>
            </div>

            {/* Info Breakdown List */}
            <div className="bg-white rounded-3 p-3.5 border shadow-xs mb-4">
              <h6 className="fw-bold text-dark mb-3 small text-uppercase tracking-wider border-bottom pb-2">Project Attributes</h6>

              <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
                <span className="text-muted small fw-medium">Status</span>
                <span className="badge rounded-pill fw-bold" style={{ backgroundColor: getStatusPill(quickDetailProject.status).bg, color: getStatusPill(quickDetailProject.status).color, border: `1px solid ${getStatusPill(quickDetailProject.status).border}` }}>
                  {quickDetailProject.status}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
                <span className="text-muted small fw-medium">Priority</span>
                <span className="badge rounded-pill fw-bold" style={{ backgroundColor: getPriorityStyle(quickDetailProject.priority).bg, color: getPriorityStyle(quickDetailProject.priority).color, border: `1px solid ${getPriorityStyle(quickDetailProject.priority).border}` }}>
                  {quickDetailProject.priority}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
                <span className="text-muted small fw-medium">Start Date</span>
                <span className="fw-bold text-dark small font-monospace">{quickDetailProject.startDate || '01/08/2026'}</span>
              </div>

              <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
                <span className="text-muted small fw-medium">Target Due Date</span>
                <span className="fw-bold text-dark small font-monospace">{quickDetailProject.dueDate || '16/08/2026'}</span>
              </div>

              <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
                <span className="text-muted small fw-medium">Total Duration</span>
                <span className="badge rounded-pill bg-light text-secondary border fw-bold small">{quickDetailProject.totalDays || '15 Days'}</span>
              </div>

              <div className="d-flex align-items-center justify-content-between py-2">
                <span className="text-muted small fw-medium">Lead Owner</span>
                <div className="d-flex align-items-center gap-1.5">
                  <UserCheck size={14} className="text-primary" />
                  <span className="fw-bold text-dark small">{quickDetailProject.assignees?.[0]?.name || 'Claire Bure'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="d-flex flex-column gap-2">
              <Link
                to={`/projects/${quickDetailProject._id}`}
                className="btn btn-primary rounded-3 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <span>Open Project Workspace</span>
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 bg-white"
                onClick={() => {
                  setChatDrawerOpen(true, quickDetailProject);
                  setQuickDetailProject(null);
                }}
              >
                <MessageSquare size={16} />
                <span>Chat with Team</span>
              </button>
            </div>
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

      {/* Project Description Quick Preview Modal */}
      {previewModalTask && (
        <ProjectDescriptionModal
          task={previewModalTask}
          onClose={() => setPreviewModalTask(null)}
        />
      )}

      {/* Add New Project Modal */}
      {showAddProjectModal && (
        <AddProjectModalPopup
          initialGroup={addProjectInitialGroup}
          onClose={() => setShowAddProjectModal(false)}
          onSave={(newProjectData) => {
            addProject(newProjectData);
          }}
        />
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
              handlePrint();
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
