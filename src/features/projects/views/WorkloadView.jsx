import React from 'react';

export const WorkloadView = () => {
  const employees = [
    { id: '1', name: 'John Doe', title: 'Principal Project Manager', avatar: '/icons/avatar1.svg', allocatedHours: 48, capacity: 40, department: 'Management' },
    { id: '2', name: 'Sarah Smith', title: 'Domain Lead', avatar: '/icons/avatr4.svg', allocatedHours: 35, capacity: 40, department: 'Civil Engineering' },
    { id: '3', name: 'Ali Khan', title: 'Senior Architect', avatar: '/icons/avtar6.svg', allocatedHours: 40, capacity: 40, department: 'Architecture' },
    { id: '4', name: 'Elena Rostova', title: 'MEP Specialist', avatar: '/icons/avatar1.svg', allocatedHours: 20, capacity: 40, department: 'Engineering' },
  ];

  return (
    <div className="workload active tab_content position-relative w-100 p-3">
      <div className="bg-white rounded-3 shadow-sm border p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-dark m-0">Resource & Employee Workload Distribution</h5>
            <p className="text-muted small m-0">Capacity calculation: (Allocated Hours / Available Capacity) * 100</p>
          </div>
          <button className="btn btn-outline-secondary btn-sm">Filter by Department</button>
        </div>

        <div className="row g-3">
          {employees.map((emp) => {
            const utilization = Math.round((emp.allocatedHours / emp.capacity) * 100);
            const isOverallocated = utilization > 100;

            return (
              <div key={emp.id} className="col-12 col-md-6">
                <div className="card border-0 bg-light p-3 rounded-3">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <img src={emp.avatar} alt={emp.name} className="rounded-circle" style={{ width: '42px', height: '42px' }} />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold m-0 text-dark">{emp.name}</h6>
                      <p className="text-muted small m-0">{emp.title} • {emp.department}</p>
                    </div>
                    <span className={`badge ${isOverallocated ? 'bg-danger' : utilization === 100 ? 'bg-success' : 'bg-primary'}`}>
                      {utilization}% Capacity
                    </span>
                  </div>

                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Hours Allocated: {emp.allocatedHours} hrs</span>
                    <span>Weekly Capacity: {emp.capacity} hrs</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar ${isOverallocated ? 'bg-danger' : utilization === 100 ? 'bg-success' : 'bg-primary'}`}
                      role="progressbar"
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
