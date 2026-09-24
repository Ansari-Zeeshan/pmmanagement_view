import React, { useState } from 'react';

export const ProjectUpdatesDrawer = ({ task, onClose }) => {
  const [activeTab, setActiveTab] = useState('UPDATES'); // 'UPDATES' | 'FILES' | 'LOG'
  const [updateText, setUpdateText] = useState('');
  const [updates, setUpdates] = useState([]);
  const [showSubscriberDiv, setShowSubscriberDiv] = useState(false);
  const [showFileMoreMenu, setShowFileMoreMenu] = useState(null); // index of file
  const [selectedFileType, setSelectedFileType] = useState('Choose File Type');
  const [showFileTypeDropdown, setShowFileTypeDropdown] = useState(false);

  const subscribers = [
    { name: 'John Doe', avatar: '/img/client1.jpg' },
    { name: 'Smith', avatar: '/img/client2.jpg' },
  ];

  const filesList = [
    { name: 'Ecommerce statement.pdf', type: 'File Type 01', date: 'Nov 02, 2021, 5:30 PM', icon: '/icons/PDF2.svg' },
    { name: 'Project_Specification.pdf', type: 'File Type 02', date: 'Nov 04, 2021, 11:20 AM', icon: '/icons/PDF2.svg' },
  ];

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

  return (
    <>
      <div className="proj_overlay active" onClick={onClose}></div>
      <div className="proj_edit active">
        {/* Top Header Controls */}
        <div className="row justify-content-between align-items-center mb-3">
          <div className="col-md-3">
            <span onClick={onClose} style={{ cursor: 'pointer' }}>
              <img src="/icons/close.svg" alt="close" />
            </span>
          </div>
          <div className="col-md-9 d-flex justify-content-end align-items-center position-relative">
            <div className="user_img me-2">
              <img src="/img/client1.jpg" alt="John" className="rounded-circle" style={{ width: '29px', height: '29px' }} />
            </div>
            <div className="user_img me-2">
              <img src="/img/client2.jpg" alt="Smith" className="rounded-circle" style={{ width: '29px', height: '29px' }} />
            </div>
            <span
              id="subcribe_pop"
              className="cursor-pointer d-flex align-items-center justify-content-center bg-light border rounded-circle"
              style={{ width: '28px', height: '28px' }}
              onClick={() => setShowSubscriberDiv(!showSubscriberDiv)}
            >
              <img src="/icons/plus-1.svg" alt="add subscriber" style={{ width: '12px', height: '12px' }} />
            </span>

            {/* Subscriber Popover */}
            {showSubscriberDiv && (
              <div
                className="subscriber_div shadow-lg border rounded p-3 bg-white position-absolute end-0 top-100"
                style={{ zIndex: 1060, width: '300px' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="m-0 fw-bold text-dark text-capitalize">Team subscribers list</h6>
                  <span onClick={() => setShowSubscriberDiv(false)} style={{ cursor: 'pointer' }}>
                    <img src="/icons/close.svg" alt="close" style={{ width: '14px' }} />
                  </span>
                </div>
                <div className="subs_con">
                  <div className="d-flex align-items-center gap-2 mb-2 text-primary cursor-pointer">
                    <img src="/icons/plus.svg" alt="plus" style={{ width: '14px' }} />
                    <p className="m-0 small fw-semibold">Add Team Subscribers</p>
                  </div>
                  <input type="text" className="form-control form-control-sm mb-3" placeholder="Enter Name or Email" />
                  <div className="user_list">
                    {subscribers.map((sub, sIdx) => (
                      <div key={sIdx} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div className="d-flex align-items-center gap-2">
                          <img src={sub.avatar} alt={sub.name} className="rounded-circle" style={{ width: '28px', height: '28px' }} />
                          <p className="m-0 small text-dark fw-semibold">{sub.name}</p>
                        </div>
                        <img src="/icons/cross.svg" alt="remove" className="cursor-pointer" style={{ width: '14px' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Title & Main Tab Navigation */}
        <div className="proj_content">
          <div className="d-flex align-items-center gap-2 mb-3">
            <h1 className="m-0 text-dark fw-bold" style={{ fontSize: '2.2rem' }}>
              {task?.title || 'Project 01'}
            </h1>
            <span id="editText" className="cursor-pointer">
              <img src="/icons/edit.svg" alt="edit" />
            </span>
          </div>

          <div className="tab-btn d-flex border-bottom mb-4">
            <button
              className={`btn ${activeTab === 'UPDATES' ? 'active text-primary border-bottom border-primary border-2 fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('UPDATES')}
            >
              Updates <span className="ms-1 small">...</span>
            </button>
            <button
              className={`btn ${activeTab === 'FILES' ? 'active text-primary border-bottom border-primary border-2 fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('FILES')}
            >
              Files <span className="ms-1 small">...</span>
            </button>
            <button
              className={`btn ${activeTab === 'LOG' ? 'active text-primary border-bottom border-primary border-2 fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('LOG')}
            >
              Active Log <span className="ms-1 small">...</span>
            </button>
          </div>

          {/* TAB 1: UPDATES */}
          {activeTab === 'UPDATES' && (
            <div className="update tabproj_con active">
              <textarea
                className="form-control mb-3"
                rows={4}
                placeholder="Write an update..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                style={{ resize: 'vertical' }}
              ></textarea>

              <div className="attach_div d-flex justify-content-between align-items-center p-2 bg-light border rounded mb-3">
                <div className="divfile1 d-flex align-items-center gap-3">
                  <div className="emoji_div d-flex align-items-center gap-1 cursor-pointer">
                    <img src="/icons/Icon material-attach-file.svg" alt="attach" style={{ height: '15px' }} />
                    <p className="m-0 small text-muted">Add files</p>
                  </div>
                  <div className="emoji_div d-flex align-items-center gap-1 cursor-pointer">
                    <p className="m-0 small text-muted">Giff</p>
                  </div>
                  <div className="emoji_div d-flex align-items-center gap-1 cursor-pointer">
                    <i className="material-icons text-muted fs-6">tag_faces</i>
                    <p className="m-0 small text-muted">Emoji</p>
                  </div>
                  <div className="emoji_div d-flex align-items-center gap-1 cursor-pointer">
                    <i className="material-icons text-muted fs-6">alternate_email</i>
                    <p className="m-0 small text-muted">Mention</p>
                  </div>
                </div>
                <div className="divfile2">
                  <button className="btn btn-primary btn-sm text-uppercase px-4 fw-bold" onClick={handlePostUpdate}>
                    Update
                  </button>
                </div>
              </div>

              <div className="no_update d-flex justify-content-end mb-4">
                <p className="small text-muted cursor-pointer d-flex align-items-center gap-1 m-0">
                  <i className="material-icons fs-6">mail_outline</i> Write Updates via email
                </p>
              </div>

              {/* Updates List Feed */}
              {updates.length > 0 ? (
                <div className="updates_feed">
                  {updates.map((up) => (
                    <div key={up.id} className="d-flex gap-3 mb-3 p-3 bg-light rounded border">
                      <img src={up.avatar} alt={up.author} className="rounded-circle" style={{ width: '36px', height: '36px' }} />
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark small">{up.author}</strong>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{up.time}</span>
                        </div>
                        <p className="m-0 text-dark small">{up.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row w-100 mt-5 pt-3 no_updateyet justify-content-center text-center">
                  <p className="text-secondary fw-semibold">No Updates Yet</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FILES */}
          {activeTab === 'FILES' && (
            <div className="files tabproj_con active">
              <div className="row">
                <div className="col-md-6 col-xs-12 mb-3">
                  <div className="uploaded">
                    <div className="custom-select position-relative mb-3">
                      <div
                        className="box11 border rounded p-2 d-flex justify-content-between align-items-center cursor-pointer bg-white"
                        onClick={() => setShowFileTypeDropdown(!showFileTypeDropdown)}
                      >
                        <p className="m-0 small text-dark">{selectedFileType}</p>
                        <img src="/icons/arrowdown.svg" alt="arrow" />
                      </div>
                      {showFileTypeDropdown && (
                        <div className="option-container2 border rounded shadow position-absolute start-0 w-100 bg-white" style={{ zIndex: 1050 }}>
                          {['File Type 01', 'File Type 02', 'File Type 03', 'File Type 04'].map((ft, idx) => (
                            <div
                              key={idx}
                              className="option2 p-2 border-bottom cursor-pointer hover-bg-light"
                              onClick={() => {
                                setSelectedFileType(ft);
                                setShowFileTypeDropdown(false);
                              }}
                            >
                              <p className="m-0 small text-dark">{ft}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Files List */}
                    <div className="fileuploaded_container">
                      {filesList.map((file, fIdx) => (
                        <div key={fIdx} className="fileuploaded border rounded p-2 mb-2 bg-white">
                          <div className="row align-items-center m-0">
                            <div className="col-9 p-0">
                              <div className="d-flex align-items-center gap-2">
                                <img src={file.icon} alt="pdf" style={{ width: '28px' }} />
                                <div>
                                  <h6 className="m-0 small fw-bold text-dark">{file.name}</h6>
                                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '11px' }}>
                                    <span className="fw-semibold">{file.type}</span>
                                    <span>{file.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-3 d-flex justify-content-end position-relative p-0">
                              <img
                                src="/icons/more.svg"
                                alt="more"
                                className="cursor-pointer"
                                onClick={() => setShowFileMoreMenu(showFileMoreMenu === fIdx ? null : fIdx)}
                              />
                              {showFileMoreMenu === fIdx && (
                                <div className="openOption border rounded shadow position-absolute end-0 top-100 bg-white p-2" style={{ zIndex: 1050, minWidth: '160px' }}>
                                  <ul className="list-unstyled m-0 small">
                                    <li className="py-1 cursor-pointer hover-bg-light">Open File</li>
                                    <li className="py-1 cursor-pointer hover-bg-light">Download File</li>
                                    <li className="py-1 cursor-pointer hover-bg-light text-danger">Delete File</li>
                                    <li className="py-1 cursor-pointer hover-bg-light">Manage file version</li>
                                    <li className="py-1 cursor-pointer hover-bg-light">Post Updates on file</li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xs-12">
                  <div className="needtoupload border border-dashed rounded p-4 text-center bg-light d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                    <img src="/icons/Files.svg" alt="upload" className="mb-2" style={{ width: '48px' }} />
                    <h6 className="fw-bold text-dark mb-1">Drag & drop your Files here</h6>
                    <p className="text-muted small m-0">Upload, comment, review (PDF, Excel, Word)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE LOG */}
          {activeTab === 'LOG' && (
            <div className="active_log tabproj_con active">
              <div className="row mb-3 align-items-center">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm">Filter Log</button>
                    <button className="btn btn-outline-secondary btn-sm">Person</button>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/icons/refresh.svg" alt="refresh" className="cursor-pointer" style={{ width: '18px' }} />
                    <img src="/icons/exportexcel.svg" alt="export" className="cursor-pointer" style={{ width: '18px' }} />
                  </div>
                </div>
              </div>

              <div className="con_activity border rounded bg-white">
                {[
                  { time: '2 h', project: 'Project 01', type: 'Subitems', detail: 'Subitem added' },
                  { time: '5 h', project: 'Project 01', type: 'Timeline', detail: 'Oct 12 - 14' },
                  { time: '1 d', project: 'Project 01', type: 'Status', detail: 'Changed to On Track' },
                ].map((act, aIdx) => (
                  <div key={aIdx} className="border-bottom p-2 d-flex align-items-center justify-content-between small text-dark">
                    <div className="d-flex align-items-center gap-2">
                      <img src="/icons/timer.svg" alt="timer" style={{ width: '16px' }} />
                      <span className="text-muted">{act.time}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary">P</span>
                      <span className="fw-bold">{act.project}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted">{act.type}</span>
                    </div>
                    <div>
                      <span className="badge bg-light text-dark border">{act.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
