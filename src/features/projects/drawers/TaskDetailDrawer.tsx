import React, { useState } from 'react';

export const TaskDetailDrawer = ({ task, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: 'John Doe',
      avatar: 'icons/avatar1.svg',
      text: 'Finalized structural calculations for foundation pour. @Sarah Smith please review.',
      time: '2 hours ago',
    },
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        author: 'Current User',
        avatar: 'icons/avatar1.svg',
        text: commentText,
        time: 'Just now',
      },
    ]);
    setCommentText('');
  };

  return (
    <div className="position-fixed top-0 end-0 h-100 bg-white border-start shadow-lg overflow-auto" style={{ width: '520px', zIndex: 1060 }}>
      {/* Header */}
      <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
        <div>
          <span className="badge bg-primary me-2">{task.status}</span>
          <span className="badge bg-secondary">{task.priority} Priority</span>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      <div className="p-4">
        {/* Title & Description */}
        <h4 className="fw-bold text-dark mb-2">{task.title}</h4>
        <p className="text-muted small mb-4">{task.description || 'No detailed description provided for this task.'}</p>

        {/* Key Attributes */}
        <div className="row g-3 bg-light rounded-3 p-3 mb-4 border">
          <div className="col-6">
            <small className="text-muted d-block">Due Date</small>
            <strong className="text-dark">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Estimated Hours</small>
            <strong className="text-dark">{task.estimatedHours || 0} hrs</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Planned Cost</small>
            <strong className="text-dark">AED {task.plannedCost ? task.plannedCost.toLocaleString() : '0'}</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Assignee</small>
            <strong className="text-dark">{task.assignees && task.assignees[0] ? task.assignees[0].name : 'Unassigned'}</strong>
          </div>
        </div>

        {/* Subtasks */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-2">Subtasks</h6>
          <div className="form-check mb-1">
            <input className="form-check-input" type="checkbox" defaultChecked id="sub1" />
            <label className="form-check-label text-dark small" htmlFor="sub1">Geotechnical soil testing report</label>
          </div>
          <div className="form-check mb-1">
            <input className="form-check-input" type="checkbox" id="sub2" />
            <label className="form-check-label text-dark small" htmlFor="sub2">Foundation slab reinforcement inspection</label>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-2">Attachments (v1, v2, FINAL)</h6>
          <div className="p-2 border rounded bg-white d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <i className="material-icons text-primary fs-5">description</i>
              <div>
                <small className="fw-bold d-block text-dark">Foundation_Blueprint_v2.pdf</small>
                <small className="text-muted" style={{ fontSize: '10px' }}>Version 2.0 • 4.2 MB</small>
              </div>
            </div>
            <span className="badge bg-success">FINAL</span>
          </div>
        </div>

        {/* Activity & Comment Feed */}
        <div>
          <h6 className="fw-bold text-dark mb-3">Comments & Updates</h6>
          <div className="mb-3">
            {comments.map((c) => (
              <div key={c.id} className="d-flex gap-2 mb-3">
                <img src={`/${c.avatar}`} alt={c.author} className="rounded-circle border" style={{ width: '32px', height: '32px' }} />
                <div className="bg-light p-2 rounded-3 flex-grow-1 border">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark small">{c.author}</strong>
                    <small className="text-muted" style={{ fontSize: '10px' }}>{c.time}</small>
                  </div>
                  <p className="m-0 text-dark small">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment}>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Write a comment... (use @name to mention)"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" type="submit">Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
