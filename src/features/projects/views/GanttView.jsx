import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIconMui from '@mui/icons-material/ChevronRight';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import TableChartIcon from '@mui/icons-material/TableChart';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Building,
  Calendar,
  ChevronRight,
  Clock, DollarSign,
  Loader2,
  ShieldCheck,
  Star,
  Tag
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { apiClient } from '../../../lib/axios';
import './gantt.css';

// Formats date range as requested: "Nov 01' 26 - Dec 15' 27"
export const formatGanttBarDateRange = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return '';
  const dStart = new Date(startDateStr + 'T00:00:00');
  const dEnd = new Date(endDateStr + 'T23:59:59');
  if (isNaN(dStart.getTime()) || isNaN(dEnd.getTime())) return '';

  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const mStart = monthNamesShort[dStart.getMonth()];
  const dayStart = String(dStart.getDate()).padStart(2, '0');
  const yrStart = String(dStart.getFullYear()).slice(-2);

  const mEnd = monthNamesShort[dEnd.getMonth()];
  const dayEnd = String(dEnd.getDate()).padStart(2, '0');
  const yrEnd = String(dEnd.getFullYear()).slice(-2);

  return `${mStart} ${dayStart}' ${yrStart} - ${mEnd} ${dayEnd}' ${yrEnd}`;
};

