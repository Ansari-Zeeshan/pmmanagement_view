import {
    CheckCircle2,
    ChevronDown,
    Clock,
    FileText,
    HelpCircle,
    LifeBuoy,
    PlayCircle,
    Search,
    Send,
    ThumbsDown,
    ThumbsUp,
    Ticket,
    Upload,
    Video,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

// Sample Tutorial Videos Data
const TUTORIAL_VIDEOS = [
  {
    id: 'vid-1',
    title: 'PM Connect Platform Overview & Executive Dashboard',
    description: 'Learn how to navigate the PM Connect workspace, monitor project health metrics, track active requests, and view executive KPI widgets.',
    duration: '3:45',
    category: 'Project Workflows',
    views: '1.2k',
    thumbnailBg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    iconName: 'LayoutGrid',
    takeaways: [
      'Understanding real-time KPI metrics and status distribution.',
      'Navigating between List, Gantt, Calendar, and Kanban project views.',
      'Customizing dashboard widgets and quick filter toolbars.'
    ]
  },
  {
    id: 'vid-2',
    title: 'Creating & Submitting a New IT Project Request',
    description: 'A step-by-step walkthrough on filling out the business case, setting milestone dates, selecting department approvers, and submitting requests.',
    duration: '4:12',
    category: 'Requests & Approvals',
    views: '980',
    thumbnailBg: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    iconName: 'FileSpreadsheet',
    takeaways: [
      'Completing mandatory fields in Section A (Project Overview) & B (Business Case).',
      'Configuring financial budget breakdown and cost center codes.',
      'Selecting digital approvers from the organizational directory.'
    ]
  },
  {
    id: 'vid-3',
    title: 'Managing Project Milestones & Vertical Timeline Progress',
    description: 'Discover how vertical milestone timelines work, updating progress percentages, attaching delivery sign-offs, and tracking completion node-by-node.',
    duration: '5:30',
    category: 'Milestones & Calendar',
    views: '1.5k',
    thumbnailBg: 'linear-gradient(135deg, #7c2d12 0%, #f97316 100%)',
    iconName: 'Clock',
    takeaways: [
      'Connecting start date to due date with zero line overshoot.',
      'Updating task milestones and marking deliverables as completed.',
      'Using the interactive calendar for resource work orders.'
    ]
  },
  {
    id: 'vid-4',
    title: 'Submitting Project Change Requests & Closure Applications',
    description: 'How to request scope or timeline adjustments, handle mid-project change orders, and apply for formal IT Project Closure sign-offs.',
    duration: '4:50',
    category: 'Requests & Approvals',
    views: '840',
    thumbnailBg: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    iconName: 'FileText',
    takeaways: [
      'Filing a formal Change Request with impact analysis.',
      'Uploading User Acceptance Testing (UAT) sign-off documents.',
      'Finalizing IT Project Closure checklist and digital sign-offs.'
    ]
  },
  {
    id: 'vid-5',
    title: 'Gantt Charts, Kanban Boards & Workload Allocation',
    description: 'Master advanced project management tools including interactive Gantt timeline dependencies, drag-and-drop Kanban cards, and resource capacity planning.',
    duration: '6:15',
    category: 'Project Workflows',
    views: '2.1k',
    thumbnailBg: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    iconName: 'FolderKanban',
    takeaways: [
      'Dragging Kanban tasks across workflow stages (To Do, In Progress, Review, Done).',
      'Setting dependency links between project phases on the Gantt chart.',
      'Monitoring team workload balance to prevent over-allocation.'
    ]
  },
  {
    id: 'vid-6',
    title: 'Financial Allocation, Cost Center & Executive Reports',
    description: 'Understand how total project values are calculated, auditing financial commitments, exporting project data, and generating PDF summaries.',
    duration: '4:05',
    category: 'Financials & Reports',
    views: '1.1k',
    thumbnailBg: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
    iconName: 'BarChart3',
    takeaways: [
      'Tracking project expenditure against approved budget allocations.',
      'Printing formatted executive progress reports.',
      'Filtering projects by date ranges, priority, and department.'
    ]
  }
];

// Sample FAQ Data
const FAQ_ITEMS = [
  {
    id: 'faq-1',
    category: 'Project Requests',
    question: 'How do I submit a new IT Project Request for governance approval?',
    answer: 'Navigate to "Project Requests" in the left sidebar menu, click the "+ New IT Project Request" button, and complete the multi-section form. Provide the project name, executive sponsor, business justification, milestone schedule, and financial breakdown. After selecting your required department approvers, click "Submit for Approval".'
  },
  {
    id: 'faq-2',
    category: 'Approvals & Access',
    question: 'Who reviews and approves my submitted project request?',
    answer: 'Your request goes through a structured multi-tier workflow: First to your Department Lead for initial validation, then to IT Security & Infrastructure for technical governance, followed by Finance for budget verification, and finally the Steering Committee for final sign-off.'
  },
  {
    id: 'faq-3',
    category: 'Milestones & Timelines',
    question: 'Can I update project milestones after a project is already active?',
    answer: 'Yes! Open your project from the "Projects Workspace" or "Project List View", click on the "Timeline & Milestones" tab, and select "Edit Milestone". If the changes alter the target due date by more than 14 days or require additional budget, you will be prompted to submit a formal Change Request.'
  },
  {
    id: 'faq-4',
    category: 'Milestones & Timelines',
    question: 'What should I do if a project milestone is flagged as "At Risk" or "On Hold"?',
    answer: 'Change the milestone status pill to "At Risk" or "On Hold" in the project details view, specify the risk factor or bottleneck description, and tag the relevant Lead Assignee. An automated high-priority alert will be sent to the Steering Committee via Notification Drawer.'
  },
  {
    id: 'faq-5',
    category: 'Project Requests',
    question: 'How do I initiate a formal IT Project Closure?',
    answer: 'Go to "Project Requests" -> "Project Closure Request", select your active project reference (e.g. PRJ-1024), verify that all project deliverables are checked off, attach your signed User Acceptance Document (UAT), and click "Submit Closure Request".'
  },
  {
    id: 'faq-6',
    category: 'General',
    question: 'How can I print or export project reports for executive board meetings?',
    answer: 'On either the "Project List View" or "Projects & View Progress" page, click the "Actions" dropdown menu on any project row and select "Print Project" or "View Full Description" to display a print-optimized executive summary.'
  },
  {
    id: 'faq-7',
    category: 'Approvals & Access',
    question: 'What happens if my assigned approver is on leave or unavailable?',
    answer: 'PM Connect automatically routes approval tasks to designated alternate approvers listed in the Emaar Approvers Directory after 48 hours of inactivity. You can also contact IT Support via "Raise the Ticket" to reassign the approver.'
  },
  {
    id: 'faq-8',
    category: 'General',
    question: 'Is PM Connect accessible on mobile devices?',
    answer: 'Yes! PM Connect features a responsive layout designed for smartphones, tablets, and desktop workstations, allowing you to review project status, approve requests, and access help resources on the go.'
  }
];

export const HelpSupportModal = () => {
  const { isHelpModalOpen, setHelpModalOpen, helpModalDefaultTab } = useWorkspaceStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState(helpModalDefaultTab || 'VIDEOS'); // 'VIDEOS' | 'FAQ' | 'TICKET'
  const [videoCategory, setVideoCategory] = useState('ALL');
  const [videoSearch, setVideoSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // FAQ States
  const [faqCategory, setFaqCategory] = useState('ALL');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState('faq-1');
  const [faqFeedback, setFaqFeedback] = useState({});

  // Support Ticket Form States
  const [ticketCategory, setTicketCategory] = useState('Technical Bug / System Error');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketProjectRef, setTicketProjectRef] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketFiles, setTicketFiles] = useState([]);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [submittedTicketData, setSubmittedTicketData] = useState(null);

  if (!isHelpModalOpen) return null;

  // Filter Videos
  const filteredVideos = TUTORIAL_VIDEOS.filter((vid) => {
    const matchesCategory = videoCategory === 'ALL' || vid.category === videoCategory;
    const matchesSearch =
      vid.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      vid.description.toLowerCase().includes(videoSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter FAQs
  const filteredFaqs = FAQ_ITEMS.filter((faq) => {
    const matchesCategory = faqCategory === 'ALL' || faq.category === faqCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle File Upload Change
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
      }));
      setTicketFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setTicketFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Support Ticket
  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    setIsSubmittingTicket(true);
    setTimeout(() => {
      const ticketId = 'TKT-2026-' + Math.floor(10000 + Math.random() * 90000);
      setSubmittedTicketData({
        ticketId,
        category: ticketCategory,
        priority: ticketPriority,
        subject: ticketSubject,
        projectRef: ticketProjectRef || 'General Platform Query',
        description: ticketDescription,
        filesCount: ticketFiles.length,
        createdAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        userEmail: user?.email || 'admin@emaar.ae'
      });
      setIsSubmittingTicket(false);
    }, 900);
  };

  const resetTicketForm = () => {
    setSubmittedTicketData(null);
    setTicketSubject('');
    setTicketDescription('');
    setTicketProjectRef('');
    setTicketFiles([]);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-4"
      style={{ zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
        .help-support-modal-container * {
          font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .help-tab-btn {
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
        }
        .help-tab-btn.active {
          color: #2563eb !important;
          border-bottom-color: #2563eb !important;
          background-color: #eff6ff !important;
          font-weight: 700 !important;
        }
        .video-card {
          transition: all 0.25s ease;
          border: 1px solid #e2e8f0;
        }
        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.12) !important;
          border-color: #93c5fd !important;
        }
        .help-form-input, .help-form-select {
          height: 46px !important;
          border-radius: 10px !important;
          border: 1.5px solid #cbd5e1 !important;
          font-size: 13.5px !important;
          font-weight: 500 !important;
          color: #0f172a !important;
          padding: 0 16px !important;
          background-color: #ffffff !important;
          transition: all 0.25s ease !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03) !important;
        }
        .help-form-input:disabled, .help-form-select:disabled {
          background-color: #f8fafc !important;
          color: #475569 !important;
          border-color: #cbd5e1 !important;
        }
        .help-form-input:focus, .help-form-select:focus, .help-form-textarea:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15) !important;
          outline: none !important;
        }
        .help-form-textarea {
          border-radius: 10px !important;
          border: 1.5px solid #cbd5e1 !important;
          font-size: 13.5px !important;
          font-weight: 500 !important;
          color: #0f172a !important;
          padding: 12px 16px !important;
          background-color: #ffffff !important;
          transition: all 0.25s ease !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03) !important;
          min-height: 120px !important;
        }
        .faq-accordion-item {
          border-radius: 12px !important;
          border: 1px solid #e2e8f0 !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .faq-accordion-item.expanded {
          border-color: #93c5fd !important;
          box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.1) !important;
          background-color: #ffffff !important;
        }
        .faq-chevron-icon {
          transition: transform 0.25s ease !important;
        }
        .faq-chevron-icon.expanded {
          transform: rotate(180deg) !important;
          color: #2563eb !important;
        }
        @media (max-width: 576px) {
          .help-header-title { fontSize: 18px !important; }
          .help-modal-body { padding: 12px !important; }
        }
      `}</style>

      <div
        className="help-support-modal-container bg-white rounded-4 shadow-2xl overflow-hidden d-flex flex-column"
        style={{
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '92vh',
          height: '860px',
          border: '1px solid #0f172a',
          borderRadius: '16px',
        }}
      >
        {/* Top Header Banner */}
        <div
          className="p-3 p-md-4 text-white d-flex align-items-center justify-content-between position-relative"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 p-2.5 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)' }}
            >
              <LifeBuoy size={28} className="text-white" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold m-0 help-header-title text-white" style={{ fontSize: '22px', letterSpacing: '-0.01em' }}>
                  PM Connect Help & Support Center
                </h4>
                <span className="badge rounded-pill text-white px-2.5 py-1 small fw-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
                  Emaar Assistance
                </span>
              </div>
              <p className="m-0 mt-1 small opacity-85 text-white" style={{ fontSize: '13px' }}>
                Watch video tutorials, explore answers in FAQs, or raise a support ticket to our IT team.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle p-2 d-flex align-items-center justify-content-center text-dark border-0 shadow-sm"
            style={{ width: '36px', height: '36px', opacity: 0.9 }}
            onClick={() => setHelpModalOpen(false)}
            title="Close Help Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="d-flex align-items-center border-bottom bg-white px-3 px-md-4 no-print" style={{ gap: '4px' }}>
          <button
            type="button"
            className={`btn help-tab-btn py-3 px-3 px-md-4 rounded-top-3 d-inline-flex align-items-center gap-2 text-secondary ${activeTab === 'VIDEOS' ? 'active' : ''}`}
            style={{ fontSize: '14px' }}
            onClick={() => setActiveTab('VIDEOS')}
          >
            <Video size={18} className={activeTab === 'VIDEOS' ? 'text-primary' : 'text-secondary'} />
            <span>PM Connect Tutorial Videos</span>
            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary ms-1" style={{ fontSize: '11px' }}>
              {TUTORIAL_VIDEOS.length}
            </span>
          </button>

          <button
            type="button"
            className={`btn help-tab-btn py-3 px-3 px-md-4 rounded-top-3 d-inline-flex align-items-center gap-2 text-secondary ${activeTab === 'FAQ' ? 'active' : ''}`}
            style={{ fontSize: '14px' }}
            onClick={() => setActiveTab('FAQ')}
          >
            <HelpCircle size={18} className={activeTab === 'FAQ' ? 'text-primary' : 'text-secondary'} />
            <span>Frequently Asked Questions</span>
            <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary ms-1" style={{ fontSize: '11px' }}>
              {FAQ_ITEMS.length}
            </span>
          </button>

          <button
            type="button"
            className={`btn help-tab-btn py-3 px-3 px-md-4 rounded-top-3 d-inline-flex align-items-center gap-2 text-secondary ${activeTab === 'TICKET' ? 'active' : ''}`}
            style={{ fontSize: '14px' }}
            onClick={() => setActiveTab('TICKET')}
          >
            <Ticket size={18} className={activeTab === 'TICKET' ? 'text-primary' : 'text-secondary'} />
            <span>Raise the Ticket</span>
            <span className="badge rounded-pill bg-success bg-opacity-10 text-success ms-1" style={{ fontSize: '11px' }}>
              Direct Support
            </span>
          </button>
        </div>

        {/* Modal Main Body Content */}
        <div className="flex-grow-1 overflow-auto p-3 p-md-4 help-modal-body bg-light" style={{ backgroundColor: '#f8fafc' }}>

          {/* TAB 1: PM CONNECT TUTORIAL VIDEOS */}
          {activeTab === 'VIDEOS' && (
            <div className="d-flex flex-column gap-4">
              {/* Filter Toolbar */}
              <div className="row g-3 align-items-center justify-content-between bg-white p-3 rounded-3 border shadow-sm">
                <div className="col-12 col-md-6 col-lg-5">
                  <div className="position-relative">
                    <Search size={16} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-pill ps-5"
                      placeholder="Search tutorial videos by title or topic..."
                      value={videoSearch}
                      onChange={(e) => setVideoSearch(e.target.value)}
                      style={{ fontSize: '13px', height: '38px', borderColor: '#cbd5e1' }}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-7 d-flex flex-wrap align-items-center gap-2 justify-content-md-end">
                  {['ALL', 'Project Workflows', 'Requests & Approvals', 'Milestones & Calendar', 'Financials & Reports'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 fw-medium ${videoCategory === cat ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary bg-white text-secondary border'}`}
                      style={{ fontSize: '12px' }}
                      onClick={() => setVideoCategory(cat)}
                    >
                      {cat === 'ALL' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Cards Grid */}
              <div className="row g-3">
                {filteredVideos.map((vid) => (
                  <div key={vid.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 video-card rounded-4 overflow-hidden bg-white">
                      {/* Video Thumbnail Header */}
                      <div
                        className="position-relative p-4 text-white d-flex flex-column justify-content-between cursor-pointer"
                        style={{ height: '160px', background: vid.thumbnailBg, cursor: 'pointer' }}
                        onClick={() => setSelectedVideo(vid)}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="badge rounded-pill text-white px-2.5 py-1 small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                            {vid.category}
                          </span>
                          <span className="badge rounded-pill bg-dark bg-opacity-60 text-white font-monospace small px-2 py-0.5">
                            {vid.duration}
                          </span>
                        </div>

                        {/* Play Center Icon Overlay */}
                        <div className="position-absolute top-50 start-50 translate-middle text-white opacity-90 transition-transform hover-scale">
                          <PlayCircle size={48} className="drop-shadow-lg text-white" fill="rgba(255,255,255,0.25)" />
                        </div>

                        <div className="d-flex align-items-center justify-content-between small opacity-85 mt-auto">
                          <span className="d-flex align-items-center gap-1">
                            <Clock size={13} /> {vid.duration} min
                          </span>
                          <span>{vid.views} views</span>
                        </div>
                      </div>

                      {/* Video Info Content */}
                      <div className="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                          <h6
                            className="fw-bold text-dark m-0 cursor-pointer"
                            style={{ fontSize: '14.5px', lineHeight: 1.35, color: '#0f172a' }}
                            onClick={() => setSelectedVideo(vid)}
                          >
                            {vid.title}
                          </h6>
                          <p className="text-muted small m-0 mt-2 line-clamp-2" style={{ fontSize: '12.5px', color: '#64748b' }}>
                            {vid.description}
                          </p>
                        </div>

                        {/* Watch Tutorial Button - Premium Style & 50% Width */}
                        <div className="pt-3 mt-3 border-top d-flex align-items-center justify-content-center">
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill fw-bold text-white d-inline-flex align-items-center justify-content-center gap-1 w-50 mx-auto shadow-sm"
                            style={{
                              fontSize: '12.5px',
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              border: 'none',
                              padding: '7px 16px',
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => setSelectedVideo(vid)}
                          >
                            <PlayCircle size={15} /> Watch Tutorial
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredVideos.length === 0 && (
                  <div className="col-12 text-center py-5 bg-white rounded-3 border">
                    <Video size={40} className="text-muted mb-2 opacity-50" />
                    <h6 className="fw-bold text-dark">No tutorial videos found</h6>
                    <p className="text-muted small">Try adjusting your search query or category filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FREQUENTLY ASKED QUESTIONS */}
          {activeTab === 'FAQ' && (
            <div className="d-flex flex-column gap-4">
              {/* FAQ Search Toolbar */}
              <div className="row g-3 align-items-center justify-content-between bg-white p-3 rounded-3 border shadow-sm">
                <div className="col-12 col-md-6 col-lg-5">
                  <div className="position-relative">
                    <Search size={16} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-pill ps-5"
                      placeholder="Search FAQs by question or keyword..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      style={{ fontSize: '13px', height: '38px', borderColor: '#cbd5e1' }}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-7 d-flex flex-wrap align-items-center gap-2 justify-content-md-end">
                  {['ALL', 'General', 'Project Requests', 'Approvals & Access', 'Milestones & Timelines'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 fw-medium ${faqCategory === cat ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary bg-white text-secondary border'}`}
                      style={{ fontSize: '12px' }}
                      onClick={() => setFaqCategory(cat)}
                    >
                      {cat === 'ALL' ? 'All Topics' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accordion FAQ List */}
              <div className="d-flex flex-column gap-3">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  const feedbackState = faqFeedback[faq.id];

                  return (
                    <div
                      key={faq.id}
                      className={`bg-white rounded-3 border overflow-hidden faq-accordion-item ${isExpanded ? 'expanded' : ''}`}
                    >
                      <button
                        type="button"
                        className="w-100 text-start p-3 px-md-4 bg-transparent border-0 d-flex align-items-center justify-content-between gap-3 cursor-pointer"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 transition-all"
                            style={{
                              width: '36px',
                              height: '36px',
                              backgroundColor: isExpanded ? '#eff6ff' : '#f1f5f9',
                              color: isExpanded ? '#2563eb' : '#64748b',
                              border: isExpanded ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                            }}
                          >
                            <HelpCircle size={18} />
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-2.5 py-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                              {faq.category}
                            </span>
                            <span className={`fw-bold ${isExpanded ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '15px', letterSpacing: '-0.2px' }}>
                              {faq.question}
                            </span>
                          </div>
                        </div>

                        <div className={`faq-chevron-icon flex-shrink-0 ${isExpanded ? 'expanded' : ''}`}>
                          <ChevronDown size={20} className={isExpanded ? 'text-primary' : 'text-muted'} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 px-md-4 pb-4 pt-2 border-top bg-light-subtle">
                          <p className="m-0 lh-relaxed" style={{ fontSize: '14px', color: '#334155', lineHeight: 1.65 }}>
                            {faq.answer}
                          </p>

                          <div className="pt-3 mt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2">
                            <span className="text-muted small fw-medium" style={{ fontSize: '12px' }}>
                              Was this answer helpful to you?
                            </span>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className={`btn btn-sm py-1.5 px-3 rounded-2 d-inline-flex align-items-center gap-1.5 fw-medium ${feedbackState === 'yes' ? 'btn-success text-white' : 'btn-outline-secondary bg-white'}`}
                                style={{ fontSize: '12.5px' }}
                                onClick={() => setFaqFeedback((prev) => ({ ...prev, [faq.id]: 'yes' }))}
                              >
                                <ThumbsUp size={13} /> Yes
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm py-1.5 px-3 rounded-2 d-inline-flex align-items-center gap-1.5 fw-medium ${feedbackState === 'no' ? 'btn-danger text-white' : 'btn-outline-secondary bg-white'}`}
                                style={{ fontSize: '12.5px' }}
                                onClick={() => setFaqFeedback((prev) => ({ ...prev, [faq.id]: 'no' }))}
                              >
                                <ThumbsDown size={13} /> No
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-5 bg-white rounded-3 border">
                    <HelpCircle size={40} className="text-muted mb-2 opacity-50" />
                    <h6 className="fw-bold text-dark">No matching FAQ items</h6>
                    <p className="text-muted small">Can't find what you are looking for? Submit a ticket in "Raise the Ticket" tab.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RAISE THE TICKET */}
          {activeTab === 'TICKET' && (
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
              {!submittedTicketData ? (
                <form onSubmit={handleSubmitTicket}>
                  <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 border-bottom pb-3 gap-2">
                    <div>
                      <h5 className="fw-bold text-dark m-0" style={{ fontSize: '20px', color: '#0f172a', letterSpacing: '-0.3px' }}>
                        Raise a Support Ticket
                      </h5>
                      <p className="text-muted small m-0 mt-1">
                        Our IT PMO Support Team will review your issue and respond within 2 to 4 business hours.
                      </p>
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-1.5 rounded-pill fw-bold" style={{ fontSize: '12px' }}>
                      24/7 PMO Helpdesk
                    </span>
                  </div>

                  <div className="row g-4">
                    {/* Category */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark small mb-2 d-block">
                        Ticket Category / Issue Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select help-form-select"
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        required
                      >
                        <option value="Technical Bug / System Error">Technical Bug / System Error</option>
                        <option value="Access & Permissions">Access & Permissions Request</option>
                        <option value="Data / Project Correction">Data / Project Correction</option>
                        <option value="Workflow & Approval Query">Workflow & Approval Query</option>
                        <option value="Feature Request / Enhancement">Feature Request / Enhancement</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark small mb-2 d-block">
                        Priority Severity <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select help-form-select"
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value)}
                        required
                      >
                        <option value="Low">Low (General Inquiry)</option>
                        <option value="Medium">Medium (Standard Request)</option>
                        <option value="High">High (Impacting Project Timeline)</option>
                        <option value="Urgent">Urgent (Critical System Blocker)</option>
                      </select>
                    </div>

                    {/* Project Reference */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark small mb-2 d-block">Project Reference ID (Optional)</label>
                      <input
                        type="text"
                        className="form-control help-form-input"
                        placeholder="e.g. PRJ-1024, PRJ-1025..."
                        value={ticketProjectRef}
                        onChange={(e) => setTicketProjectRef(e.target.value)}
                      />
                    </div>

                    {/* Contact Email */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark small mb-2 d-block">Requester Contact Email</label>
                      <input
                        type="email"
                        className="form-control help-form-input"
                        value={user?.email || 'admin@emaar.ae'}
                        disabled
                      />
                    </div>

                    {/* Subject */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark small mb-2 d-block">
                        Subject / Brief Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control help-form-input"
                        placeholder="Summarize the issue or question..."
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark small mb-2 d-block">
                        Detailed Description & Steps to Reproduce <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control help-form-textarea"
                        rows={4}
                        placeholder="Provide details about what happened, error messages seen, or what assistance is needed..."
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    {/* File Upload Dropzone */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark small mb-2 d-block">Attach Screenshots or Documents (Optional)</label>
                      <div
                        className="border-2 border-dashed rounded-3 p-4 text-center bg-light transition-all"
                        style={{ borderColor: '#93c5fd', cursor: 'pointer', backgroundColor: '#f8fafc' }}
                        onClick={() => document.getElementById('ticket-file-input').click()}
                      >
                        <Upload size={28} className="text-primary mb-2" />
                        <div className="fw-semibold text-dark small cursor-pointer">Click to browse or drop files here</div>
                        <div className="text-muted extra-small mt-1" style={{ fontSize: '11.5px' }}>
                          Supports PNG, JPG, PDF, DOCX up to 10MB
                        </div>
                        <input
                          id="ticket-file-input"
                          type="file"
                          className="d-none"
                          multiple
                          onChange={handleFileUpload}
                        />
                      </div>

                      {/* File List */}
                      {ticketFiles.length > 0 && (
                        <div className="mt-3 d-flex flex-wrap gap-2">
                          {ticketFiles.map((file, idx) => (
                            <span key={idx} className="badge bg-white text-dark border shadow-xs d-inline-flex align-items-center gap-1.5 py-2 px-3 rounded-3" style={{ fontSize: '12px' }}>
                              <FileText size={14} className="text-primary" />
                              <span className="fw-medium">{file.name}</span>
                              <span className="text-muted font-monospace">({file.size})</span>
                              <X size={14} className="text-danger cursor-pointer ms-1" onClick={() => removeFile(idx)} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Standard Cancel & Submit Action Buttons */}
                  <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-end gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-semibold"
                      style={{ fontSize: '13px', minWidth: '100px' }}
                      onClick={() => setHelpModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2.5 rounded-3 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                      disabled={isSubmittingTicket}
                      style={{ fontSize: '13px', backgroundColor: '#2563eb', borderColor: '#2563eb', minWidth: '140px' }}
                    >
                      {isSubmittingTicket ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Submit Ticket</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Ticket Submitted Success Card View */
                <div className="text-center py-4 px-2">
                  <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 text-success p-3">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="fw-bold text-dark">Ticket Submitted Successfully!</h4>
                  <p className="text-muted small">
                    Your support ticket has been received and assigned to our IT PMO Support Team.
                  </p>

                  <div className="card bg-light border p-3 my-4 mx-auto text-start rounded-3" style={{ maxWidth: '520px', borderColor: '#e2e8f0' }}>
                    <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                      <span className="text-muted small">Ticket Reference:</span>
                      <strong className="font-monospace text-primary fs-6">{submittedTicketData.ticketId}</strong>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="text-muted small">Category:</span>
                      <span className="fw-medium text-dark small">{submittedTicketData.category}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="text-muted small">Priority:</span>
                      <span className="badge bg-warning bg-opacity-20 text-dark border border-warning px-2 py-0.5 small">
                        {submittedTicketData.priority}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="text-muted small">Project Ref:</span>
                      <span className="fw-medium text-dark small">{submittedTicketData.projectRef}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">Status:</span>
                      <span className="badge bg-info bg-opacity-10 text-info border px-2 py-0.5 small">
                        Open (Pending IT Review)
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-4"
                      onClick={resetTicketForm}
                    >
                      Raise Another Ticket
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary rounded-pill px-4 fw-bold"
                      onClick={() => setHelpModalOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Interactive Video Player Modal Overlay */}
      {selectedVideo && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ zIndex: 100000, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div className="bg-dark text-white rounded-4 overflow-hidden shadow-2xl w-100 border border-secondary" style={{ maxWidth: '820px' }}>
            <div className="p-3 bg-black d-flex align-items-center justify-content-between border-bottom border-secondary">
              <div className="d-flex align-items-center gap-2">
                <Video size={18} className="text-primary" />
                <h6 className="m-0 fw-bold text-white small">{selectedVideo.title}</h6>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-circle p-1"
                onClick={() => setSelectedVideo(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Simulated Video Player UI */}
            <div
              className="position-relative bg-black d-flex flex-column align-items-center justify-content-center"
              style={{ height: '380px', background: selectedVideo.thumbnailBg }}
            >
              <PlayCircle size={64} className="text-white drop-shadow-lg cursor-pointer transition-transform hover-scale" />
              <div className="mt-3 fw-bold text-white fs-6">PM Connect Video Tutorial</div>
              <div className="text-white-50 small">Duration: {selectedVideo.duration} min</div>

              {/* Player Progress Controls */}
              <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-black to-transparent">
                <div className="progress mb-2" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: '35%' }}></div>
                </div>
                <div className="d-flex align-items-center justify-content-between small text-white-50 font-monospace" style={{ fontSize: '11px' }}>
                  <span>01:18 / {selectedVideo.duration}</span>
                  <span>1080p HD</span>
                </div>
              </div>
            </div>

            {/* Video Details & Takeaways */}
            <div className="p-4 bg-secondary bg-opacity-10">
              <h6 className="fw-bold text-white m-0" style={{ fontSize: '14px' }}>Key Takeaways in this Video:</h6>
              <ul className="mt-2 mb-0 ps-3 text-white-50 small">
                {selectedVideo.takeaways?.map((item, i) => (
                  <li key={i} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupportModal;
