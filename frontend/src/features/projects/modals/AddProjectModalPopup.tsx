import { Calendar, CheckCircle2, Clock, DollarSign, Edit2, FolderPlus, Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';

// Pre-existing / Approved Created Projects Database
const APPROVED_EXISTING_PROJECTS = [
  { id: 'proj-101', reference: 'PRJ-1024', name: 'Project 01 Kaleem Sagar dfgdfgdf', cost: '100 AED', estimatedHours: '40', status: 'On Track', assignees: [{ name: 'Kaleem Sagar', avatarUrl: '/img/client1.jpg' }] },
  { id: 'proj-102', reference: 'PRJ-1025', name: 'Project 01 Project 01', cost: '150 AED', estimatedHours: '65', status: 'In Progress', assignees: [{ name: 'Claire Bure', avatarUrl: '/img/client2.jpg' }] },
  { id: 'proj-103', reference: 'PRJ-1026', name: 'Project 01', cost: '200 AED', estimatedHours: '80', status: 'On Track', assignees: [{ name: 'Leslie Alexander', avatarUrl: '/img/client1.jpg' }] },
  { id: 'proj-104', reference: 'PRJ-1027', name: 'Plumbing Installation Phase 2', cost: '120 AED', estimatedHours: '50', status: 'Planned', assignees: [{ name: 'Ajmal Khan', avatarUrl: '/img/client2.jpg' }] },
  { id: 'proj-105', reference: 'PRJ-1028', name: 'Wall Painting & Wireframe Specs', cost: '90 AED', estimatedHours: '35', status: 'On Track', assignees: [{ name: 'Dianne Russell', avatarUrl: '/img/client3.jpg' }] },
  { id: 'proj-106', reference: 'PRJ-1029', name: 'Floor laying & Insulation', cost: '180 AED', estimatedHours: '70', status: 'In Progress', assignees: [{ name: 'Brooklyn Simmons', avatarUrl: '/img/client1.jpg' }] },
  { id: 'proj-107', reference: 'PRJ-1030', name: 'Installation works for Kitchen', cost: '250 AED', estimatedHours: '95', status: 'On Track', assignees: [{ name: 'Smith Johnson', avatarUrl: '/img/client2.jpg' }] },
  { id: 'proj-108', reference: 'PRJ-1031', name: 'Electrical Wiring Systems', cost: '300 AED', estimatedHours: '120', status: 'Approved', assignees: [{ name: 'Claire Bure', avatarUrl: '/img/client1.jpg' }] },
];

export interface AddProjectModalPopupProps {
  initialGroup?: string;
  onClose?: () => void;
  onSave?: (prj: any) => void;
}

export const AddProjectModalPopup: React.FC<AddProjectModalPopupProps> = ({
  initialGroup = 'Research',
  onClose = () => {},
  onSave,
}) => {
  const [selectedApprovedId, setSelectedApprovedId] = useState(APPROVED_EXISTING_PROJECTS[0].id);
  const [projectTitle, setProjectTitle] = useState(APPROVED_EXISTING_PROJECTS[0].name);
  const [description, setDescription] = useState('Description1');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // Form Fields matching screenshot
  const [group, setGroup] = useState(initialGroup || 'Research');
  const [createdDateTime, setCreatedDateTime] = useState('2026-09-23T10:00');
  const [startDate, setStartDate] = useState('2026-10-20');
  const [endDate, setEndDate] = useState('2026-10-28');
  const [assignees, setAssignees] = useState([
    { name: 'Claire Bure', avatarUrl: '/img/client1.jpg' },
  ]);
  const [estimatedHours, setEstimatedHours] = useState('40');
  const [status, setStatus] = useState('On Track');
  const [cost, setCost] = useState('100 AED');

  useEffect(() => {
    if (initialGroup) {
      setGroup(initialGroup);
    }
  }, [initialGroup]);

  // Format YYYY-MM-DD to readable "Oct 20, 2026"
  const formatDateString = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return dateVal;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateVal;
    }
  };

  // When user selects a different existing approved project
  const handleSelectApprovedProject = (projId) => {
    setSelectedApprovedId(projId);
    const proj = APPROVED_EXISTING_PROJECTS.find((p) => p.id === projId);
    if (proj) {
      setProjectTitle(proj.name);
      if (proj.cost) setCost(proj.cost);
      if (proj.estimatedHours) setEstimatedHours(proj.estimatedHours);
      if (proj.status) setStatus(proj.status);
      if (proj.assignees) setAssignees(proj.assignees);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectedProj = APPROVED_EXISTING_PROJECTS.find((p) => p.id === selectedApprovedId) || APPROVED_EXISTING_PROJECTS[0];

    const formattedStart = formatDateString(startDate) || 'Oct 20, 2026';
    const formattedEnd = formatDateString(endDate) || 'Oct 28, 2026';

    const newProjectData = {
      _id: `task-${Date.now()}`,
      reference: selectedProj.reference || `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: projectTitle || selectedProj.name,
      description: description || 'Description1',
      group: group || 'Research',
      createdAt: createdDateTime ? createdDateTime.replace('T', ' ') : new Date().toLocaleString(),
      plannedDate: `${formattedStart} - ${formattedEnd}`,
      actualDate: formattedStart,
      assignees: assignees.length > 0 ? assignees : selectedProj.assignees,
      estimatedHours: estimatedHours || selectedProj.estimatedHours || '40',
      status: status || selectedProj.status || 'On Track',
      actualBudget: cost || selectedProj.cost || '100 AED',
      plannedBudget: cost || selectedProj.cost || '100 AED',
      projectLead: assignees[0]?.name || 'John',
      domainLead: 'Smith',
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: 'Milestone Name',
          owner: assignees[0]?.name || 'Claire Bure',
          dueDate: 'Nov 3',
          date: 'Nov 3',
          timeline: 'Nov 20',
          status: 'On Track',
          tasks: [
            { id: `sub-${Date.now()}-1`, title: 'Scope definition & technical specification sign-off', status: 'Completed', assignee: 'Claire Bure', date: 'Nov 10' },
            { id: `sub-${Date.now()}-2`, title: 'UI/UX Wireframing & Design System review', status: 'Completed', assignee: 'Ajmal Khan', date: 'Nov 15' },
          ],
        },
      ],
    };

    if (onSave) {
      onSave(newProjectData);
    } else {
      useWorkspaceStore.getState().addProject(newProjectData);
    }
    onClose();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 p-md-4"
      style={{ zIndex: 100060, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
        .premium-add-project-modal * {
          font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        @keyframes popupZoom {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .premium-modal-card {
          animation: popupZoom 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 20px !important;
          overflow: hidden !important;
        }
        .custom-project-input {
          height: 44px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 13.5px;
          color: #1e293b;
          padding: 8px 14px;
          transition: all 0.2s ease;
          background-color: #ffffff;
        }
        .custom-project-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
          outline: none;
        }
        .custom-project-input::placeholder {
          color: #94a3b8;
        }
      `}</style>

      {/* Centered Popup Card Container with Seamless Overflow Clipping (No White Edge Borders) */}
      <div
        className="premium-add-project-modal premium-modal-card bg-white shadow-2xl d-flex flex-column"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4)',
        }}
      >
        <form onSubmit={handleFormSubmit} className="d-flex flex-column h-100 m-0">
          {/* Top Header Banner with Emaar Theme - Seamless Top Clipping */}
          <div
            className="p-4 text-white d-flex align-items-center justify-content-between position-relative m-0"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)' }}
              >
                <FolderPlus size={28} className="text-white" />
              </div>

              <div>
                <div className="d-flex align-items-center gap-2">
                  {isEditingTitle ? (
                    <input
                      type="text"
                      className="form-control form-control-sm fw-bold text-white bg-dark bg-opacity-50 border-white py-0 fs-5"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      autoFocus
                    />
                  ) : (
                    <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                      <h4 className="fw-bold m-0 help-header-title text-white" style={{ fontSize: '22px', letterSpacing: '-0.01em' }}>
                        {projectTitle || 'Project'}
                      </h4>
                      <Edit2 size={16} className="text-white opacity-75 ms-1" />
                    </div>
                  )}

                  <span className="badge rounded-pill text-white px-2 py-1 small fw-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                    Approved Directory
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 mt-1">
                  {isEditingDesc ? (
                    <input
                      type="text"
                      className="form-control form-control-sm small text-white bg-dark bg-opacity-50 border-white py-0"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={() => setIsEditingDesc(false)}
                      autoFocus
                    />
                  ) : (
                    <div className="d-flex align-items-center gap-1 cursor-pointer" onClick={() => setIsEditingDesc(true)}>
                      <p className="m-0 small opacity-85 text-white" style={{ fontSize: '13px' }}>
                        {description || 'Description1'}
                      </p>
                      <Edit2 size={12} className="text-white opacity-75 ms-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle p-2 d-flex align-items-center justify-content-center text-dark border-0 shadow-sm"
              style={{ width: '36px', height: '36px', opacity: 0.9 }}
              onClick={onClose}
              title="Close Popup"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Main Body Scroll Area */}
          <div className="flex-grow-1 overflow-auto p-4 bg-light" style={{ backgroundColor: '#f8fafc' }}>

            {/* PROMINENT CHOOSE APPROVED PROJECT DROPDOWN FIELD */}
            <div className="mb-4 bg-white p-3 rounded-3 border shadow-xs" style={{ borderColor: '#bfdbfe' }}>
              <label className="form-label text-primary small fw-bold mb-2 d-flex align-items-center justify-content-between">
                <span className="d-flex align-items-center gap-1.5" style={{ fontSize: '13.5px' }}>
                  <ShieldCheck size={18} className="text-primary" /> Choose Approved Project from Directory
                </span>
                <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-pill extra-small">
                  Verified IT Project
                </span>
              </label>

              <select
                className="form-select custom-project-input fw-semibold text-dark shadow-xs border-primary"
                style={{ height: '46px', fontSize: '13.5px', borderColor: '#2563eb' }}
                value={selectedApprovedId}
                onChange={(e) => handleSelectApprovedProject(e.target.value)}
              >
                {APPROVED_EXISTING_PROJECTS.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.reference} — {proj.name} ({proj.cost})
                  </option>
                ))}
              </select>
            </div>

            {/* 2-Column Form Fields Grid matching screenshot layout */}
            <div className="bg-white p-4 rounded-3 border shadow-sm">
              <div className="row g-4">
                {/* Row 1: Group & Created Date-Time Picker */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-block" style={{ fontSize: '13px' }}>
                    Group <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control custom-project-input bg-light fw-medium"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder="e.g. Research"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-block" style={{ fontSize: '13px' }}>
                    Created Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control custom-project-input"
                    value={createdDateTime}
                    onChange={(e) => setCreatedDateTime(e.target.value)}
                  />
                </div>

                {/* Row 2: Start Date Calendar Picker & End Date Calendar Picker */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    <Calendar size={14} className="text-primary" /> Start Date (Calendar Picker)
                  </label>
                  <input
                    type="date"
                    className="form-control custom-project-input cursor-pointer"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    <Calendar size={14} className="text-primary" /> End Date (Calendar Picker)
                  </label>
                  <input
                    type="date"
                    className="form-control custom-project-input cursor-pointer"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* Row 3: Assignees & Estimated Hours */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-block" style={{ fontSize: '13px' }}>
                    Assignees
                  </label>
                  <div className="custom-project-input d-flex align-items-center justify-content-start gap-2 bg-white">
                    <div
                      className="rounded-circle border border-dashed border-secondary d-flex align-items-center justify-content-center cursor-pointer"
                      style={{ width: '26px', height: '26px', color: '#2563eb', borderColor: '#2563eb' }}
                      title="Toggle Assignees"
                      onClick={() => {
                        if (assignees.length > 1) {
                          setAssignees([assignees[0]]);
                        } else {
                          setAssignees([
                            { name: 'Claire Bure', avatarUrl: '/img/client1.jpg' },
                            { name: 'Ajmal Khan', avatarUrl: '/img/client2.jpg' },
                          ]);
                        }
                      }}
                    >
                      {assignees.length > 1 ? <Minus size={14} /> : <Plus size={14} />}
                    </div>

                    {assignees.map((a, idx) => (
                      <div key={idx} className="pm-avatar-circle" style={{ width: '26px', height: '26px' }}>
                        <img
                          src={a.avatarUrl || '/img/client1.jpg'}
                          alt={a.name}
                          className="pm-avatar-img rounded-circle"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
                        />
                      </div>
                    ))}
                    <span className="text-dark small ms-1 fw-medium" style={{ fontSize: '12.5px' }}>
                      {assignees.map((a) => a.name).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    <Clock size={14} className="text-muted" /> Estimated Hours
                  </label>
                  <input
                    type="text"
                    className="form-control custom-project-input"
                    placeholder="Enter Estimated Hours"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                  />
                </div>

                {/* Row 4: Status & Cost */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-block" style={{ fontSize: '13px' }}>
                    Status
                  </label>
                  <select
                    className="form-select custom-project-input fw-medium"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="On Track">On Track</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                    <option value="Approved">Approved</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-dark small fw-bold mb-1.5 d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    <DollarSign size={14} className="text-muted" /> Cost / Budget
                  </label>
                  <input
                    type="text"
                    className="form-control custom-project-input"
                    placeholder="Enter Cost (e.g. 100 AED)"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-3 px-4 border-top bg-white d-flex align-items-center justify-content-end gap-3 mt-auto m-0">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-medium"
              style={{
                fontSize: '13px',
                minWidth: '110px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-md d-inline-flex align-items-center gap-2"
              style={{
                fontSize: '13px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderColor: '#2563eb',
                minWidth: '130px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              }}
            >
              <CheckCircle2 size={16} />
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModalPopup;
