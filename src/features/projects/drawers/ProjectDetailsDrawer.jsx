import React, { useState } from 'react';
import {
  X,
  Edit2,
  Plus,
  Paperclip,
  Smile,
  AtSign,
  Mail,
  FileText,
  MoreVertical,
  RefreshCw,
  Download,
  Trash2,
  ExternalLink,
  Clock,
  User,
  Check,
  Search,
  Filter,
  FileUp,
} from 'lucide-react';

export const ProjectDetailsDrawer = ({ task, onClose, onSave, defaultTab = 'UPDATES' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'UPDATES' | 'FILES' | 'LOG' | 'DETAILS'
  
  // Title & Edit State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task?.title || 'Project 01');
  const [description, setDescription] = useState(task?.description || 'Emaar Enterprise Project Workspace Item');
  
  // Details Form State
  const [group, setGroup] = useState(task?.group || 'Research');
  const [createdDate, setCreatedDate] = useState(task?.createdDate || 'Oct 20, 2021, 10:00 AM');
  const [startDate, setStartDate] = useState(task?.startDate || 'Oct 20, 2021');
  const [endDate, setEndDate] = useState(task?.endDate || 'Oct 28, 2021');
  const [estHours, setEstHours] = useState(task?.estimatedHours || '40');
  const [status, setStatus] = useState(task?.status || 'On Track');
  const [cost, setCost] = useState(task?.actualBudget || 'AED 200');

  // Assignees & Subscribers
  const [showAssigneeSearch, setShowAssigneeSearch] = useState(false);
  const [showSubscriberPopover, setShowSubscriberPopover] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  
  const [assignees, setAssignees] = useState(
    task?.assignees || [
      { name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
      { name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatarUrl: '/img/client2.jpg' },
    ]
  );

  const [subscribers, setSubscribers] = useState([
    { name: 'John Doe', email: 'John@emaar.com', avatar: '/img/client1.jpg' },
    { name: 'Smith', email: 'Smith@emaar.com', avatar: '/img/client2.jpg' },
    { name: 'Muhammad Ali', email: 'Ali@emaar.com', avatar: '/img/client3.jpg' },
  ]);

  const availableMembers = [
    { name: 'Claire Bure', email: 'Clair@emaar.com', avatarUrl: '/img/client1.jpg' },
    { name: 'Ajmal Khan', email: 'Ajmal@emaar.com', avatarUrl: '/img/client2.jpg' },
    { name: 'Muhammad Ali', email: 'Ali@emaar.com', avatarUrl: '/img/client3.jpg' },
    { name: 'Asif Khan', email: 'Asif@emaar.com', avatarUrl: '/img/client4.jpg' },
    { name: 'John Smith', email: 'John@emaar.com', avatarUrl: '/img/client5.jpg' },
  ];

  // Updates Tab State
  const [updateText, setUpdateText] = useState('');
  const [updates, setUpdates] = useState([
    {
      id: 1,
      author: 'John Smith',
      avatar: '/img/client1.jpg',
      text: 'Milestone 1 architectural blueprints have been submitted for client review.',
      time: '2 hours ago',
    },
  ]);

  // Files Tab State
  const [selectedFileType, setSelectedFileType] = useState('File Type 01');
  const [showFileTypeDropdown, setShowFileTypeDropdown] = useState(false);
  const [isFinalVersion, setIsFinalVersion] = useState('Yes');
  const [activeFileMenu, setActiveFileMenu] = useState(null);
  
  const [filesList, setFilesList] = useState([
    {
      id: 1,
      name: 'Ecommerce statement.pdf',
      type: 'File Type 01',
      date: 'Nov 02, 2021, 5:30 PM',
      version: '2.0',
      size: '2.4 MB',
      icon: '/icons/PDF2.svg',
    },
    {
      id: 2,
      name: 'Project_Specification.pdf',
      type: 'File Type 02',
      date: 'Nov 04, 2021, 11:20 AM',
      version: '1.0',
      size: '1.8 MB',
      icon: '/icons/PDF2.svg',
    },
  ]);

  // Active Log Filter State
  const [showLogFilterPopover, setShowLogFilterPopover] = useState(false);
  const [showPersonFilterPopover, setShowPersonFilterPopover] = useState(false);
  const [selectedPersonFilter, setSelectedPersonFilter] = useState(null);

  const activityLogs = [
    { id: 1, time: '2 h', user: 'John', project: 'Project 01', type: 'Subitems', detail: 'Subitem added' },
    { id: 2, time: '5 h', user: 'Smith', project: 'Project 01', type: 'Timeline', detail: 'Oct 12 - 14', pill: true },
    { id: 3, time: '1 d', user: 'Ali', project: 'Project 01', type: 'Status', detail: 'Changed to On Track' },
    { id: 4, time: '2 d', user: 'Claire', project: 'Project 01', type: 'File', detail: 'Ecommerce statement.pdf uploaded' },
  ];

  // Action Handlers
  const handleToggleAssignee = (member) => {
    if (assignees.some((a) => a.email === member.email)) {
      setAssignees(assignees.filter((a) => a.email !== member.email));
    } else {
      setAssignees([...assignees, member]);
    }
  };

  const handleAddSubscriber = (member) => {
    if (!subscribers.some((s) => s.email === member.email)) {
      setSubscribers([...subscribers, { name: member.name, email: member.email, avatar: member.avatarUrl }]);
    }
  };

  const handleRemoveSubscriber = (email) => {
    setSubscribers(subscribers.filter((s) => s.email !== email));
  };

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!updateText.trim()) return;
    setUpdates([
      {
        id: Date.now(),
        author: 'Current User',
        avatar: '/img/client1.jpg',
        text: updateText,
        time: 'Just now',
      },
      ...updates,
    ]);
    setUpdateText('');
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    const newFileObj = {
      id: Date.now(),
      name: uploadedFile.name,
      type: selectedFileType,
      date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      version: isFinalVersion === 'Yes' ? 'Final 1.0' : 'Draft 0.1',
      size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      icon: '/icons/PDF2.svg',
    };
    setFilesList([newFileObj, ...filesList]);
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFilesList(filesList.filter((f) => f.id !== id));
      setActiveFileMenu(null);
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...task,
        title,
        description,
        group,
        startDate,
        endDate,
        estimatedHours: estHours,
        status,
        actualBudget: cost,
        assignees,
      });
    }
  };

  return (
    <>
      {/* Dimmed Overlay Backdrop */}
      <div className="proj_overlay active" onClick={onClose}></div>

      {/* Slide-In Drawer Panel */}
      <div className="proj_edit active" style={{ width: '60vw', maxWidth: '850px' }}>
        {/* ============================================================ */}
        {/* DRAWER TOP CONTROL BAR */}
        {/* ============================================================ */}
        <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3 position-relative">
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 border d-flex align-items-center justify-content-center"
            onClick={onClose}
            title="Close Drawer (Esc)"
            style={{ width: '36px', height: '36px' }}
          >
            <X size={18} className="text-secondary" />
          </button>

          {/* Subscribers & Team Avatars */}
          <div className="d-flex align-items-center gap-2 position-relative">
            <div className="d-flex align-items-center me-1">
              {subscribers.slice(0, 3).map((sub, sIdx) => (
                <img
                  key={sIdx}
                  src={sub.avatar}
                  alt={sub.name}
                  className="rounded-circle border border-white"
                  style={{ width: '32px', height: '32px', objectFit: 'cover', marginLeft: sIdx > 0 ? '-8px' : '0' }}
                  onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                />
              ))}
            </div>

            {/* Add Team Subscriber Button */}
            <button
              type="button"
              className="btn btn-sm btn-light border border-primary border-dashed rounded-circle d-flex align-items-center justify-content-center p-0"
              style={{ width: '32px', height: '32px', borderStyle: 'dashed' }}
              onClick={() => setShowSubscriberPopover(!showSubscriberPopover)}
              title="Add Team Subscribers"
            >
              <Plus size={16} color="#4868DD" />
            </button>

            {/* TEAM SUBSCRIBER POPOVER */}
            {showSubscriberPopover && (
              <div
                className="position-absolute end-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-3"
                style={{ width: '340px', zIndex: 1080 }}
              >
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <h6 className="m-0 fw-bold text-dark fs-6 d-flex align-items-center gap-1">
                    <Plus size={16} color="#4868DD" /> Add Team Subscribers
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-light p-1 border-0"
                    onClick={() => setShowSubscriberPopover(false)}
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="mb-3">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-sm ps-4"
                      placeholder="Enter Name or Email"
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                    />
                    <Search size={14} className="position-absolute start-0 top-50 translate-middle-y ms-2 text-muted" />
                  </div>
                </div>

                <div className="text-muted small fw-semibold mb-2">Team Subscribers List</div>
                <div className="overflow-auto" style={{ maxHeight: '180px' }}>
                  {subscribers.map((sub, idx) => (
                    <div key={idx} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={sub.avatar}
                          alt={sub.name}
                          className="rounded-circle"
                          style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                        />
                        <div>
                          <div className="fw-semibold text-dark small">{sub.name}</div>
                          <div className="text-muted" style={{ fontSize: '11px' }}>{sub.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm text-danger p-0 border-0 ms-2"
                        onClick={() => handleRemoveSubscriber(sub.email)}
                        title="Remove Subscriber"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* PROJECT TITLE & DESCRIPTION HEADER */}
        {/* ============================================================ */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                className="form-control form-control-lg fw-bold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />
            ) : (
              <h1 className="m-0 text-dark fw-bold" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>
                {title}
              </h1>
            )}
            <button
              type="button"
              className="btn btn-sm p-1 border-0 text-muted"
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              title="Edit Title"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <p className="text-secondary small mt-1 mb-0">{description}</p>
        </div>

        {/* ============================================================ */}
        {/* MAIN DRAWER TAB NAVIGATION */}
        {/* ============================================================ */}
        <div className="nav_div mb-4 border-bottom">
          <ul className="d-flex gap-4 list-unstyled mb-0">
            <li
              className={`pb-2 fw-semibold cursor-pointer ${activeTab === 'UPDATES' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('UPDATES')}
              style={{ cursor: 'pointer', fontSize: '14px' }}
            >
              Updates
            </li>
            <li
              className={`pb-2 fw-semibold cursor-pointer ${activeTab === 'FILES' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('FILES')}
              style={{ cursor: 'pointer', fontSize: '14px' }}
            >
              Files
            </li>
            <li
              className={`pb-2 fw-semibold cursor-pointer ${activeTab === 'LOG' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('LOG')}
              style={{ cursor: 'pointer', fontSize: '14px' }}
            >
              Active Log
            </li>
            <li
              className={`pb-2 fw-semibold cursor-pointer ${activeTab === 'DETAILS' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
              onClick={() => setActiveTab('DETAILS')}
              style={{ cursor: 'pointer', fontSize: '14px' }}
            >
              Project Information
            </li>
          </ul>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: UPDATES TAB */}
        {/* ============================================================ */}
        {activeTab === 'UPDATES' && (
          <div className="tab_content">
            {/* Rich Editor Block */}
            <div className="bg-white border rounded-3 p-3 mb-3 shadow-sm">
              <textarea
                className="form-control border-0 p-0 shadow-none"
                rows="4"
                placeholder="Write an update for your project team..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                style={{ resize: 'none', fontSize: '14px' }}
              ></textarea>

              {/* Action Toolbar */}
              <div className="d-flex align-items-center justify-content-between pt-3 mt-2 border-top">
                <div className="d-flex align-items-center gap-3">
                  <label className="d-flex align-items-center gap-1 text-muted small cursor-pointer mb-0" style={{ cursor: 'pointer' }}>
                    <Paperclip size={16} />
                    <span>Add files</span>
                    <input type="file" className="d-none" onChange={handleFileUpload} />
                  </label>
                  <span className="text-muted small cursor-pointer fw-semibold">GIF</span>
                  <span className="d-flex align-items-center gap-1 text-muted small cursor-pointer">
                    <Smile size={16} />
                    <span>Emoji</span>
                  </span>
                  <span className="d-flex align-items-center gap-1 text-muted small cursor-pointer">
                    <AtSign size={16} />
                    <span>Mention</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 fw-bold text-uppercase"
                  onClick={handlePostUpdate}
                  style={{ backgroundColor: '#4868DD', borderColor: '#4868DD', fontSize: '13px', borderRadius: '6px' }}
                >
                  UPDATE
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-end mb-4">
              <a href="#email-update" onClick={(e) => e.preventDefault()} className="text-secondary small d-flex align-items-center gap-1 text-decoration-none">
                <Mail size={14} /> Write Updates via email
              </a>
            </div>

            {/* Updates Stream */}
            {updates.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {updates.map((up) => (
                  <div key={up.id} className="p-3 bg-light rounded-3 border d-flex gap-3">
                    <img
                      src={up.avatar}
                      alt={up.author}
                      className="rounded-circle border"
                      style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-dark small">{up.author}</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>{up.time}</span>
                      </div>
                      <p className="m-0 text-secondary" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                        {up.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted fw-semibold" style={{ fontSize: '14px' }}>
                No Updates Yet
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: FILES TAB */}
        {/* ============================================================ */}
        {activeTab === 'FILES' && (
          <div className="tab_content">
            <div className="row g-4">
              {/* LEFT COLUMN: Document History Stream */}
              <div className="col-md-6">
                <div className="fw-bold text-dark mb-3 fs-6 d-flex align-items-center gap-2">
                  <FileText size={18} color="#4868DD" /> Document History
                </div>

                <div className="d-flex flex-column gap-3">
                  {filesList.map((file) => (
                    <div key={file.id} className="p-3 bg-white rounded-3 border shadow-sm position-relative">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="d-flex align-items-start gap-3">
                          <img
                            src={file.icon || '/icons/PDF2.svg'}
                            alt="PDF"
                            style={{ width: '32px', height: '32px' }}
                            onError={(e) => { e.target.src = '/icons/Files.svg'; }}
                          />
                          <div>
                            <h6 className="m-0 fw-bold text-dark" style={{ fontSize: '14px' }}>{file.name}</h6>
                            <div className="d-flex align-items-center gap-2 text-muted mt-1" style={{ fontSize: '12px' }}>
                              <span className="badge bg-light text-primary border">{file.type}</span>
                              <span>v{file.version}</span>
                            </div>
                            <div className="text-muted mt-1" style={{ fontSize: '11px' }}>
                              Uploaded: {file.date} ({file.size})
                            </div>
                          </div>
                        </div>

                        {/* Three-Dot Menu */}
                        <div className="position-relative">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border-0 p-1 rounded-circle"
                            onClick={() => setActiveFileMenu(activeFileMenu === file.id ? null : file.id)}
                          >
                            <MoreVertical size={16} className="text-secondary" />
                          </button>

                          {activeFileMenu === file.id && (
                            <div
                              className="position-absolute end-0 top-100 mt-1 bg-white border rounded shadow-lg p-2"
                              style={{ zIndex: 1080, minWidth: '170px' }}
                            >
                              <button
                                className="dropdown-item py-1.5 px-2 small d-flex align-items-center gap-2 text-dark"
                                onClick={() => { alert(`Opening ${file.name}`); setActiveFileMenu(null); }}
                              >
                                <ExternalLink size={14} /> Open File
                              </button>
                              <button
                                className="dropdown-item py-1.5 px-2 small d-flex align-items-center gap-2 text-dark"
                                onClick={() => { alert(`Downloading ${file.name}`); setActiveFileMenu(null); }}
                              >
                                <Download size={14} /> Download File
                              </button>
                              <button
                                className="dropdown-item py-1.5 px-2 small d-flex align-items-center gap-2 text-dark"
                                onClick={() => { alert(`Viewing version history for ${file.name}`); setActiveFileMenu(null); }}
                              >
                                <Clock size={14} /> View History
                              </button>
                              <div className="dropdown-divider my-1"></div>
                              <button
                                className="dropdown-item py-1.5 px-2 small d-flex align-items-center gap-2 text-danger"
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                <Trash2 size={14} /> Delete File
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: File Type, Final Version & Dropzone */}
              <div className="col-md-6">
                {/* Choose File Type Dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Choose File Type</label>
                  <div className="position-relative">
                    <button
                      type="button"
                      className="form-select text-start bg-white d-flex align-items-center justify-content-between"
                      onClick={() => setShowFileTypeDropdown(!showFileTypeDropdown)}
                    >
                      <span>{selectedFileType}</span>
                    </button>
                    {showFileTypeDropdown && (
                      <div
                        className="position-absolute start-0 top-100 w-100 mt-1 bg-white border rounded shadow-lg p-1"
                        style={{ zIndex: 1080 }}
                      >
                        {['File Type 01', 'File Type 02', 'File Type 03', 'File Type 04', 'File Type 05'].map((ft) => (
                          <div
                            key={ft}
                            className="dropdown-item py-2 px-3 small cursor-pointer hover-bg-light rounded"
                            onClick={() => {
                              setSelectedFileType(ft);
                              setShowFileTypeDropdown(false);
                            }}
                          >
                            {ft}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Version Radio Options */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark small d-block">Is it a final Version?</label>
                  <div className="d-flex align-items-center gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="finalVersion"
                        id="finalYes"
                        checked={isFinalVersion === 'Yes'}
                        onChange={() => setIsFinalVersion('Yes')}
                      />
                      <label className="form-check-label small text-dark" htmlFor="finalYes">Yes</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="finalVersion"
                        id="finalNo"
                        checked={isFinalVersion === 'No'}
                        onChange={() => setIsFinalVersion('No')}
                      />
                      <label className="form-check-label small text-dark" htmlFor="finalNo">No</label>
                    </div>
                  </div>
                </div>

                {/* Large Dashed Drop Area */}
                <label className="w-100">
                  <div
                    className="border border-2 border-dashed rounded-3 p-4 text-center bg-light cursor-pointer hover-bg-white transition-all d-flex flex-column align-items-center justify-content-center"
                    style={{ minHeight: '220px', borderColor: '#cbd5e1' }}
                  >
                    <FileUp size={44} color="#4868DD" className="mb-2" />
                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Drag & drop your Files here</h6>
                    <p className="text-muted small mb-0">Upload, comment, review (PDF, Excel, Word)</p>
                  </div>
                  <input type="file" className="d-none" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ACTIVE LOG TAB */}
        {/* ============================================================ */}
        {activeTab === 'LOG' && (
          <div className="tab_content">
            {/* Filter Log Controls & Refresh / Export */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                {/* Filter Log Button */}
                <div className="position-relative">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => setShowLogFilterPopover(!showLogFilterPopover)}
                  >
                    <Filter size={14} />
                    <span>Filter Log</span>
                  </button>

                  {/* Filter Log Popover */}
                  {showLogFilterPopover && (
                    <div
                      className="position-absolute start-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-3"
                      style={{ width: '280px', zIndex: 1080 }}
                    >
                      <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                        <span className="fw-bold small text-dark">Filter Log (Showing 6 activity)</span>
                        <span
                          className="text-primary small cursor-pointer"
                          onClick={() => setShowLogFilterPopover(false)}
                        >
                          Clear
                        </span>
                      </div>
                      <div className="mb-2">
                        <label className="small text-muted fw-semibold">Time</label>
                        <select className="form-select form-select-sm mt-1">
                          <option>This year</option>
                          <option>This month</option>
                          <option>This week</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="small text-muted fw-semibold">Group</label>
                        <select className="form-select form-select-sm mt-1">
                          <option>Research</option>
                          <option>Wireframe</option>
                          <option>Visual Design</option>
                        </select>
                      </div>
                      <button
                        className="btn btn-sm btn-primary w-100"
                        onClick={() => setShowLogFilterPopover(false)}
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Person Filter Button */}
                <div className="position-relative">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedPersonFilter ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center gap-1`}
                    onClick={() => setShowPersonFilterPopover(!showPersonFilterPopover)}
                  >
                    <User size={14} />
                    <span>{selectedPersonFilter ? selectedPersonFilter.name : 'Person'}</span>
                  </button>

                  {/* Person Filter Popover */}
                  {showPersonFilterPopover && (
                    <div
                      className="position-absolute start-0 top-100 mt-2 bg-white border rounded-3 shadow-lg p-2"
                      style={{ width: '240px', zIndex: 1080 }}
                    >
                      <div className="p-1">
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          placeholder="Quick Person Filter..."
                        />
                        {availableMembers.map((m, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center gap-2 p-2 hover-bg-light rounded cursor-pointer"
                            onClick={() => {
                              setSelectedPersonFilter(m);
                              setShowPersonFilterPopover(false);
                            }}
                          >
                            <img
                              src={m.avatarUrl}
                              alt={m.name}
                              className="rounded-circle"
                              style={{ width: '24px', height: '24px' }}
                            />
                            <span className="small text-dark fw-semibold">{m.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Refresh & Export Icons */}
              <div className="d-flex align-items-center gap-3">
                <button type="button" className="btn btn-sm btn-light border p-1.5 rounded-circle" title="Refresh Log">
                  <RefreshCw size={14} className="text-secondary" />
                </button>
                <button type="button" className="btn btn-sm btn-light border p-1.5 rounded-circle" title="Export Log">
                  <Download size={14} className="text-secondary" />
                </button>
              </div>
            </div>

            {/* Activity Rows */}
            <div className="bg-white border rounded-3 overflow-hidden shadow-sm">
              {activityLogs.map((log) => (
                <div key={log.id} className="d-flex align-items-center justify-content-between p-3 border-bottom text-dark small">
                  <div className="d-flex align-items-center gap-2" style={{ width: '80px' }}>
                    <Clock size={14} className="text-muted" />
                    <span className="text-muted fw-semibold">{log.time}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ width: '140px' }}>
                    <span className="badge bg-primary rounded-circle p-1" style={{ width: '20px', height: '20px' }}>
                      {log.user[0]}
                    </span>
                    <span className="fw-semibold">{log.project}</span>
                  </div>
                  <div className="text-secondary" style={{ width: '100px' }}>
                    {log.type}
                  </div>
                  <div className="flex-grow-1 text-end">
                    {log.pill ? (
                      <span
                        className="badge px-3 py-1.5 fw-semibold"
                        style={{ backgroundColor: '#BCE7BF', color: '#166534', borderRadius: '12px' }}
                      >
                        {log.detail}
                      </span>
                    ) : (
                      <span className="badge bg-light text-dark border px-2 py-1">{log.detail}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: DETAILS / PROJECT INFORMATION TAB */}
        {/* ============================================================ */}
        {activeTab === 'DETAILS' && (
          <div className="tab_content">
            <form onSubmit={handleSaveDetails}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Group Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Created Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={createdDate}
                    onChange={(e) => setCreatedDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Start Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">End Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Estimated Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={estHours}
                    onChange={(e) => setEstHours(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Approved">Approved</option>
                    <option value="Planned">Planned</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Stuck">Stuck</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small">Budget / Cost</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>

                {/* Assignees Selection */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small d-block">Project Assignees</label>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {assignees.map((a, idx) => (
                      <img
                        key={idx}
                        src={a.avatarUrl || '/img/client1.jpg'}
                        alt={a.name}
                        className="rounded-circle border"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/icons/avatar1.svg'; }}
                      />
                    ))}
                    <button
                      type="button"
                      className="btn btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '36px', height: '36px' }}
                      onClick={() => setShowAssigneeSearch(!showAssigneeSearch)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 mt-4 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary px-4 text-uppercase" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 text-uppercase" style={{ backgroundColor: '#4868DD' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
