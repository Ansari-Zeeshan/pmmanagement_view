import { BadgeCheck, Briefcase, Building, Copy, Mail, MapPin, Phone, X } from 'lucide-react';

const DEFAULT_PROFILES = {
  'John': {
    name: 'John Doe',
    role: 'Senior Project Lead',
    department: 'Enterprise IT & Digital Transformation',
    email: 'john.doe@emaar.ae',
    uniqueId: 'EMP-904281',
    address: 'Emaar Square, Building 3, Floor 5, Downtown Dubai, UAE',
    phone: '+971 4 367 3333',
    avatar: '/img/client1.jpg',
    status: 'Online',
  },
  'Smith': {
    name: 'Smith Johnson',
    role: 'Domain Architecture Lead',
    department: 'Software Engineering & Cloud Solutions',
    email: 'smith.johnson@emaar.ae',
    uniqueId: 'EMP-883104',
    address: 'Emaar Business Park, Building 1, Dubai, UAE',
    phone: '+971 4 367 4444',
    avatar: '/img/client2.jpg',
    status: 'Active',
  },
  'Claire Bure': {
    name: 'Claire Bure',
    role: 'Technical Domain Lead',
    department: 'Project Planning & Agile Operations',
    email: 'claire.bure@emaar.ae',
    uniqueId: 'EMP-772190',
    address: 'Emaar Tower A, Sheikh Zayed Road, Dubai, UAE',
    phone: '+971 50 987 6543',
    avatar: '/img/client1.jpg',
    status: 'Online',
  },
  'Ajmal Khan': {
    name: 'Ajmal Khan',
    role: 'Infrastructure Lead',
    department: 'Cloud & System Infrastructure',
    email: 'ajmal.khan@emaar.ae',
    uniqueId: 'EMP-661092',
    address: 'Emaar Square, Building 4, Downtown Dubai, UAE',
    phone: '+971 55 432 1098',
    avatar: '/img/client2.jpg',
    status: 'Online',
  },
  'Muhammad Ali': {
    name: 'Muhammad Ali',
    role: 'Quality & Governance Lead',
    department: 'Enterprise PMO Governance',
    email: 'muhammad.ali@emaar.ae',
    uniqueId: 'EMP-553201',
    address: 'Emaar Marina Plaza, Dubai Marina, UAE',
    phone: '+971 52 876 5432',
    avatar: '/img/client3.jpg',
    status: 'Active',
  },
};