export const GanttView = ({ tasks = [], onTaskClick }) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedScale, setSelectedScale] = useState('Month'); // 'Days' | 'Month' | 'Quarter' | 'Year'

  // Gantt Search & Filter States
  const [ganttSearch, setGanttSearch] = useState('');
  const [ganttStatusFilter, setGanttStatusFilter] = useState('ALL');
  const [ganttGroupFilter, setGanttGroupFilter] = useState('ALL');
  const [ganttPriorityFilter, setGanttPriorityFilter] = useState('ALL');
  const [ganttAssigneeFilter, setGanttAssigneeFilter] = useState('ALL');
  const [ganttSortBy, setGanttSortBy] = useState('DEFAULT');

  // Critical Path Focus Toggle
  const [highlightCriticalPath, setHighlightCriticalPath] = useState(false);

  // Tree Expansion States (Default closed until user clicks to open)
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedMilestones, setExpandedMilestones] = useState({});

  // Async API Loading States & Cached Maps
  const [loadingProjects, setLoadingProjects] = useState({});
  const [loadingMilestones, setLoadingMilestones] = useState({});
  const [fetchedMilestonesMap, setFetchedMilestonesMap] = useState({});
  const [fetchedTasksMap, setFetchedTasksMap] = useState({});

  // Floating Premium Tooltip Mouse Tracker State
  const [tooltipData, setTooltipData] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Dynamic Today Button Text Generator
  const getTodayButtonText = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthShort = now.toLocaleDateString('en-US', { month: 'short' });
    const year = now.getFullYear();
    return `Today (${day} ${monthShort} ${year})`;
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  };

  // Rich, Unique Hierarchical Projects -> Milestones -> Tasks with distinct project color schemes
  const defaultHierarchicalData = [
    {
      id: 'proj-1',
      reference: 'PRJ-1024',
      title: 'Emaar Beachfront Tower 1',
      type: 'PROJECT',
      group: 'Research',
      startDate: '2026-11-01',
      endDate: '2027-12-15',
      range: '01 Nov 2026 - 15 Dec 2027',
      duration: '410 Days',
      percentage: '75%',
      status: 'On Track',
      plannedBudget: 'AED 500,000',
      actualBudget: 'AED 350,000',
      barColor: '#d97706', // Amber Gold
      criticalPath: true,
      domainLead: { name: 'Nicholas Amazon', role: 'Senior Project Lead', avatar: '/img/client1.jpg' },
      milestones: [
        {
          id: 'm1-1',
          code: 'MS-101',
          title: 'Milestone 01: Geotechnical Soil & Foundation',
          type: 'MILESTONE',
          startDate: '2026-11-01',
          endDate: '2027-01-15',
          range: '01 Nov 2026 - 15 Jan 2027',
          duration: '76 Days',
          percentage: '100%',
          status: 'Approved',
          plannedBudget: 'AED 150,000',
          actualBudget: 'AED 140,000',
          barColor: '#f59e0b',
          criticalPath: true,
          lead: { name: 'Claire Bure', role: 'Technical Lead', avatar: '/img/client1.jpg' },
          tasks: [
            {
              id: 't1-1-1',
              code: 'TSK-201',
              title: 'Task 1.1: Soil Boring & Analysis',
              type: 'TASK',
              startDate: '2026-11-01',
              endDate: '2026-12-15',
              range: '01 Nov 2026 - 15 Dec 2026',
              duration: '45 Days',
              percentage: '100%',
              status: 'Approved',
              priority: 'High',
              plannedBudget: 'AED 50,000',
              actualBudget: 'AED 48,000',
              barColor: '#b45309',
              criticalPath: true,
              assignee: { name: 'Ajmal Khan', role: 'Governance Lead', avatar: '/img/client2.jpg' },
            },
            {
              id: 't1-1-2',
              code: 'TSK-202',
              title: 'Task 1.2: Foundation Reinforcement Inspection',
              type: 'TASK',
              startDate: '2026-12-16',
              endDate: '2027-01-15',
              range: '16 Dec 2026 - 15 Jan 2027',
              duration: '31 Days',
              percentage: '100%',
              status: 'Approved',
              priority: 'Critical',
              plannedBudget: 'AED 100,000',
              actualBudget: 'AED 92,000',
              barColor: '#b45309',
              criticalPath: true,
              assignee: { name: 'Logan Harrington', role: 'Domain Lead', avatar: '/img/client3.jpg' },
            },
          ],
        },
        {
          id: 'm1-2',
          code: 'MS-102',
          title: 'Milestone 02: Structural Framing & Pouring',
          type: 'MILESTONE',
          startDate: '2027-01-16',
          endDate: '2027-06-30',
          range: '16 Jan 2027 - 30 Jun 2027',
          duration: '165 Days',
          percentage: '50%',
          status: 'In Progress',
          plannedBudget: 'AED 350,000',
          actualBudget: 'AED 210,000',
          barColor: '#f59e0b',
          criticalPath: false,
          lead: { name: 'Leonard Campbell', role: 'Infrastructure Lead', avatar: '/img/client3.jpg' },
          tasks: [
            {
              id: 't1-2-1',
              code: 'TSK-203',
              title: 'Task 2.1: Column Steel Shoring',
              type: 'TASK',
              startDate: '2027-01-16',
              endDate: '2027-03-31',
              range: '16 Jan 2027 - 31 Mar 2027',
              duration: '75 Days',
              percentage: '50%',
              status: 'In Progress',
              priority: 'Medium',
              plannedBudget: 'AED 200,000',
              actualBudget: 'AED 110,000',
              barColor: '#b45309',
              criticalPath: false,
              assignee: { name: 'Claire Bure', role: 'Technical Lead', avatar: '/img/client1.jpg' },
            },
            {
              id: 't1-2-2',
              code: 'TSK-204',
              title: 'Task 2.2: Concrete Slab Pouring',
              type: 'TASK',
              startDate: '2027-04-01',
              endDate: '2027-06-30',
              range: '01 Apr 2027 - 30 Jun 2027',
              duration: '90 Days',
              percentage: '30%',
              status: 'In Progress',
              priority: 'High',
              plannedBudget: 'AED 150,000',
              actualBudget: 'AED 100,000',
              barColor: '#b45309',
              criticalPath: false,
              assignee: { name: 'Ajmal Khan', role: 'Governance Lead', avatar: '/img/client2.jpg' },
            },
          ],
        },
        {
          id: 'm1-3',
          code: 'MS-103',
          title: 'Milestone 03: Facade & MEP Handover',
          type: 'MILESTONE',
          startDate: '2027-07-01',
          endDate: '2027-12-15',
          range: '01 Jul 2027 - 15 Dec 2027',
          duration: '168 Days',
          percentage: '0%',
          status: 'Planned',
          plannedBudget: 'AED 200,000',
          actualBudget: 'AED 0',
          barColor: '#f59e0b',
          criticalPath: false,
          lead: { name: 'Nicholas Amazon', role: 'Senior Project Lead', avatar: '/img/client1.jpg' },
          tasks: [
            {
              id: 't1-3-1',
              code: 'TSK-205',
              title: 'Task 3.1: Exterior Glass Curtain Installation',
              type: 'TASK',
              startDate: '2027-07-01',
              endDate: '2027-09-30',
              range: '01 Jul 2027 - 30 Sep 2027',
              duration: '92 Days',
              percentage: '0%',
              status: 'Planned',
              priority: 'Medium',
              plannedBudget: 'AED 120,000',
              actualBudget: 'AED 0',
              barColor: '#b45309',
              criticalPath: false,
              assignee: { name: 'Logan Harrington', role: 'Domain Lead', avatar: '/img/client3.jpg' },
            },
            {
              id: 't1-3-2',
              code: 'TSK-206',
              title: 'Task 3.2: HVAC Commissioning & Signoff',
              type: 'TASK',
              startDate: '2027-10-01',
              endDate: '2027-12-15',
              range: '01 Oct 2027 - 15 Dec 2027',
              duration: '76 Days',
              percentage: '0%',
              status: 'Planned',
              priority: 'Low',
              plannedBudget: 'AED 80,000',
              actualBudget: 'AED 0',
              barColor: '#b45309',
              criticalPath: false,
              assignee: { name: 'Claire Bure', role: 'Technical Lead', avatar: '/img/client1.jpg' },
            },
          ],
        },
      ],
    },
    {
      id: 'proj-2',
      reference: 'PRJ-2088',
      title: 'Dubai Creek Harbour Residences Phase II',
      type: 'PROJECT',
      group: 'Wireframe',
      startDate: '2026-10-15',
      endDate: '2027-08-30',
      range: '15 Oct 2026 - 30 Aug 2027',
      duration: '319 Days',
      percentage: '60%',
      status: 'In Progress',
      plannedBudget: 'AED 1,200,000',
      actualBudget: 'AED 720,000',
      barColor: '#2563eb', // Royal Blue
      criticalPath: false,
      domainLead: { name: 'Claire Bure', role: 'Technical Lead', avatar: '/img/client1.jpg' },
      milestones: [
        {
          id: 'm2-1',
          code: 'MS-201',
          title: 'Milestone 01: Waterfront Promenade Piling',
          type: 'MILESTONE',
          startDate: '2026-10-15',
          endDate: '2027-02-28',
          range: '15 Oct 2026 - 28 Feb 2027',
          duration: '136 Days',
          percentage: '85%',
          status: 'In Progress',
          plannedBudget: 'AED 600,000',
          actualBudget: 'AED 480,000',
          barColor: '#3b82f6',
          criticalPath: false,
          lead: { name: 'Ajmal Khan', role: 'Governance Lead', avatar: '/img/client2.jpg' },
          tasks: [
            {
              id: 't2-1-1',
              code: 'TSK-301',
              title: 'Task 1.1: Marine Sheet Piling',
              type: 'TASK',
              startDate: '2026-10-15',
              endDate: '2026-12-31',
              range: '15 Oct 2026 - 31 Dec 2026',
              duration: '77 Days',
              percentage: '100%',
              status: 'Approved',
              priority: 'High',
              plannedBudget: 'AED 350,000',
              actualBudget: 'AED 320,000',
              barColor: '#1d4ed8',
              criticalPath: false,
              assignee: { name: 'Nicholas Amazon', role: 'Senior Project Lead', avatar: '/img/client1.jpg' },
            },
            {
              id: 't2-1-2',
              code: 'TSK-302',
              title: 'Task 1.2: Promenade Deck Curing',
              type: 'TASK',
              startDate: '2027-01-01',
              endDate: '2027-02-28',
              range: '01 Jan 2027 - 28 Feb 2027',
              duration: '59 Days',
              percentage: '70%',
              status: 'In Progress',
              priority: 'Medium',
              plannedBudget: 'AED 250,000',
              actualBudget: 'AED 160,000',
              barColor: '#1d4ed8',
              criticalPath: false,
              assignee: { name: 'Logan Harrington', role: 'Domain Lead', avatar: '/img/client3.jpg' },
            },
          ],
        },
      ],
    },
    {
      id: 'proj-3',
      reference: 'PRJ-3045',
      title: 'Downtown Dubai Luxury Retail Expansion',
      type: 'PROJECT',
      group: 'Visual Studio',
      startDate: '2026-12-01',
      endDate: '2027-11-30',
      range: '01 Dec 2026 - 30 Nov 2027',
      duration: '364 Days',
      percentage: '40%',
      status: 'At Risk',
      plannedBudget: 'AED 850,000',
      actualBudget: 'AED 340,000',
      barColor: '#059669', // Emerald Green
      criticalPath: true,
      domainLead: { name: 'Logan Harrington', role: 'Domain Lead', avatar: '/img/client3.jpg' },
      milestones: [
        {
          id: 'm3-1',
          code: 'MS-301',
          title: 'Milestone 01: Retail Plaza Underground Utilities',
          type: 'MILESTONE',
          startDate: '2026-12-01',
          endDate: '2027-04-30',
          range: '01 Dec 2026 - 30 Apr 2027',
          duration: '150 Days',
          percentage: '40%',
          status: 'At Risk',
          plannedBudget: 'AED 400,000',
          actualBudget: 'AED 200,000',
          barColor: '#10b981',
          criticalPath: true,
          lead: { name: 'Claire Bure', role: 'Technical Lead', avatar: '/img/client1.jpg' },
          tasks: [
            {
              id: 't3-1-1',
              code: 'TSK-401',
              title: 'Task 1.1: Sewer & Electrical Conduit Excavation',
              type: 'TASK',
              startDate: '2026-12-01',
              endDate: '2027-02-15',
              range: '01 Dec 2026 - 15 Feb 2027',
              duration: '76 Days',
              percentage: '50%',
              status: 'At Risk',
              priority: 'Critical',
              plannedBudget: 'AED 250,000',
              actualBudget: 'AED 150,000',
              barColor: '#047857',
              criticalPath: true,
              assignee: { name: 'Ajmal Khan', role: 'Governance Lead', avatar: '/img/client2.jpg' },
            },
          ],
        },
      ],
    },
  ];

  // Dynamically map flat tasks from store into deduplicated Gantt tree structure
  const allProjectsRaw = useMemo(() => {
    const combined = [...defaultHierarchicalData];
    const existingTitles = new Set(defaultHierarchicalData.map((p) => p.title.toLowerCase()));

    if (Array.isArray(tasks) && tasks.length > 0) {
      tasks.forEach((t, idx) => {
        const titleLower = (t.title || '').toLowerCase();
        if (t.title && !existingTitles.has(titleLower)) {
          existingTitles.add(titleLower);
          combined.push({
            id: t._id || `store-proj-${idx}`,
            reference: `PRJ-${4000 + idx}`,
            title: t.title,
            type: 'PROJECT',
            group: t.group || 'Development',
            startDate: t.plannedDate ? '2026-11-01' : '2026-11-15',
            endDate: t.actualDate ? '2027-06-30' : '2027-10-15',
            range: '01 Nov 2026 - 30 Jun 2027',
            duration: '240 Days',
            percentage: `${t.progress || 35}%`,
            status: t.status || 'In Progress',
            plannedBudget: t.plannedBudget || 'AED 250,000',
            actualBudget: t.actualBudget || 'AED 100,000',
            barColor: '#7c3aed',
            criticalPath: idx % 2 === 0,
            domainLead: { name: 'Claire Bure', role: 'Technical Lead', avatar: '/img/client1.jpg' },
            milestones: [
              {
                id: `store-m-${idx}`,
                code: `MS-${500 + idx}`,
                title: `${t.title} - Phase 1 Delivery`,
                type: 'MILESTONE',
                startDate: '2026-11-01',
                endDate: '2027-03-31',
                range: '01 Nov 2026 - 31 Mar 2027',
                duration: '150 Days',
                percentage: `${t.progress || 35}%`,
                status: t.status || 'In Progress',
                plannedBudget: t.plannedBudget || 'AED 150,000',
                actualBudget: t.actualBudget || 'AED 50,000',
                barColor: '#8b5cf6',
                criticalPath: idx % 2 === 0,
                lead: { name: 'Ajmal Khan', role: 'Governance Lead', avatar: '/img/client2.jpg' },
                tasks: [
                  {
                    id: `store-t-${idx}`,
                    code: `TSK-${600 + idx}`,
                    title: `${t.title} - Operational Execution`,
                    type: 'TASK',
                    startDate: '2026-11-01',
                    endDate: '2027-01-31',
                    range: '01 Nov 2026 - 31 Jan 2027',
                    duration: '91 Days',
                    percentage: `${t.progress || 35}%`,
                    status: t.status || 'In Progress',
                    priority: t.priority || 'Medium',
                    plannedBudget: t.plannedBudget || 'AED 100,000',
                    actualBudget: t.actualBudget || 'AED 40,000',
                    barColor: '#6d28d9',
                    criticalPath: idx % 2 === 0,
                    assignee: t.assignees && t.assignees[0]
                      ? { name: t.assignees[0].name, role: 'Assignee', avatar: t.assignees[0].avatarUrl || '/img/client1.jpg' }
                      : { name: 'Ajmal Khan', role: 'Governance Lead', avatar: '/img/client2.jpg' },
                  },
                ],
              },
            ],
          });
        }
      });
    }

    return combined;
  }, [tasks]);

  // Apply Search & Filter & Sort criteria to projects
  const projectsData = useMemo(() => {
    let filtered = allProjectsRaw.filter((proj) => {
      if (ganttSearch) {
        const q = ganttSearch.toLowerCase();
        const matchTitle = proj.title ? proj.title.toLowerCase().includes(q) : false;
        const matchGroup = proj.group ? proj.group.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchGroup) return false;
      }
      if (ganttStatusFilter !== 'ALL') {
        const matchProj = proj.status === ganttStatusFilter;
        const matchChild = proj.milestones && proj.milestones.some((m) =>
          m.status === ganttStatusFilter || (m.tasks && m.tasks.some((t) => t.status === ganttStatusFilter))
        );
        if (!matchProj && !matchChild) return false;
      }
      if (ganttGroupFilter !== 'ALL') {
        if (proj.group !== ganttGroupFilter) return false;
      }
      if (ganttPriorityFilter !== 'ALL') {
        const matchChildPriority = proj.milestones && proj.milestones.some((m) =>
          m.tasks && m.tasks.some((t) => (t.priority || '').toLowerCase() === ganttPriorityFilter.toLowerCase())
        );
        if (!matchChildPriority) return false;
      }
      if (ganttAssigneeFilter !== 'ALL') {
        const matchAssignee = proj.domainLead && proj.domainLead.name === ganttAssigneeFilter;
        const matchChildAssignee = proj.milestones && proj.milestones.some((m) =>
          (m.lead && m.lead.name === ganttAssigneeFilter) ||
          (m.tasks && m.tasks.some((t) => t.assignee && t.assignee.name === ganttAssigneeFilter))
        );
        if (!matchAssignee && !matchChildAssignee) return false;
      }
      return true;
    });

    if (ganttSortBy === 'PRIORITY') {
      filtered.sort((a, b) => (b.criticalPath ? 1 : 0) - (a.criticalPath ? 1 : 0));
    } else if (ganttSortBy === 'DUE_DATE') {
      filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (ganttSortBy === 'TITLE') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return filtered;
  }, [allProjectsRaw, ganttSearch, ganttStatusFilter, ganttGroupFilter, ganttPriorityFilter, ganttAssigneeFilter, ganttSortBy]);

  // Async API Re-fetching Toggle Handlers for Projects and Milestones
  const toggleProject = useCallback(async (projId) => {
    if (expandedProjects[projId]) {
      setExpandedProjects((prev) => ({ ...prev, [projId]: false }));
      return;
    }

    if (!fetchedMilestonesMap[projId]) {
      setLoadingProjects((prev) => ({ ...prev, [projId]: true }));
      try {
        const res = await apiClient.get(`/projects/${projId}/milestones`).catch(() => null);
        if (res && Array.isArray(res.milestones)) {
          setFetchedMilestonesMap((prev) => ({ ...prev, [projId]: res.milestones }));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 320));
          const projectItem = projectsData.find((p) => p.id === projId);
          if (projectItem && projectItem.milestones) {
            setFetchedMilestonesMap((prev) => ({ ...prev, [projId]: projectItem.milestones }));
          }
        }
      } finally {
        setLoadingProjects((prev) => ({ ...prev, [projId]: false }));
      }
    }

    setExpandedProjects((prev) => ({ ...prev, [projId]: true }));
  }, [expandedProjects, fetchedMilestonesMap, projectsData]);

  const toggleMilestone = useCallback(async (mileId) => {
    if (expandedMilestones[mileId]) {
      setExpandedMilestones((prev) => ({ ...prev, [mileId]: false }));
      return;
    }

    if (!fetchedTasksMap[mileId]) {
      setLoadingMilestones((prev) => ({ ...prev, [mileId]: true }));
      try {
        const res = await apiClient.get(`/milestones/${mileId}/tasks`).catch(() => null);
        if (res && Array.isArray(res.tasks)) {
          setFetchedTasksMap((prev) => ({ ...prev, [mileId]: res.tasks }));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 320));
          let foundTasks = [];
          projectsData.forEach((p) => {
            if (p.milestones) {
              const match = p.milestones.find((m) => m.id === mileId);
              if (match && match.tasks) foundTasks = match.tasks;
            }
          });
          setFetchedTasksMap((prev) => ({ ...prev, [mileId]: foundTasks }));
        }
      } finally {
        setLoadingMilestones((prev) => ({ ...prev, [mileId]: false }));
      }
    }

    setExpandedMilestones((prev) => ({ ...prev, [mileId]: true }));
  }, [expandedMilestones, fetchedTasksMap, projectsData]);

  // Timeline Navigation Handlers
  const handlePrev = () => {
    if (selectedScale === 'Days') {
      if (selectedMonth > 0) {
        setSelectedMonth(selectedMonth - 1);
      } else if (selectedYear > 1990) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(11);
      }
    } else {
      setSelectedYear(Math.max(1990, selectedYear - 1));
    }
  };

  const handleNext = () => {
    if (selectedScale === 'Days') {
      if (selectedMonth < 11) {
        setSelectedMonth(selectedMonth + 1);
      } else if (selectedYear < 2100) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(0);
      }
    } else {
      setSelectedYear(Math.min(2100, selectedYear + 1));
    }
  };

  // Generate Year dropdown options (1990 - 2100)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = 1990; y <= 2100; y++) {
      years.push(y);
    }
    return years;
  }, []);

  // Compute Days for Selected Month & Year
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Timeline Header Renderer based on selected view scale
  const renderScaleHeaders = () => {
    if (selectedScale === 'Days') {
      const totalDays = getDaysInMonth(selectedYear, selectedMonth);
      const cols = [];
      for (let d = 1; d <= totalDays; d++) {
        const dateObj = new Date(selectedYear, selectedMonth, d);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
        cols.push(
          <th
            key={d}
            className={`text-center align-middle border-end ${isWeekend ? 'bg-light text-muted' : ''}`}
            style={{ minWidth: '32px', width: '32px', fontSize: '11px', padding: '4px 0' }}
          >
            <div className="fw-normal text-secondary">{dayName}</div>
            <div className="fw-bold text-dark">{d}</div>
          </th>
        );
      }
      return cols;
    }

    if (selectedScale === 'Month') {
      const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return shortMonths.map((m, idx) => (
        <th
          key={m}
          className={`text-center align-middle border-end ${idx === currentDate.getMonth() && selectedYear === currentDate.getFullYear() ? 'bg-primary-subtle text-primary' : ''}`}
          style={{ minWidth: '70px', fontSize: '12px' }}
        >
          <div className="fw-bold">{m}</div>
          <div className="text-secondary fw-normal" style={{ fontSize: '10px' }}>{selectedYear}</div>
        </th>
      ));
    }

    if (selectedScale === 'Quarter') {
      const quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
      return quarters.map((q) => (
        <th key={q} className="text-center align-middle border-end" style={{ minWidth: '140px', fontSize: '12px' }}>
          <div className="fw-bold text-dark">{q}</div>
          <div className="text-secondary fw-normal" style={{ fontSize: '10.5px' }}>{selectedYear}</div>
        </th>
      ));
    }

    if (selectedScale === 'Year') {
      const yearsRange = [selectedYear - 1, selectedYear, selectedYear + 1, selectedYear + 2];
      return yearsRange.map((y) => (
        <th key={y} className="text-center align-middle border-end" style={{ minWidth: '160px', fontSize: '13px' }}>
          <div className="fw-bold text-dark">{y}</div>
          <div className="text-secondary fw-normal" style={{ fontSize: '11px' }}>Full Year Timeline</div>
        </th>
      ));
    }

    return null;
  };

  // Helper to compute Total Columns in Scale Header
  const totalCols = useMemo(() => {
    if (selectedScale === 'Days') return getDaysInMonth(selectedYear, selectedMonth);
    if (selectedScale === 'Month') return 12;
    if (selectedScale === 'Quarter') return 4;
    if (selectedScale === 'Year') return 4;
    return 12;
  }, [selectedScale, selectedYear, selectedMonth]);

  // Calculate Bar Position & Width based on Date Range and Scale
  const calculateBarPosition = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return { leftPct: 0, widthPct: 0 };
    const dStart = new Date(startDateStr + 'T00:00:00');
    const dEnd = new Date(endDateStr + 'T23:59:59');

    if (selectedScale === 'Days') {
      const totalDays = getDaysInMonth(selectedYear, selectedMonth);
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = new Date(selectedYear, selectedMonth, totalDays, 23, 59, 59);

      if (dEnd < monthStart || dStart > monthEnd) return { leftPct: 0, widthPct: 0, visible: false };

      const clampStart = dStart < monthStart ? monthStart : dStart;
      const clampEnd = dEnd > monthEnd ? monthEnd : dEnd;

      const startDay = clampStart.getDate();
      const endDay = clampEnd.getDate();

      const leftPct = ((startDay - 1) / totalDays) * 100;
      const widthPct = Math.max(3, ((endDay - startDay + 1) / totalDays) * 100);

      return { leftPct, widthPct, visible: true };
    }

    if (selectedScale === 'Month') {
      const yearStart = new Date(selectedYear, 0, 1);
      const yearEnd = new Date(selectedYear, 11, 31, 23, 59, 59);

      if (dEnd < yearStart || dStart > yearEnd) return { leftPct: 0, widthPct: 0, visible: false };

      const clampStart = dStart < yearStart ? yearStart : dStart;
      const clampEnd = dEnd > yearEnd ? yearEnd : dEnd;

      const startMonthIndex = clampStart.getMonth() + clampStart.getDate() / 30;
      const endMonthIndex = clampEnd.getMonth() + clampEnd.getDate() / 30;

      const leftPct = (startMonthIndex / 12) * 100;
      const widthPct = Math.max(4, ((endMonthIndex - startMonthIndex) / 12) * 100);

      return { leftPct, widthPct, visible: true };
    }

    if (selectedScale === 'Quarter') {
      const yearStart = new Date(selectedYear, 0, 1);
      const yearEnd = new Date(selectedYear, 11, 31, 23, 59, 59);

      if (dEnd < yearStart || dStart > yearEnd) return { leftPct: 0, widthPct: 0, visible: false };

      const clampStart = dStart < yearStart ? yearStart : dStart;
      const clampEnd = dEnd > yearEnd ? yearEnd : dEnd;

      const startQ = (clampStart.getMonth() / 12) * 4;
      const endQ = ((clampEnd.getMonth() + 1) / 12) * 4;

      const leftPct = (startQ / 4) * 100;
      const widthPct = Math.max(5, ((endQ - startQ) / 4) * 100);

      return { leftPct, widthPct, visible: true };
    }

    if (selectedScale === 'Year') {
      const startRange = selectedYear - 1;
      const rangeStart = new Date(startRange, 0, 1);
      const rangeEnd = new Date(startRange + 3, 11, 31, 23, 59, 59);

      if (dEnd < rangeStart || dStart > rangeEnd) return { leftPct: 0, widthPct: 0, visible: false };

      const clampStart = dStart < rangeStart ? rangeStart : dStart;
      const clampEnd = dEnd > rangeEnd ? rangeEnd : dEnd;

      const totalYearSpan = 4;
      const startYearOffset = clampStart.getFullYear() - startRange + clampStart.getMonth() / 12;
      const endYearOffset = clampEnd.getFullYear() - startRange + (clampEnd.getMonth() + 1) / 12;

      const leftPct = (startYearOffset / totalYearSpan) * 100;
      const widthPct = Math.max(5, ((endYearOffset - startYearOffset) / totalYearSpan) * 100);

      return { leftPct, widthPct, visible: true };
    }

    return { leftPct: 0, widthPct: 0, visible: false };
  };

  // Flatten Hierarchical Data with Loading Row states for Async API fetch
  const flatRows = useMemo(() => {
    const rows = [];
    projectsData.forEach((proj) => {
      rows.push({
        ...proj,
        isProject: true,
        level: 0,
      });

      if (loadingProjects[proj.id]) {
        rows.push({
          id: `loading-proj-${proj.id}`,
          isLoader: true,
          label: `Fetching milestones for ${proj.title}...`,
          level: 1,
        });
      } else if (expandedProjects[proj.id]) {
        const milestones = fetchedMilestonesMap[proj.id] || proj.milestones || [];
        milestones.forEach((mile) => {
          rows.push({
            ...mile,
            isMilestone: true,
            projectId: proj.id,
            level: 1,
          });

          if (loadingMilestones[mile.id]) {
            rows.push({
              id: `loading-mile-${mile.id}`,
              isLoader: true,
              label: `Loading tasks for ${mile.title}...`,
              level: 2,
            });
          } else if (expandedMilestones[mile.id]) {
            const tasksList = fetchedTasksMap[mile.id] || mile.tasks || [];
            tasksList.forEach((task) => {
              rows.push({
                ...task,
                isTask: true,
                milestoneId: mile.id,
                projectId: proj.id,
                level: 2,
              });
            });
          }
        });
      }
    });

    return rows;
  }, [projectsData, expandedProjects, expandedMilestones, loadingProjects, loadingMilestones, fetchedMilestonesMap, fetchedTasksMap]);

  // Handle Export Gantt to Excel with Graphical Timeline Column
  const exportToExcelWithGraph = () => {
    let csv = 'Level,Type,Reference Code,Title,Start Date,End Date,Range,Duration,Progress,Status,Planned Budget,Actual Budget,Critical Path,Assignee / Lead,Graphical Timeline\n';

    flatRows.forEach((r) => {
      if (r.isLoader) return;
      const typeStr = r.isProject ? 'PROJECT' : r.isMilestone ? 'MILESTONE' : 'TASK';
      const refCode = r.reference || r.code || '';
      const titleClean = (r.title || '').replace(/"/g, '""');
      const start = r.startDate || '';
      const end = r.endDate || '';
      const range = formatGanttBarDateRange(start, end);
      const dur = r.duration || '';
      const pct = r.percentage || '0%';
      const status = r.status || '';
      const pBudget = r.plannedBudget || '';
      const aBudget = r.actualBudget || '';
      const isCrit = r.criticalPath ? 'YES' : 'NO';
      const leadName = r.domainLead?.name || r.lead?.name || r.assignee?.name || '';

      const pos = calculateBarPosition(start, end);
      let graphBar = '[                                                  ]';
      if (pos.visible) {
        const totalCharLength = 50;
        const startIdx = Math.max(0, Math.floor((pos.leftPct / 100) * totalCharLength));
        const fillLength = Math.max(1, Math.floor((pos.widthPct / 100) * totalCharLength));
        const charArray = new Array(totalCharLength).fill(' ');
        for (let i = startIdx; i < Math.min(totalCharLength, startIdx + fillLength); i++) {
          charArray[i] = '█';
        }
        graphBar = `[${charArray.join('')}]`;
      }

      csv += `"${r.level}","${typeStr}","${refCode}","${titleClean}","${start}","${end}","${range}","${dur}","${pct}","${status}","${pBudget}","${aBudget}","${isCrit}","${leadName}","${graphBar}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Emaar_Gantt_Chart_Timeline_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Print / PDF Export
  const handlePrintGantt = () => {
    window.print();
  };

  // Floating Tooltip Mouse Tracker Handlers
  const handleBarMouseMove = (e, item) => {
    const posX = e.clientX + 16;
    const posY = e.clientY + 16;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const adjustedX = posX + 340 > windowWidth ? windowWidth - 340 : posX;
    const adjustedY = posY + 260 > windowHeight ? windowHeight - 270 : posY;

    setTooltipData({ item, x: adjustedX, y: adjustedY });
  };

  const handleBarMouseLeave = () => {
    setTooltipData(null);
  };

  const isFiltered = ganttSearch || ganttStatusFilter !== 'ALL' || ganttGroupFilter !== 'ALL' || ganttPriorityFilter !== 'ALL' || ganttAssigneeFilter !== 'ALL' || ganttSortBy !== 'DEFAULT' || highlightCriticalPath;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Material UI Filters & Controls Toolbar */}
      <Paper elevation={0} sx={{ p: 2, mb: 2.5, border: '1px solid #e2e8f0', borderRadius: 3, backgroundColor: '#ffffff' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justify: 'space-between', justifyContent: 'space-between', gap: 2 }}>
          {/* Search TextField */}
          <TextField
            size="small"
            placeholder="Search Gantt projects, milestones..."
            value={ganttSearch}
            onChange={(e) => setGanttSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { height: 38 } }}
          />

          {/* Filter Controls Stack */}
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            {/* Priority Filter */}
            <FormControl size="small" sx={{ minWidth: 135 }}>
              <Select
                value={ganttPriorityFilter}
                onChange={(e) => setGanttPriorityFilter(e.target.value)}
                sx={{ height: 38, fontWeight: 600, color: ganttPriorityFilter !== 'ALL' ? 'primary.main' : 'text.primary' }}
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value="Critical">🔴 Critical</MenuItem>
                <MenuItem value="High">🟠 High</MenuItem>
                <MenuItem value="Medium">🔵 Medium</MenuItem>
                <MenuItem value="Low">🟢 Low</MenuItem>
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                value={ganttStatusFilter}
                onChange={(e) => setGanttStatusFilter(e.target.value)}
                sx={{ height: 38, fontWeight: 600, color: ganttStatusFilter !== 'ALL' ? 'primary.main' : 'text.primary' }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="On Track">On Track</MenuItem>
                <MenuItem value="At Risk">At Risk</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Planned">Planned</MenuItem>
              </Select>
            </FormControl>

            {/* Critical Path Toggle Button */}
            <Button
              variant={highlightCriticalPath ? 'contained' : 'outlined'}
              color="warning"
              size="small"
              startIcon={highlightCriticalPath ? <StarIcon fontSize="small" /> : <StarOutlineIcon fontSize="small" />}
              onClick={() => setHighlightCriticalPath(!highlightCriticalPath)}
              sx={{ height: 38, fontWeight: 700, px: 2 }}
            >
              {highlightCriticalPath ? 'Critical Active' : 'Critical Path'}
            </Button>

            {isFiltered && (
              <Button
                size="small"
                color="error"
                startIcon={<FilterListOffIcon fontSize="small" />}
                onClick={() => {
                  setGanttSearch('');
                  setGanttStatusFilter('ALL');
                  setGanttGroupFilter('ALL');
                  setGanttPriorityFilter('ALL');
                  setGanttAssigneeFilter('ALL');
                  setGanttSortBy('DEFAULT');
                  setHighlightCriticalPath(false);
                }}
                sx={{ fontWeight: 600 }}
              >
                Reset
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Date & Scale Controls Bar with Export & Print */}
      <Paper elevation={0} sx={{ p: 2, mb: 2.5, border: '1px solid #e2e8f0', borderRadius: 3, backgroundColor: '#ffffff' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          {/* Left Controls: Timeline Navigator */}
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.secondary', mr: 1, fontSize: '0.9375rem' }}>
              Timeline Navigator
            </Typography>

            <Tooltip title="Previous period">
              <IconButton size="small" onClick={handlePrev} sx={{ border: '1px solid #cbd5e1', width: 34, height: 34 }}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {selectedScale === 'Days' && (
              <FormControl size="small" sx={{ width: 115 }}>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  sx={{ height: 34, fontWeight: 700, color: 'primary.main' }}
                >
                  {monthNames.map((m, idx) => (
                    <MenuItem key={idx} value={idx}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl size="small" sx={{ width: 95 }}>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                sx={{ height: 34, fontWeight: 700, color: 'primary.main' }}
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Next period">
              <IconButton size="small" onClick={handleNext} sx={{ border: '1px solid #cbd5e1', width: 34, height: 34 }}>
                <ChevronRightIconMui fontSize="small" />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleJumpToToday}
              sx={{ height: 34, fontWeight: 600, px: 2 }}
            >
              {getTodayButtonText()}
            </Button>
          </Stack>

          {/* Right Action Controls: Export Excel | Print | View Scale */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<TableChartIcon fontSize="small" />}
              onClick={exportToExcelWithGraph}
              sx={{ height: 34, fontWeight: 700, px: 2 }}
            >
              Export Excel
            </Button>

            <Tooltip title="Print or Export Gantt Chart to PDF">
              <IconButton
                size="small"
                onClick={handlePrintGantt}
                sx={{ border: '1px solid #cbd5e1', width: 34, height: 34 }}
              >
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                View Scale:
              </Typography>
              <FormControl size="small" sx={{ width: 110 }}>
                <Select
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  sx={{ height: 34, fontWeight: 700, color: 'primary.main' }}
                >
                  <MenuItem value="Days">Days</MenuItem>
                  <MenuItem value="Month">Month</MenuItem>
                  <MenuItem value="Quarter">Quarter</MenuItem>
                  <MenuItem value="Year">Year</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Gantt Chart Table Canvas Area */}
      <div id="benefits2" className="gantt-table-wrapper table-responsive bg-white rounded shadow-sm border p-2">
        <table className="table tablegantt align-middle m-0">
          <thead>
            <tr className="bg-light">
              <th className="thspace text-start border-end" style={{ width: '300px', minWidth: '300px' }}>
                Project / Milestone / Task Hierarchy
              </th>
              {renderScaleHeaders()}
            </tr>
          </thead>
          <tbody>
            {flatRows.map((row) => {
              if (row.isLoader) {
                return (
                  <tr key={row.id} style={{ height: '42px' }} className="bg-light bg-opacity-50">
                    <td colSpan={totalCols + 1} className="ps-4">
                      <div className="d-flex align-items-center gap-2 text-primary small fw-semibold gantt-loading-pulse">
                        <Loader2 size={16} className="spin-anim flex-shrink-0" />
                        <span>{row.label}</span>
                      </div>
                    </td>
                  </tr>
                );
              }

              const isExpanded = row.isProject
                ? expandedProjects[row.id]
                : row.isMilestone
                ? expandedMilestones[row.id]
                : false;

              const hasChildren = row.isProject || row.isMilestone;
              const barPos = calculateBarPosition(row.startDate, row.endDate);
              const formattedDateRange = formatGanttBarDateRange(row.startDate, row.endDate);

              const isCriticalGlow = highlightCriticalPath && row.criticalPath;
              const isDimmed = highlightCriticalPath && !row.criticalPath;

              const rowClass = row.isProject
                ? `gantt-row-project ${isDimmed ? 'gantt-dimmed' : ''}`
                : row.isMilestone
                ? `gantt-row-milestone ${isDimmed ? 'gantt-dimmed' : ''}`
                : `gantt-row-task ${isDimmed ? 'gantt-dimmed' : ''}`;

              return (
                <tr key={row.id} style={{ height: '48px' }} className={rowClass}>
                  {/* Left Column: Title & Animated Tree Expand Chevron */}
                  <td className="border-end" style={{ maxWidth: '300px' }}>
                    <div
                      className={`d-flex align-items-center gap-2 ${
                        row.isMilestone ? 'ps-3' : row.isTask ? 'ps-5' : ''
                      }`}
                    >
                      {hasChildren ? (
                        <span
                          className={`gantt-chevron ${isExpanded ? 'open' : ''}`}
                          onClick={() => (row.isProject ? toggleProject(row.id) : toggleMilestone(row.id))}
                          title={isExpanded ? 'Collapse' : 'Expand & fetch details'}
                        >
                          <ChevronRight size={15} />
                        </span>
                      ) : (
                        <span style={{ width: '20px' }}></span>
                      )}

                      <div className="d-flex align-items-center gap-1 overflow-hidden">
                        {row.isProject && <ShieldCheck size={15} className="text-primary flex-shrink-0" />}
                        {row.isMilestone && <Tag size={14} className="text-secondary flex-shrink-0" />}

                        <span
                          className={`text-truncate cursor-pointer ${
                            row.isProject
                              ? 'fw-bold text-dark fs-6'
                              : row.isMilestone
                              ? 'fw-semibold text-slate-700 small'
                              : 'text-secondary small'
                          }`}
                          style={{ maxWidth: '220px' }}
                          onClick={() => {
                            if (row.isProject) {
                              toggleProject(row.id);
                            } else if (row.isMilestone) {
                              toggleMilestone(row.id);
                            } else if (onTaskClick) {
                              onTaskClick(row.rawTask || { title: row.title, status: row.status, group: row.group });
                            }
                          }}
                          title={
                            row.isProject || row.isMilestone
                              ? 'Click to expand/collapse'
                              : 'Click to view workspace details'
                          }
                        >
                          {row.title}
                        </span>

                        {row.criticalPath && (
                          <Star size={12} className="text-warning fill-warning flex-shrink-0" title="Critical Path Item" />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Right Timeline Grid Canvas Bar */}
                  <td colSpan={totalCols} className="position-relative p-0" style={{ height: '48px' }}>
                    {/* Live Red TODAY Vertical Line Indicator */}
                    {selectedScale === 'Month' && selectedYear === currentDate.getFullYear() && (
                      <div
                        className="gantt-today-line"
                        style={{
                          left: `${((currentDate.getMonth() + currentDate.getDate() / 30) / 12) * 100}%`,
                        }}
                      >
                        <span className="gantt-today-badge">TODAY</span>
                      </div>
                    )}

                    {barPos.visible && (
                      <div
                        className={`gantt-timeline-bar rounded-pill position-absolute d-flex align-items-center justify-content-between px-3 text-white fw-bold shadow-sm ${
                          isCriticalGlow ? 'gantt-critical-glow' : ''
                        }`}
                        style={{
                          left: `${barPos.leftPct}%`,
                          width: `${barPos.widthPct}%`,
                          top: '10px',
                          height: '28px',
                          backgroundColor: row.barColor || '#2563eb',
                          fontSize: '11.5px',
                          letterSpacing: '0.01em',
                          zIndex: 10,
                        }}
                        onMouseMove={(e) => handleBarMouseMove(e, row)}
                        onMouseLeave={handleBarMouseLeave}
                      >
                        <span className="text-truncate me-1" style={{ maxWidth: '75%' }}>
                          {row.title} {formattedDateRange && `(${formattedDateRange})`}
                        </span>
                        <span
                          className="badge bg-white text-dark rounded-pill shadow-xs flex-shrink-0"
                          style={{ fontSize: '10px', padding: '2px 7px' }}
                        >
                          {row.percentage}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Tooltip Element */}
      {tooltipData && tooltipData.item && (
        <div
          className="gantt-floating-tooltip"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom border-secondary border-opacity-25">
            <span
              className={`badge rounded-pill px-2 py-1 text-uppercase font-extrabold ${
                tooltipData.item.isProject
                  ? 'gantt-tooltip-badge-project'
                  : tooltipData.item.isMilestone
                  ? 'gantt-tooltip-badge-milestone'
                  : 'gantt-tooltip-badge-task'
              }`}
              style={{ fontSize: '10px', letterSpacing: '0.06em' }}
            >
              {tooltipData.item.type || 'ITEM'}
            </span>
            <span className="small text-secondary fw-semibold">{tooltipData.item.reference || tooltipData.item.code || ''}</span>
          </div>

          <h6 className="fw-bold text-white mb-2 fs-6 line-clamp-2">{tooltipData.item.title}</h6>

          <div className="d-flex flex-column gap-1 mb-2 text-slate-300 small" style={{ fontSize: '12px' }}>
            <div className="d-flex align-items-center gap-2">
              <Calendar size={13} className="text-primary flex-shrink-0" />
              <span>
                Timeline: <strong className="text-white">{formatGanttBarDateRange(tooltipData.item.startDate, tooltipData.item.endDate)}</strong>
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Clock size={13} className="text-info flex-shrink-0" />
              <span>
                Duration: <strong className="text-white">{tooltipData.item.duration || 'N/A'}</strong> ({tooltipData.item.percentage || '0%'} Done)
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <DollarSign size={13} className="text-success flex-shrink-0" />
              <span>
                Planned Budget: <strong className="text-emerald-400" style={{ color: '#34d399' }}>{tooltipData.item.plannedBudget || 'N/A'}</strong>
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Building size={13} className="text-warning flex-shrink-0" />
              <span>
                Domain Lead: <strong className="text-white">{tooltipData.item.domainLead?.name || tooltipData.item.lead?.name || tooltipData.item.assignee?.name || 'Claire Bure'}</strong>
              </span>
            </div>
          </div>

          {tooltipData.item.criticalPath && (
            <div className="badge bg-amber-500 bg-opacity-20 text-warning border border-warning border-opacity-40 w-100 py-1 d-flex align-items-center justify-content-center gap-1">
              <Star size={12} className="fill-warning" />
              <span>Critical Path Active Item</span>
            </div>
          )}
        </div>
      )}
    </Box>
  );
};
