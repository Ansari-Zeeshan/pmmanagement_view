import { AlertCircle, Calendar, CheckCircle2, Clock, DollarSign, Edit2, Plus, Trash2, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { MuiPremiumDatePicker } from '../../../components/common/MuiPremiumDatePicker';

// Embedded Modal CSS Animations & Custom Visible Vertical Scrollbar
const modalAnimationStyles = `
@keyframes milestoneModalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes milestoneModalFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes milestoneModalZoomIn {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes milestoneModalZoomOut {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(0.94) translateY(15px); }
}

.pm-modal-scrollable-body {
  max-height: 58vh !important;
  overflow-y: auto !important;
  scrollbar-width: thin !important;
  scrollbar-color: #94a3b8 #f1f5f9 !important;
  padding-right: 8px !important;
}
.pm-modal-scrollable-body::-webkit-scrollbar {
  width: 7px !important;
}
.pm-modal-scrollable-body::-webkit-scrollbar-track {
  background: #f1f5f9 !important;
  border-radius: 4px !important;
}
.pm-modal-scrollable-body::-webkit-scrollbar-thumb {
  background: #94a3b8 !important;
  border-radius: 4px !important;
}
.pm-modal-scrollable-body::-webkit-scrollbar-thumb:hover {
  background: #64748b !important;
}
`;

// Helper to parse numeric budget amount
const parseNumericBudget = (val: any, defaultVal = 250000) => {
  if (!val) return defaultVal;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? defaultVal : num;
};

// Sub-task Child Modal Popup Component (High z-index: 10005, Material UI Date Pickers, 70% Budget Limit)
export const SubTaskModalPopup = ({
  subTask = null,
  milestoneTitle = '',
  milestoneStartDate = '2026-11-01',
  milestoneEndDate = '2026-11-20',
  milestoneBudget = 50000,
  ownerOptions = [],
  onClose,
  onSave,
}: {
  subTask?: any;
  milestoneTitle?: string;
  milestoneStartDate?: string;
  milestoneEndDate?: string;
  milestoneBudget?: number;
  ownerOptions?: any[];
  onClose: () => void;
  onSave: (subTaskData: any) => void;
}) => {
  const isEditing = Boolean(subTask && subTask.id);
  const [isClosing, setIsClosing] = useState(false);

  const numericMilestoneBudget = parseNumericBudget(milestoneBudget, 50000);
  const maxSubTaskBudget = Math.round(numericMilestoneBudget * 0.70);

  const [title, setTitle] = useState(subTask?.title || '');
  const [assignee, setAssignee] = useState(subTask?.assignee || ownerOptions[0]?.name || 'Claire Bure');
  const [startDate, setStartDate] = useState(subTask?.startDate || subTask?.date || milestoneStartDate);
  const [endDate, setEndDate] = useState(subTask?.endDate || subTask?.date || milestoneEndDate);
  const [status, setStatus] = useState(subTask?.status || 'Pending');
  const [budget, setBudget] = useState<number | string>(() => {
    const rawB = subTask?.budget || subTask?.plannedBudget || Math.round(numericMilestoneBudget * 0.25);
    return typeof rawB === 'number' ? rawB : parseNumericBudget(rawB, 10000);
  });
  const [errorMsg, setErrorMsg] = useState('');

  const validateSubTask = (sDate: string, eDate: string, bVal: any) => {
    if (sDate && milestoneStartDate && sDate < milestoneStartDate) {
      return `Sub-task Start Date (${sDate}) cannot be earlier than Milestone Start Date (${milestoneStartDate}).`;
    }
    if (sDate && milestoneEndDate && sDate > milestoneEndDate) {
      return `Sub-task Start Date (${sDate}) cannot exceed Milestone End Date (${milestoneEndDate}).`;
    }
    if (eDate && milestoneEndDate && eDate > milestoneEndDate) {
      return `Sub-task End Date (${eDate}) cannot exceed Milestone End Date (${milestoneEndDate}).`;
    }
    if (eDate && milestoneStartDate && eDate < milestoneStartDate) {
      return `Sub-task End Date (${eDate}) cannot be earlier than Milestone Start Date (${milestoneStartDate}).`;
    }
    if (sDate && eDate && sDate > eDate) {
      return `Sub-task Start Date (${sDate}) cannot be after End Date (${eDate}).`;
    }
    if (Number(bVal) > maxSubTaskBudget) {
      return `Sub-task budget (AED ${Number(bVal).toLocaleString()}) exceeds 70% of parent milestone budget (Max allowed: AED ${maxSubTaskBudget.toLocaleString()}).`;
    }
    return '';
  };

  const handleAnimatedClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const err = validateSubTask(startDate, endDate, budget);
    if (err) {
      setErrorMsg(err);
      return;
    }

    setErrorMsg('');

    const updatedSubTask = {
      id: subTask?.id || `sub-${Date.now()}`,
      title: title.trim(),
      assignee,
      startDate,
      endDate,
      date: endDate,
      status,
      budget: Number(budget),
      plannedBudget: `AED ${Number(budget).toLocaleString()}`,
    };

    onSave(updatedSubTask);
    handleAnimatedClose();
  };

  const fieldStyle = {
    height: '40px',
    borderRadius: '8px',
    fontSize: '13px',
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    width: '100%',
    boxShadow: 'none',
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{
        zIndex: 10005,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        paddingTop: '60px',
        paddingBottom: '30px',
        overflowY: 'auto',
        animation: isClosing ? 'milestoneModalFadeOut 0.2s ease-in-out forwards' : 'milestoneModalFadeIn 0.22s ease-in-out forwards',
      }}
      onClick={handleAnimatedClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-md"
        onClick={(e) => e.stopPropagation()}
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          zIndex: 10006,
          animation: isClosing ? 'milestoneModalZoomOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'milestoneModalZoomIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3 text-white d-flex align-items-center justify-content-between" style={{ backgroundColor: '#0f172a' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary bg-opacity-20 text-blue-300 border border-primary px-3 py-1 rounded-pill fw-bold" style={{ fontSize: '11.5px', color: '#93c5fd' }}>
                {isEditing ? '✎ Edit Sub-task' : '+ New Sub-task'}
              </span>
              <h6 className="modal-title fw-bold text-white m-0" style={{ fontSize: '15px' }}>
                {milestoneTitle ? `Milestone: ${milestoneTitle}` : 'Sub-task Details'}
              </h6>
            </div>
            <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleAnimatedClose} style={{ fontSize: '12px', cursor: 'pointer' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 pm-modal-scrollable-body">
              {/* Milestone Sub-task Constraints Summary Banner */}
              <div className="alert alert-light border shadow-xs rounded-3 mb-3 p-3 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ backgroundColor: '#f8fafc', fontSize: '12px' }}>
                <span className="text-secondary">
                  Milestone Budget: <strong className="text-dark">AED {numericMilestoneBudget.toLocaleString()}</strong>
                </span>
                <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#fffbe6', color: '#b45309', border: '1px solid #fde68a', fontSize: '11px', padding: '5px 12px' }}>
                  Max 70% Limit: AED {maxSubTaskBudget.toLocaleString()}
                </span>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 rounded-3 p-2.5" style={{ fontSize: '12px' }}>
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span className="fw-semibold m-0">{errorMsg}</span>
                </div>
              )}

              <div className="row g-3">
                {/* Title */}
                <div className="col-12">
                  <label style={labelStyle}>Sub-task Title</label>
                  <input
                    type="text"
                    className="form-control fw-medium"
                    style={fieldStyle}
                    placeholder="Enter sub-task title..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrorMsg('');
                    }}
                    required
                  />
                </div>

                {/* Assignee */}
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <User size={13} className="text-muted" /> Assignee
                  </label>
                  <select
                    className="form-select fw-medium"
                    style={fieldStyle}
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  >
                    {ownerOptions.map((opt: any) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <CheckCircle2 size={13} className="text-muted" /> Status
                  </label>
                  <select
                    className="form-select fw-medium"
                    style={fieldStyle}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>

                {/* Material UI Start Date Picker */}
                <div className="col-md-6">
                  <MuiPremiumDatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(val) => {
                      setStartDate(val);
                      setErrorMsg(validateSubTask(val, endDate, budget));
                    }}
                    required
                    fullWidth
                    minDate={milestoneStartDate}
                    maxDate={milestoneEndDate}
                  />
                </div>

                {/* Material UI End Date Picker */}
                <div className="col-md-6">
                  <MuiPremiumDatePicker
                    label="End Date (Deadline)"
                    value={endDate}
                    onChange={(val) => {
                      setEndDate(val);
                      setErrorMsg(validateSubTask(startDate, val, budget));
                    }}
                    required
                    fullWidth
                    minDate={milestoneStartDate}
                    maxDate={milestoneEndDate}
                  />
                </div>

                {/* Budget */}
                <div className="col-12">
                  <label style={labelStyle}>
                    <DollarSign size={13} className="text-muted" /> Sub-task Budget (AED)
                  </label>
                  <div className="position-relative d-flex align-items-center">
                    <span className="position-absolute start-0 ms-3 fw-bold text-secondary" style={{ fontSize: '12.5px', color: '#64748b', pointerEvents: 'none', zIndex: 5 }}>
                      AED
                    </span>
                    <input
                      type="number"
                      className="form-control fw-semibold"
                      style={{ ...fieldStyle, paddingLeft: '52px' }}
                      placeholder="Enter sub-task budget..."
                      value={budget}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBudget(val === '' ? '' : Number(val));
                        setErrorMsg(validateSubTask(startDate, endDate, val));
                      }}
                      min={0}
                      max={maxSubTaskBudget}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end align-items-center mt-1">
                    <small className={`fw-bold ${Number(budget) > maxSubTaskBudget ? 'text-danger' : 'text-success'}`} style={{ fontSize: '11px' }}>
                      Max Allowed: AED {maxSubTaskBudget.toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top px-4 py-3 bg-light d-flex align-items-center justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
                style={{ height: '36px', fontSize: '12.5px', cursor: 'pointer' }}
                onClick={handleAnimatedClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                style={{ height: '36px', fontSize: '12.5px', backgroundColor: '#2563eb', borderColor: '#2563eb', cursor: 'pointer' }}
              >
                {isEditing ? 'Save Sub-task' : 'Add Sub-task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Milestone Modal Popup Component with Top-Level Z-Index 9999 & High-Contrast Design
export const MilestoneModalPopup = ({
  milestone = null,
  task = null,
  onClose,
  onSave,
}: {
  milestone?: any;
  task?: any;
  onClose: () => void;
  onSave: (milestoneData: any) => void;
}) => {
  const isEditing = Boolean(milestone && milestone.id);
  const [isClosing, setIsClosing] = useState(false);

  // Derive Project Bounds
  const projectStartDate = task?.startDate || task?.projectStartDate || '2026-01-01';
  const projectEndDate = task?.endDate || task?.projectEndDate || '2026-12-31';
  const projectTotalBudget = parseNumericBudget(task?.budget || task?.plannedBudget, 250000);
  const maxMilestoneBudget = Math.round(projectTotalBudget * 0.60);

  // Prefill data if editing, or clean default state if adding new milestone
  const [title, setTitle] = useState(milestone?.title || '');
  const [owner, setOwner] = useState(milestone?.owner || milestone?.lead?.name || 'Claire Bure');
  const [status, setStatus] = useState(milestone?.status || 'On Track');
  const [startDate, setStartDate] = useState(milestone?.startDate || milestone?.date || milestone?.dueDate || projectStartDate);
  const [endDate, setEndDate] = useState(milestone?.endDate || milestone?.timeline || '2026-11-20');
  const [budget, setBudget] = useState<number | string>(() => {
    const rawB = milestone?.budget || milestone?.plannedBudget || 50000;
    return typeof rawB === 'number' ? rawB : parseNumericBudget(rawB, 50000);
  });

  const [validationError, setValidationError] = useState('');

  // Sub-tasks list state
  const [subTasks, setSubTasks] = useState<any[]>(() => {
    if (milestone?.tasks && Array.isArray(milestone.tasks) && milestone.tasks.length > 0) {
      return milestone.tasks;
    }
    if (isEditing) return [];
    return [
      { id: `sub-${Date.now()}-1`, title: 'Initial requirements analysis & stakeholder review', assignee: 'Claire Bure', startDate: projectStartDate, endDate: '2026-11-10', date: '2026-11-10', budget: 12000, plannedBudget: 'AED 12,000', status: 'Completed' },
      { id: `sub-${Date.now()}-2`, title: 'Design system alignment & UI wireframes', assignee: 'Ajmal Khan', startDate: '2026-11-05', endDate: '2026-11-15', date: '2026-11-15', budget: 15000, plannedBudget: 'AED 15,000', status: 'In Progress' },
    ];
  });

  // Sub-task Child Modal State
  const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState<any | null>(null);

  const ownerOptions = [
    { name: 'Claire Bure', avatar: '/img/client1.jpg' },
    { name: 'Ajmal Khan', avatar: '/img/client2.jpg' },
    { name: 'Logan Harrington', avatar: '/img/client3.jpg' },
    { name: 'Nicholas Amazon', avatar: '/img/client1.jpg' },
    { name: 'John', avatar: '/img/client2.jpg' },
    { name: 'Smith', avatar: '/img/client3.jpg' },
  ];

  const statusOptions = ['On Track', 'At Risk', 'Stuck', 'Approved', 'Completed', 'In Progress', 'Planned', 'Pending'];

  const validateInputs = (sDate: string, eDate: string, bAmount: any) => {
    if (sDate && projectStartDate && sDate < projectStartDate) {
      return `Milestone Start Date (${sDate}) cannot be earlier than Project Start Date (${projectStartDate}).`;
    }
    if (sDate && projectEndDate && sDate > projectEndDate) {
      return `Milestone Start Date (${sDate}) cannot exceed Project End Date (${projectEndDate}).`;
    }
    if (eDate && projectEndDate && eDate > projectEndDate) {
      return `Milestone End Date (${eDate}) cannot exceed Project End Date (${projectEndDate}).`;
    }
    if (eDate && projectStartDate && eDate < projectStartDate) {
      return `Milestone End Date (${eDate}) cannot be earlier than Project Start Date (${projectStartDate}).`;
    }
    if (sDate && eDate && sDate > eDate) {
      return `Start Date (${sDate}) cannot be after End Date (${eDate}).`;
    }
    if (Number(bAmount) > maxMilestoneBudget) {
      return `Milestone budget (AED ${Number(bAmount).toLocaleString()}) exceeds 60% of total project budget (Max allowed: AED ${maxMilestoneBudget.toLocaleString()}).`;
    }
    return '';
  };

  const handleAnimatedClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 220);
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks((prev) => prev.filter((st) => st.id !== id));
  };

  const handleOpenAddSubTask = () => {
    setSelectedSubTask(null);
    setIsSubTaskModalOpen(true);
  };

  const handleOpenEditSubTask = (st: any) => {
    setSelectedSubTask(st);
    setIsSubTaskModalOpen(true);
  };

  const handleSaveSubTaskModal = (subTaskData: any) => {
    setSubTasks((prev) => {
      const exists = prev.some((st) => st.id === subTaskData.id);
      if (exists) {
        return prev.map((st) => (st.id === subTaskData.id ? subTaskData : st));
      }
      return [...prev, subTaskData];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const errorMsg = validateInputs(startDate, endDate, budget);
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setValidationError('');

    const updatedMilestone = {
      id: milestone?.id || `m-${Date.now()}`,
      title: title.trim(),
      owner,
      status,
      date: startDate,
      startDate,
      endDate,
      timeline: endDate,
      dueDate: endDate,
      budget: Number(budget),
      plannedBudget: `AED ${Number(budget).toLocaleString()}`,
      tasks: subTasks,
    };

    onSave(updatedMilestone);
    handleAnimatedClose();
  };

  const fieldStyle = {
    height: '42px',
    borderRadius: '8px',
    fontSize: '13.5px',
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    width: '100%',
    boxShadow: 'none',
  };

  const labelStyle = {
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  return (
    <>
      {/* Inject Keyframe Animation Styles & Visible Custom Scrollbar */}
      <style>{modalAnimationStyles}</style>

      {/* Top-Level High Z-Index Backdrop (z-index 9999 sits ABOVE sticky header) */}
      <div
        className="modal d-block"
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          overflowY: 'auto',
          animation: isClosing ? 'milestoneModalFadeOut 0.2s ease-in-out forwards' : 'milestoneModalFadeIn 0.22s ease-in-out forwards',
        }}
        onClick={handleAnimatedClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={(e) => e.stopPropagation()}
          style={{
            zIndex: 10000,
            marginTop: '40px',
            marginBottom: '40px',
            animation: isClosing ? 'milestoneModalZoomOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'milestoneModalZoomIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
            {/* Dark Executive Header */}
            <div className="modal-header border-bottom px-4 py-3.5 text-white d-flex align-items-center justify-content-between" style={{ backgroundColor: '#0f172a' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary bg-opacity-20 text-blue-300 border border-primary px-3 py-1 rounded-pill fw-bold" style={{ fontSize: '11.5px', color: '#93c5fd' }}>
                  ♦ {isEditing ? 'Edit Milestone' : 'New Milestone'}
                </span>
                <h5 className="modal-title fw-bold text-white m-0" style={{ fontSize: '16px' }}>
                  {task ? `For Project: ${task.title}` : 'Milestone Management'}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                onClick={handleAnimatedClose}
                style={{ fontSize: '12px', cursor: 'pointer' }}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4 pm-modal-scrollable-body">
                {/* Parent Project Summary Info Banner with High-Contrast Contrast Badge */}
                <div className="alert alert-light border shadow-xs rounded-3 mb-4 p-3 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ backgroundColor: '#f8fafc' }}>
                  <div>
                    <span className="fw-bold text-dark d-block" style={{ fontSize: '13px' }}>
                      Parent Project Bounds: <span className="text-primary">{task?.title || 'Project Workspace'}</span>
                    </span>
                    <span className="text-secondary small">
                      Timeline: <strong>{projectStartDate}</strong> to <strong>{projectEndDate}</strong> | Total Budget: <strong>AED {projectTotalBudget.toLocaleString()}</strong>
                    </span>
                  </div>
                  <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#fffbe6', color: '#b45309', border: '1px solid #fde68a', fontSize: '11.5px', padding: '6px 12px' }}>
                    Max 60% Limit: AED {maxMilestoneBudget.toLocaleString()}
                  </span>
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3 shadow-sm p-3">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span className="fw-semibold small m-0">{validationError}</span>
                  </div>
                )}

                {/* Form Grid */}
                <div className="row g-3 mb-4">
                  {/* Milestone Name */}
                  <div className="col-12">
                    <label style={labelStyle}>Milestone Title</label>
                    <input
                      type="text"
                      className="form-control fw-medium"
                      style={fieldStyle}
                      placeholder="Enter milestone name (e.g. Phase 1: Requirements & UX Signoff)..."
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setValidationError('');
                      }}
                      required
                    />
                  </div>

                  {/* Owner */}
                  <div className="col-md-6">
                    <label style={labelStyle}>
                      <User size={14} className="text-muted" /> Owner / Lead
                    </label>
                    <select
                      className="form-select fw-medium"
                      style={fieldStyle}
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                    >
                      {ownerOptions.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="col-md-6">
                    <label style={labelStyle}>
                      <CheckCircle2 size={14} className="text-muted" /> Status
                    </label>
                    <select
                      className="form-select fw-medium"
                      style={fieldStyle}
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Material UI Milestone Start Date Picker */}
                  <div className="col-md-6">
                    <MuiPremiumDatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(val) => {
                        setStartDate(val);
                        setValidationError(validateInputs(val, endDate, budget));
                      }}
                      required
                      fullWidth
                      minDate={projectStartDate}
                      maxDate={projectEndDate}
                    />
                  </div>

                  {/* Material UI Milestone End Date Picker */}
                  <div className="col-md-6">
                    <MuiPremiumDatePicker
                      label="End Date (Target Deadline)"
                      value={endDate}
                      onChange={(val) => {
                        setEndDate(val);
                        setValidationError(validateInputs(startDate, val, budget));
                      }}
                      required
                      fullWidth
                      minDate={projectStartDate}
                      maxDate={projectEndDate}
                    />
                  </div>

                  {/* Milestone Budget Input Field with Single-Line Inline AED Prefix */}
                  <div className="col-12">
                    <label style={labelStyle}>
                      <DollarSign size={14} className="text-muted" /> Milestone Budget (AED)
                    </label>
                    <div className="position-relative d-flex align-items-center">
                      <span className="position-absolute start-0 ms-3 fw-bold" style={{ fontSize: '13px', color: '#64748b', pointerEvents: 'none', zIndex: 5 }}>
                        AED
                      </span>
                      <input
                        type="number"
                        className="form-control fw-semibold"
                        style={{ ...fieldStyle, paddingLeft: '54px' }}
                        placeholder="Enter milestone budget amount..."
                        value={budget}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBudget(val === '' ? '' : Number(val));
                          setValidationError(validateInputs(startDate, endDate, val));
                        }}
                        min={0}
                        max={maxMilestoneBudget}
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-1">
                      <small className={`fw-bold ${Number(budget) > maxMilestoneBudget ? 'text-danger' : 'text-success'}`} style={{ fontSize: '11px' }}>
                        Max Allowed: AED {maxMilestoneBudget.toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Sub-tasks Section */}
                <div className="border rounded-3 p-3 bg-light-subtle">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <div>
                      <h6 className="fw-bold text-dark m-0 d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                        Sub-tasks ({subTasks.length})
                      </h6>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1 shadow-xs"
                      style={{ fontSize: '12px', backgroundColor: '#2563eb', borderColor: '#2563eb', cursor: 'pointer' }}
                      onClick={handleOpenAddSubTask}
                    >
                      <Plus size={14} /> Add Sub-task
                    </button>
                  </div>

                  {/* Sub-tasks Table */}
                  {subTasks.length > 0 ? (
                    <div className="table-responsive bg-white rounded-3 border">
                      <table className="table table-sm align-middle m-0" style={{ fontSize: '12.5px' }}>
                        <thead className="bg-light">
                          <tr className="text-muted">
                            <th className="ps-3 py-2">Sub-task Title</th>
                            <th className="py-2" style={{ width: '130px' }}>Assignee</th>
                            <th className="py-2" style={{ width: '170px' }}>Timeline (Start - End)</th>
                            <th className="py-2" style={{ width: '110px' }}>Budget</th>
                            <th className="py-2" style={{ width: '100px' }}>Status</th>
                            <th className="pe-3 py-2 text-end" style={{ width: '80px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subTasks.map((st) => {
                            const stBudget = st.budget || parseNumericBudget(st.plannedBudget, 10000);
                            const stStart = st.startDate || startDate;
                            const stEnd = st.endDate || st.date || endDate;
                            return (
                              <tr key={st.id}>
                                <td className="ps-3 fw-medium text-dark">{st.title}</td>
                                <td className="text-secondary">{st.assignee || 'Claire Bure'}</td>
                                <td className="text-muted small">
                                  {stStart} → {stEnd}
                                </td>
                                <td>
                                  <span className="fw-semibold text-emerald-600" style={{ color: '#059669' }}>
                                    AED {Number(stBudget).toLocaleString()}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="badge rounded-pill px-2 py-1 fw-semibold border"
                                    style={{
                                      fontSize: '10.5px',
                                      backgroundColor:
                                        st.status === 'Completed' || st.status === 'Approved'
                                          ? '#dcfce7'
                                          : st.status === 'In Progress'
                                          ? '#dbeafe'
                                          : '#f1f5f9',
                                      color:
                                        st.status === 'Completed' || st.status === 'Approved'
                                          ? '#166534'
                                          : st.status === 'In Progress'
                                          ? '#1e40af'
                                          : '#475569',
                                    }}
                                  >
                                    {st.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="pe-3 text-end">
                                  <div className="d-flex align-items-center justify-content-end gap-1">
                                    <button
                                      type="button"
                                      className="btn btn-sm text-primary p-1 border-0 bg-transparent"
                                      onClick={() => handleOpenEditSubTask(st)}
                                      title="Edit sub-task details"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-sm text-danger p-1 border-0 bg-transparent"
                                      onClick={() => handleRemoveSubTask(st.id)}
                                      title="Remove sub-task"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-muted p-3 fst-italic bg-white rounded-3 border" style={{ fontSize: '12.5px' }}>
                      No sub-tasks defined. Click <strong>+ Add Sub-task</strong> to add your first sub-task.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-top px-4 py-3 bg-light d-flex align-items-center justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
                  style={{ height: '38px', minWidth: '100px', fontSize: '13px', cursor: 'pointer' }}
                  onClick={handleAnimatedClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                  style={{ height: '38px', minWidth: '140px', fontSize: '13px', backgroundColor: '#2563eb', borderColor: '#2563eb', cursor: 'pointer' }}
                >
                  {isEditing ? 'Save Changes' : 'Create Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sub-task Child Modal Popup */}
      {isSubTaskModalOpen && (
        <SubTaskModalPopup
          subTask={selectedSubTask}
          milestoneTitle={title || 'Milestone'}
          milestoneStartDate={startDate}
          milestoneEndDate={endDate}
          milestoneBudget={Number(budget) || 50000}
          ownerOptions={ownerOptions}
          onClose={() => setIsSubTaskModalOpen(false)}
          onSave={handleSaveSubTaskModal}
        />
      )}
    </>
  );
};

export default MilestoneModalPopup;
