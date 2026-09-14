import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const UserProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Derive dynamic user details with fallback
  const nameParts = user?.name ? user.name.split(' ') : ['Name', 'of', 'the', 'person'];
  const firstName = user?.firstName || nameParts[0] || 'Name of the person';
  const lastName = user?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Last Name');
  const displayName = user?.name || 'Name of the person';
  const email = user?.email || 'Loremips@gmail.com';
  const phone = user?.contactNumber || user?.phone || '+971 555 855 56';
  const segment = user?.segment || user?.organizationId?.name || 'Emmar properties Dubai';
  const department = user?.department || 'Corporate IT';
  const designation = user?.designation || user?.role || 'Name of your Role';
  const avatar = user?.avatarUrl ? `/${user.avatarUrl.replace(/^\//, '')}` : '/img/client1.jpg';

  return (
    <div className="w-100 p-4 min-vh-100" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Top Header Title with Divider */}
      <div className="mb-2">
        <h1 className="fs-3 fw-bold text-dark m-0" style={{ color: '#1E293B', fontSize: '26px' }}>User Profile</h1>
      </div>
      <hr className="my-3 border-secondary opacity-25" />

      {/* Main Profile Card Container */}
      <div className="bg-white rounded-3 border shadow-sm p-4 my-4" style={{ borderColor: '#E2E8F0' }}>
        <div className="row g-0">
          {/* Left Column: Avatar & Basic Info */}
          <div className="col-md-3 border-end text-center p-4 d-flex flex-column align-items-center justify-content-center" style={{ borderColor: '#E2E8F0' }}>
            <img
              src={avatar}
              alt="User Profile"
              className="rounded-circle mb-3 border p-1 shadow-sm"
              style={{ width: '130px', height: '130px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/client1.jpg';
              }}
            />
            <h2 className="fw-bold mb-1" style={{ fontSize: '18px', color: '#1E293B' }}>{displayName}</h2>
            <p className="m-0" style={{ fontSize: '14px', color: '#64748B' }}>{designation}</p>
          </div>

          {/* Right Column: Detailed Profile Sections */}
          <div className="col-md-9 p-4 ps-md-5">
            {/* Section 1: User Profile */}
            <div className="pb-4 mb-4 border-bottom" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="mb-3 fw-medium" style={{ fontSize: '14px', color: '#94A3B8' }}>User Profile</h2>
              <div className="d-flex flex-wrap gap-4 align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Display Name:</span>
                  <span className="fw-semibold" style={{ fontSize: '14px', color: '#1E293B' }}>{displayName}</span>
                </div>
                <div className="d-flex align-items-center gap-2 ms-md-4">
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>First Name:</span>
                  <span className="fw-semibold" style={{ fontSize: '14px', color: '#1E293B' }}>{firstName}</span>
                </div>
                <div className="d-flex align-items-center gap-2 ms-md-4">
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Last Name:</span>
                  <span className="fw-semibold" style={{ fontSize: '14px', color: '#1E293B' }}>{lastName}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="pb-4 mb-4 border-bottom" style={{ borderColor: '#F1F5F9' }}>
              <h2 className="mb-3 fw-medium" style={{ fontSize: '14px', color: '#94A3B8' }}>Contact Information</h2>
              <div className="d-flex flex-wrap gap-5 align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Contact Number:</span>
                  <span className="fw-bold" style={{ fontSize: '14px', color: '#2563EB' }}>{phone}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Email:</span>
                  <span className="fw-bold" style={{ fontSize: '14px', color: '#2563EB' }}>{email}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Segment & Department */}
            <div className="pb-4 mb-4 border-bottom" style={{ borderColor: '#F1F5F9' }}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label mb-2 fw-medium" style={{ fontSize: '14px', color: '#94A3B8' }}>Segment</label>
                  <input
                    type="text"
                    className="form-control rounded-3 px-3 py-2"
                    style={{ borderColor: '#E2E8F0', color: '#1E293B', backgroundColor: '#FFFFFF', fontSize: '14px', height: '44px' }}
                    value={segment}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label mb-2 fw-medium" style={{ fontSize: '14px', color: '#94A3B8' }}>Department</label>
                  <input
                    type="text"
                    className="form-control rounded-3 px-3 py-2"
                    style={{ borderColor: '#E2E8F0', color: '#1E293B', backgroundColor: '#FFFFFF', fontSize: '14px', height: '44px' }}
                    value={department}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Designation */}
            <div>
              <label className="form-label mb-2 fw-medium" style={{ fontSize: '14px', color: '#94A3B8' }}>Designation</label>
              <p className="fw-medium m-0" style={{ fontSize: '14px', color: '#1E293B' }}>{designation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action Button */}
      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-primary fw-bold text-uppercase px-4 py-2 shadow-sm rounded-2"
          style={{ backgroundColor: '#3B82F6', borderColor: '#3B82F6', fontSize: '13px', letterSpacing: '0.5px', minWidth: '120px' }}
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};


