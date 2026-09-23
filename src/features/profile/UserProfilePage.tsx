import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Mail, Phone, Building2, Briefcase, Award, Edit2, Check, X, LogOut, Camera } from 'lucide-react';

export const UserProfilePage = () => {
  const { user, logout, updateUserProfile, fetchCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Local form state for live editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    segment: '',
    department: '',
    designation: '',
    avatarUrl: '',
  });

  // Ensure user profile is fetched on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Sync user state into local form state
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || user.displayName || 'Emaar Admin').split(' ');
      setFormData({
        firstName: user.firstName || nameParts[0] || 'Emaar',
        lastName: user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Admin'),
        email: user.email || 'admin@emaar.ae',
        contactNumber: user.contactNumber || user.phone || '+971 4 367 3333',
        segment: user.segment || user.organizationId?.name || 'Emaar Properties PJSC',
        department: user.department || 'Project Management',
        designation: user.designation || user.role || 'Senior Project Director',
        avatarUrl: user.avatarUrl || '/icons/avatar1.svg',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      phone: formData.contactNumber,
      segment: formData.segment,
      department: formData.department,
      designation: formData.designation,
      role: formData.designation,
      avatarUrl: formData.avatarUrl,
    });
    setIsEditing(false);
    setToastMessage('Profile updated successfully!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Derive dynamic user details for display
  const nameParts = (user?.name || user?.displayName || 'Emaar Admin').split(' ');
  const firstName = user?.firstName || nameParts[0] || 'Emaar';
  const lastName = user?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Admin');
  const displayName = `${firstName} ${lastName}`.trim() || user?.displayName || user?.name || 'Emaar Admin';
  const email = user?.email || 'admin@emaar.ae';
  const phone = user?.contactNumber || user?.phone || '+971 4 367 3333';
  const segment = user?.segment || user?.organizationId?.name || 'Emaar Properties PJSC';
  const department = user?.department || 'Project Management';
  const designation = user?.designation || user?.role || 'Senior Project Director';
  const avatarUrl = user?.avatarUrl || '/icons/avatar1.svg';

  // Generate initials for avatar fallback if avatar image is unavailable
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="w-100 p-4 min-vh-100" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div 
          className="alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-4 shadow-lg border-0 rounded-3 text-white"
          style={{ backgroundColor: '#10B981', zIndex: 9999, minWidth: '280px' }}
        >
          <div className="d-flex align-items-center gap-2">
            <Check size={18} />
            <span className="fw-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header Title & Actions */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h1 className="fs-3 fw-bold text-dark m-0" style={{ color: '#1E293B', fontSize: '26px' }}>
            User Profile
          </h1>
          <p className="text-muted small m-0">Manage your corporate credentials and account settings</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {!isEditing ? (
            <button
              className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2 rounded-2"
              onClick={() => setIsEditing(true)}
              style={{ borderColor: '#2563EB', color: '#2563EB' }}
            >
              <Edit2 size={15} /> Edit Profile
            </button>
          ) : (
            <button
              className="btn btn-outline-secondary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2 rounded-2"
              onClick={() => setIsEditing(false)}
            >
              <X size={15} /> Cancel
            </button>
          )}
        </div>
      </div>
      <hr className="my-3 border-secondary opacity-25" />

      {/* Main Profile Card Container */}
      <form onSubmit={handleSave}>
        <div className="bg-white rounded-3 border shadow-sm p-4 my-4" style={{ borderColor: '#E2E8F0' }}>
          <div className="row g-0">
            {/* Left Column: Avatar & Basic Info */}
            <div 
              className="col-md-3 border-end text-center p-4 d-flex flex-column align-items-center justify-content-center" 
              style={{ borderColor: '#E2E8F0' }}
            >
              <div className="position-relative mb-3">
                {avatarUrl && avatarUrl !== '/img/client1.jpg' ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="rounded-circle border p-1 shadow-sm"
                    style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as any).onerror = null;
                      (e.target as HTMLImageElement).src = '/icons/avatar1.svg';
                    }}
                  />
                ) : (
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                    style={{ 
                      width: '130px', 
                      height: '130px', 
                      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                      fontSize: '36px' 
                    }}
                  >
                    {initials}
                  </div>
                )}
                {isEditing && (
                  <div className="mt-2">
                    <select
                      className="form-select form-select-sm rounded-2 text-center small"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      style={{ fontSize: '12px' }}
                    >
                      <option value="/icons/avatar1.svg">Avatar Option 1</option>
                      <option value="/icons/avatar2.svg">Avatar Option 2</option>
                    </select>
                  </div>
                )}
              </div>

              <h2 className="fw-bold mb-1" style={{ fontSize: '18px', color: '#1E293B' }}>
                {displayName}
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-semibold mt-1">
                {designation}
              </span>
            </div>

            {/* Right Column: Detailed Profile Sections */}
            <div className="col-md-9 p-4 ps-md-5">
              {/* Section 1: User Profile Details */}
              <div className="pb-4 mb-4 border-bottom" style={{ borderColor: '#F1F5F9' }}>
                <h2 className="mb-3 fw-semibold text-uppercase tracking-wider d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#64748B' }}>
                  <User size={15} /> User Identity
                </h2>
                {!isEditing ? (
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
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label mb-1 small fw-medium text-muted">First Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label mb-1 small fw-medium text-muted">Last Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Contact Information */}
              <div className="pb-4 mb-4 border-bottom" style={{ borderColor: '#F1F5F9' }}>
                <h2 className="mb-3 fw-semibold text-uppercase tracking-wider d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#64748B' }}>
                  <Mail size={15} /> Contact Information
                </h2>
                {!isEditing ? (
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
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label mb-1 small fw-medium text-muted">Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label mb-1 small fw-medium text-muted">Contact Number</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Segment & Department */}
              <div className="pb-4 mb-4 border-bottom" style={{ borderColor: '#F1F5F9' }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label mb-2 fw-medium d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#94A3B8' }}>
                      <Building2 size={15} /> Segment
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 px-3 py-2"
                      style={{ 
                        borderColor: '#E2E8F0', 
                        color: '#1E293B', 
                        backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC', 
                        fontSize: '14px', 
                        height: '44px' 
                      }}
                      value={isEditing ? formData.segment : segment}
                      onChange={(e) => isEditing && setFormData({ ...formData, segment: e.target.value })}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label mb-2 fw-medium d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#94A3B8' }}>
                      <Briefcase size={15} /> Department
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 px-3 py-2"
                      style={{ 
                        borderColor: '#E2E8F0', 
                        color: '#1E293B', 
                        backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC', 
                        fontSize: '14px', 
                        height: '44px' 
                      }}
                      value={isEditing ? formData.department : department}
                      onChange={(e) => isEditing && setFormData({ ...formData, department: e.target.value })}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Designation */}
              <div>
                <label className="form-label mb-2 fw-medium d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#94A3B8' }}>
                  <Award size={15} /> Designation / Role
                </label>
                {!isEditing ? (
                  <p className="fw-semibold m-0" style={{ fontSize: '14px', color: '#1E293B' }}>
                    {designation}
                  </p>
                ) : (
                  <input
                    type="text"
                    className="form-control rounded-3 px-3 py-2"
                    style={{ borderColor: '#E2E8F0', color: '#1E293B', fontSize: '14px', height: '44px' }}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                )}
              </div>

              {/* Submit button when editing */}
              {isEditing && (
                <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light px-4 fw-medium"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#2563EB' }}
                  >
                    <Check size={16} /> Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Logout Action Button */}
      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-primary fw-bold text-uppercase px-4 py-2 shadow-sm rounded-2 d-flex align-items-center gap-2"
          style={{ backgroundColor: '#3B82F6', borderColor: '#3B82F6', fontSize: '13px', letterSpacing: '0.5px', minWidth: '120px' }}
          onClick={handleLogout}
        >
          <LogOut size={16} /> LOGOUT
        </button>
      </div>
    </div>
  );
};
