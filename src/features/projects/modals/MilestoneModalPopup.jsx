import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, User, CheckCircle2, Clock } from 'lucide-react';

export const MilestoneModalPopup = ({
  milestone = null,
  task = null,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(milestone && milestone.id);

  const [title, setTitle] = useState(milestone?.title || '');
  const [owner, setOwner] = useState(milestone?.owner || milestone?.lead?.name || 'Claire Bure');
  const [status, setStatus] = useState(milestone?.status || 'On Track');
  const [date, setDate] = useState(milestone?.date || milestone?.dueDate || '2026-11-03');
  const [timeline, setTimeline] = useState(milestone?.timeline || '2026-11-20');
  const [subTasks, setSubTasks] = useState(() => {
    if (milestone?.tasks && Array.isArray(milestone.tasks) && milestone.tasks.length > 0) {
      return milestone.tasks;
    }
    return [
      { id: `sub-${Date.now()}-1`, title: 'Initial requirements analysis & stakeholder review', assignee: 'Claire Bure', date: '2026-11-10', status: 'Completed' },
      { id: `sub-${Date.now()}-2`, title: 'Design system alignment & UI wireframes', assignee: 'Ajmal Khan', date: '2026-11-15', status: 'In Progress' },
    ];
  });

  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    const newTask = {
      id: `sub-${Date.now()}`,
      title: newSubTaskTitle.trim(),
      assignee: 'Claire Bure',
      date: '2026-11-20',
      status: 'Pending',
    };
    setSubTasks((prev) => [...prev, newTask]);
    setNewSubTaskTitle('');
  };

  const handleRemoveSubTask = (id) => {
    setSubTasks((prev) => prev.filter((st) => st.id !== id));
  };

  const handleUpdateSubTask = (id, field, value) => {
    setSubTasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, [field]: value } : st))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedMilestone = {
      id: milestone?.id || `m-${Date.now()}`,
      title: title.trim(),
      owner,
      status,
      date,
      timeline,
      dueDate: date,
      tasks: subTasks,
    };

    onSave(updatedMilestone);
    onClose();
  };

  const ownerOptions = [
    { name: 'Claire Bure', avatar: '/img/client1.jpg' },
    { name: 'Ajmal Khan', avatar: '/img/client2.jpg' },
    { name: 'Logan Harrington', avatar: '/img/client3.jpg' },
    { name: 'Nicholas Amazon', avatar: '/img/client1.jpg' },
    { name: 'John', avatar: '/img/client2.jpg' },
    { name: 'Smith', avatar: '/img/client3.jpg' },
  ];

  const statusOptions = ['On Track', 'At Risk', 'Stuck', 'Approved', 'Completed', 'In Progress', 'Planned', 'Pending'];

  const fieldStyle = {
    height: '42px',
    borderRadius: '8px',
    fontSize: '13.5px',
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#1e293b',
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
    <div
      className="modal d-block bg-dark bg-opacity-50"
      tabIndex="-1"
      style={{ zIndex: 1055, animation: 'fadeIn 0.2s ease-in-out' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3 bg-light d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-bold" style={{ fontSize: '12px' }}>
                ♦ {isEditing ? 'Edit Milestone' : 'New Milestone'}
              </span>
              <h5 className="modal-title fw-bold text-dark m-0" style={{ fontSize: '16px' }}>
                {task ? `For Project: ${task.title}` : 'Milestone Management'}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              style={{ fontSize: '12px', cursor: 'pointer' }}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Form Grid */}
              <div className="row g-3 mb-4">
                {/* Milestone Name */}
                <div className="col-12">
                  <label style={labelStyle}>Milestone Title</label>
                  <input
                    type="text"
                    className="form-control"
                    style={fieldStyle}
                    placeholder="Enter milestone name (e.g. Phase 1: Requirements & UX Signoff)..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Owner */}
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <User size={14} className="text-muted" /> Owner / Lead
                  </label>
                  <select
                    className="form-select"
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
                    className="form-select"
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

                {/* Target Date (Calendar Date Picker) */}
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <Calendar size={14} className="text-muted" /> Target Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    style={fieldStyle}
                    value={date.includes('-') ? date : ''}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                {/* Timeline Pill Badge (End Date Calendar Picker) */}
                <div className="col-md-6">
                  <label style={labelStyle}>
                    <Clock size={14} className="text-muted" /> Timeline (End Date)
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    style={fieldStyle}
                    value={timeline.includes('-') ? timeline : ''}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>
              </div>

              {/* Sub-tasks Section */}
              <div className="border rounded-3 p-3 bg-light-subtle">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h6 className="fw-bold text-dark m-0 d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                    Sub-tasks ({subTasks.length})
                  </h6>
                  <span className="text-muted small">Manage sub-tasks under this milestone</span>
                </div>

                {/* Add Sub-task Form */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <input
                    type="text"
                    className="form-control rounded-3 px-3"
                    placeholder="Type sub-task title and press Enter or click Add..."
                    value={newSubTaskTitle}
                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubTask();
                      }
                    }}
                    style={{ ...fieldStyle, height: '38px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary rounded-3 px-4 fw-bold d-inline-flex align-items-center justify-content-center gap-1 flex-shrink-0"
                    style={{ height: '38px', fontSize: '13px', backgroundColor: '#2563eb', borderColor: '#2563eb', cursor: 'pointer' }}
                    onClick={handleAddSubTask}
                  >
                    <Plus size={15} /> Add Sub-task
                  </button>
                </div>

                {/* Sub-tasks Table */}
                {subTasks.length > 0 ? (
                  <div className="table-responsive bg-white rounded-3 border">
                    <table className="table table-sm align-middle m-0" style={{ fontSize: '12.5px' }}>
                      <thead className="bg-light">
                        <tr className="text-muted">
                          <th className="ps-3 py-2">Sub-task Title</th>
                          <th className="py-2" style={{ width: '140px' }}>Assignee</th>
                          <th className="py-2" style={{ width: '120px' }}>Target Date</th>
                          <th className="py-2" style={{ width: '130px' }}>Status</th>
                          <th className="pe-3 py-2 text-end" style={{ width: '50px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subTasks.map((st) => (
                          <tr key={st.id}>
                            <td className="ps-3">
                              <input
                                type="text"
                                className="form-control form-control-sm border-0 p-0 shadow-none bg-transparent fw-medium"
                                value={st.title}
                                onChange={(e) => handleUpdateSubTask(st.id, 'title', e.target.value)}
                              />
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm border-0 bg-transparent p-0 shadow-none text-muted"
                                value={st.assignee || 'Claire Bure'}
                                onChange={(e) => handleUpdateSubTask(st.id, 'assignee', e.target.value)}
                              >
                                {ownerOptions.map((opt) => (
                                  <option key={opt.name} value={opt.name}>
                                    {opt.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm border-0 p-0 shadow-none bg-transparent text-muted"
                                value={st.date?.includes('-') ? st.date : ''}
                                onChange={(e) => handleUpdateSubTask(st.id, 'date', e.target.value)}
                              />
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm rounded-pill px-2.5 py-1 fw-semibold border"
                                value={st.status || 'Pending'}
                                onChange={(e) => handleUpdateSubTask(st.id, 'status', e.target.value)}
                                style={{
                                  fontSize: '11px',
                                  cursor: 'pointer',
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
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Approved">Approved</option>
                              </select>
                            </td>
                            <td className="pe-3 text-end">
                              <button
                                type="button"
                                className="btn btn-sm text-danger p-0 border-0 bg-transparent d-inline-flex align-items-center justify-content-center"
                                onClick={() => handleRemoveSubTask(st.id)}
                                title="Remove sub-task"
                                style={{ cursor: 'pointer' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted p-3 fst-italic bg-white rounded-3 border" style={{ fontSize: '12.5px' }}>
                    No sub-tasks defined. Type above to add your first sub-task.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top px-4 py-3 bg-light d-flex align-items-center justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4 fw-semibold d-inline-flex align-items-center justify-content-center"
                style={{ height: '38px', minWidth: '100px', fontSize: '13px', cursor: 'pointer' }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-inline-flex align-items-center justify-content-center"
                style={{ height: '38px', minWidth: '140px', fontSize: '13px', backgroundColor: '#2563eb', borderColor: '#2563eb', cursor: 'pointer' }}
              >
                {isEditing ? 'Save Changes' : 'Create Milestone'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MilestoneModalPopup;