export const LeadProfileModal = ({ leadName, leadType = 'Project Lead', onClose }) => {
  if (!leadName) return null;

  const profileKey = Object.keys(DEFAULT_PROFILES).find((k) =>
    leadName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(leadName.toLowerCase())
  );

  const profile = DEFAULT_PROFILES[profileKey] || {
    name: leadName.length > 2 ? leadName : `${leadName} Member`,
    role: `${leadType} Specialist`,
    department: 'Enterprise Project Management',
    email: `${leadName.toLowerCase().replace(/\s+/g, '.')}@emaar.ae`,
    uniqueId: `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
    address: 'Emaar Square, Building 3, Downtown Dubai, UAE',
    phone: '+971 4 367 3000',
    avatar: '/img/client1.jpg',
    status: 'Online',
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.uniqueId);
    alert(`Copied Unique ID: ${profile.uniqueId}`);
  };

  return (
    <>
      {/* Backdrop Overlay with High Z-Index & Blur */}
      <div
        className="pm-modal-backdrop position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 100010, backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal Dialog Card Container */}
      <div
        className="pm-profile-modal-card position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow-2xl p-0 overflow-hidden"
        style={{ width: '460px', maxWidth: '92vw', zIndex: 100015, border: '1px solid #e2e8f0' }}
      >
        {/* Profile Header Banner */}
        <div
          className="pm-profile-modal-header p-4 position-relative text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
        >
          <button
            type="button"
            className="pm-profile-modal-close-btn btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-3 p-2 border-0 shadow-sm"
            onClick={onClose}
            title="Close"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} className="text-dark" />
          </button>

          <div className="pm-profile-modal-hero d-flex align-items-center gap-3 mt-1">
            <div className="pm-profile-modal-avatar-wrapper position-relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="pm-profile-modal-avatar rounded-circle border border-3 border-white shadow-sm"
                style={{ width: '72px', height: '72px', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/icons/avatar1.svg'; }}
              />
              <span
                className="pm-profile-status-indicator position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle p-1"
                style={{ width: '14px', height: '14px' }}
                title="Status: Online"
              />
            </div>

            <div className="pm-profile-modal-identity">
              <div className="d-flex align-items-center gap-1">
                <h5 className="pm-profile-name m-0 fw-bold text-white fs-5">{profile.name}</h5>
                <BadgeCheck size={18} color="#60a5fa" className="ms-1" />
              </div>
              <p className="pm-profile-role m-0 text-white-50 small mt-0.5 fw-medium">{profile.role}</p>
              <span className="pm-profile-badge badge text-white mt-1 px-2 py-1 rounded-pill small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                {leadType}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Body Information Details */}
        <div className="pm-profile-modal-body p-4 bg-white">
          <div className="pm-profile-info-list d-flex flex-column gap-3">
            {/* Unique ID Number Field */}
            <div className="pm-profile-info-item pm-profile-id-box d-flex align-items-center justify-content-between p-2 bg-light rounded-3 border">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-10 p-2 rounded-2">
                  <Briefcase size={16} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Unique ID Number
                  </div>
                  <div className="fw-bold text-dark fs-6 font-monospace">{profile.uniqueId}</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 py-1 px-2 text-dark"
                onClick={handleCopyId}
                style={{ fontSize: '12px' }}
                title="Copy Unique ID"
              >
                <Copy size={13} />
                <span>Copy</span>
              </button>
            </div>

            {/* Department Details */}
            <div className="pm-profile-info-item d-flex align-items-start gap-2 p-2 border-bottom">
              <Building size={16} className="text-secondary mt-1 flex-shrink-0" />
              <div>
                <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  Department
                </div>
                <div className="fw-semibold text-dark small">{profile.department}</div>
              </div>
            </div>

            {/* Email Address Details */}
            <div className="pm-profile-info-item d-flex align-items-start gap-2 p-2 border-bottom">
              <Mail size={16} className="text-secondary mt-1 flex-shrink-0" />
              <div>
                <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  Email Address
                </div>
                <a href={`mailto:${profile.email}`} className="fw-semibold text-primary small text-decoration-none hover-underline">
                  {profile.email}
                </a>
              </div>
            </div>

            {/* Contact Phone Details */}
            <div className="pm-profile-info-item d-flex align-items-start gap-2 p-2 border-bottom">
              <Phone size={16} className="text-secondary mt-1 flex-shrink-0" />
              <div>
                <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  Contact Number
                </div>
                <div className="fw-semibold text-dark small">{profile.phone}</div>
              </div>
            </div>

            {/* Office Address Details */}
            <div className="pm-profile-info-item d-flex align-items-start gap-2 p-2">
              <MapPin size={16} className="text-secondary mt-1 flex-shrink-0" />
              <div>
                <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  Office Address
                </div>
                <div className="fw-medium text-dark small">{profile.address}</div>
              </div>
            </div>
          </div>

          {/* Quick Action Footer Controls */}
          <div className="pm-profile-modal-footer pt-3 mt-3 border-top d-flex gap-2 justify-content-end">
            <a
              href={`mailto:${profile.email}`}
              className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-1 fw-semibold"
            >
              <Mail size={14} />
              <span>Send Email</span>
            </a>
            <button
              type="button"
              className="btn btn-primary btn-sm px-4 fw-bold"
              style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadProfileModal;
