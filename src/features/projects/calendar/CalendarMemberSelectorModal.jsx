import { AlertCircle, Lock, Plus, Search, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';
import ReactDOM from 'react-dom';

export const CalendarMemberSelectorModal = ({
  show = false,
  onClose,
  allResources = [],
  selectedResourceIds = [],
  onToggleResource,
  onAddNewMember,
  maxLimit = 6,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  if (!show) return null;

  const currentCount = selectedResourceIds.length;
  const isLimitReached = currentCount >= maxLimit;

  // Filter resources by search query
  const filteredResources = allResources.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      (r.role && r.role.toLowerCase().includes(q))
    );
  });

  const handleCreateMemberSubmit = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    if (onAddNewMember) {
      onAddNewMember({
        name: newMemberName.trim(),
        role: newMemberRole.trim() || 'Team Member',
      });
    }
    setNewMemberName('');
    setNewMemberRole('');
    setShowAddForm(false);
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <div
        className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden bg-white"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000000,
          margin: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header bg-white border-bottom px-4 py-3 align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 text-primary"
              style={{ width: '38px', height: '38px', backgroundColor: '#eff6ff' }}
            >
              <Users size={20} />
            </div>
            <div>
              <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '16px' }}>
                Manage Calendar Members
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                Add or remove member columns (max {maxLimit} active columns)
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        {/* Search Bar & Status Header (Pinned at Top) */}
        <div className="px-4 pt-3 pb-3 bg-light border-bottom">
          {/* Clean, Isolated Search Input Box */}
          <div className="position-relative mb-2" style={{ width: '100%', minHeight: '38px' }}>
            <Search
              size={16}
              className="position-absolute text-muted"
              style={{
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              className="form-control shadow-xs"
              placeholder="Search member by name or role to add/remove..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                position: 'relative',
                top: 'auto',
                right: 'auto',
                left: 'auto',
                bottom: 'auto',
                width: '100%',
                height: '38px',
                fontSize: '13px',
                paddingLeft: '38px',
                paddingRight: '32px',
                display: 'block',
                margin: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxSizing: 'border-box',
                zIndex: 2,
              }}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-sm text-muted position-absolute border-0 bg-transparent pe-3"
                onClick={() => setSearchQuery('')}
                style={{
                  right: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Counter & Warning Bar */}
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-muted fw-semibold" style={{ fontSize: '12px' }}>
              Active Columns:
            </span>
            <span
              className={`badge px-2 py-1 rounded-pill ${
                isLimitReached
                  ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-bold'
                  : 'bg-primary-subtle text-primary fw-bold'
              }`}
              style={{ fontSize: '12px' }}
            >
              {currentCount} / {maxLimit} Columns Active
            </span>
          </div>

          {isLimitReached && (
            <div
              className="mt-2 p-2 rounded-3 d-flex align-items-center gap-2 text-amber-800"
              style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', fontSize: '12px' }}
            >
              <AlertCircle size={15} className="flex-shrink-0 text-amber-600" />
              <span>
                Max <strong>{maxLimit} members</strong> limit reached. Click <strong>"Remove"</strong> on an active member to add another.
              </span>
            </div>
          )}
        </div>

        {/* Create New Team Member Toggle / Inline Form */}
        <div className="px-4 py-2 bg-white border-bottom d-flex align-items-center justify-content-between">
          <span className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>
            Team Members ({filteredResources.length}):
          </span>
          <button
            type="button"
            className="btn btn-sm text-primary fw-bold p-0 border-0 bg-transparent d-flex align-items-center gap-1"
            style={{ fontSize: '12px' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={14} />
            <span>{showAddForm ? 'Cancel New Member' : '+ Add New Member'}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleCreateMemberSubmit} className="p-3 bg-primary-subtle bg-opacity-30 border-bottom">
            <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '12.5px' }}>Add Custom Team Member</h6>
            <div className="row g-2 mb-2">
              <div className="col-7">
                <input
                  type="text"
                  className="form-control form-control-sm bg-white"
                  placeholder="Member Full Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  style={{ position: 'static', width: '100%', height: '34px', fontSize: '13px' }}
                  required
                />
              </div>
              <div className="col-5">
                <input
                  type="text"
                  className="form-control form-control-sm bg-white"
                  placeholder="Role (e.g. Lead)"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{ position: 'static', width: '100%', height: '34px', fontSize: '13px' }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-sm btn-light border"
                style={{ fontSize: '12px' }}
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary fw-bold"
                style={{ fontSize: '12px' }}
                disabled={!newMemberName.trim()}
              >
                Save & Add Member
              </button>
            </div>
          </form>
        )}

        {/* Member List Scroll Container */}
        <div
          className="modal-body p-0"
          style={{ maxHeight: '340px', overflowY: 'auto' }}
        >
          {filteredResources.length === 0 ? (
            <div className="p-4 text-center text-muted" style={{ fontSize: '13px' }}>
              No team members found matching "{searchQuery}".
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredResources.map((res) => {
                const isSelected = selectedResourceIds.includes(res.id);
                const isDisabled = !isSelected && isLimitReached;

                return (
                  <div
                    key={res.id}
                    className={`list-group-item d-flex align-items-center justify-content-between px-4 py-2 border-bottom border-light ${
                      isSelected ? 'bg-primary-subtle bg-opacity-20' : ''
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3 overflow-hidden pe-2">
                      <img
                        src={res.avatar}
                        alt={res.name}
                        className="rounded-circle border flex-shrink-0"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/icons/avatar1.svg';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <h6 className="mb-0 fw-bold text-dark text-truncate" style={{ fontSize: '13px' }}>
                            {res.name}
                          </h6>
                          {isSelected && (
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-0.5" style={{ fontSize: '10px' }}>
                              Active Column
                            </span>
                          )}
                        </div>
                        <span className="text-muted text-truncate d-block" style={{ fontSize: '11.5px' }}>
                          {res.role || 'Team Member'}
                        </span>
                      </div>
                    </div>

                    {/* Action Button: Remove if selected, Add if available, Disabled if limit reached */}
                    <div className="flex-shrink-0 ms-2">
                      {isSelected ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold"
                          style={{ fontSize: '12px' }}
                          onClick={() => onToggleResource(res.id)}
                          title={`Remove ${res.name} from calendar columns`}
                        >
                          <X size={14} />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`btn btn-sm d-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold ${
                            isDisabled
                              ? 'btn-light text-muted border border-secondary-subtle opacity-75'
                              : 'btn-primary'
                          }`}
                          style={{
                            fontSize: '12px',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                          }}
                          disabled={isDisabled}
                          onClick={() => !isDisabled && onToggleResource(res.id)}
                          title={isDisabled ? `Maximum ${maxLimit} members reached` : `Add ${res.name} column to calendar`}
                        >
                          {isDisabled ? (
                            <>
                              <Lock size={13} />
                              <span>Limit Reached</span>
                            </>
                          ) : (
                            <>
                              <UserPlus size={14} />
                              <span>+ Add Column</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer bg-light border-top px-4 py-2 d-flex align-items-center justify-content-between">
          <span className="text-muted" style={{ fontSize: '11.5px' }}>
            💡 Maximum {maxLimit} member columns fit cleanly without scrolling
          </span>
          <button
            type="button"
            className="btn btn-sm btn-primary fw-bold px-4 py-1 rounded-pill"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
