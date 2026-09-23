import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OwnerDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="div-dashboard w-100">
      <div className="row top_row">
        <div className="col-md-6 col-6 d-flex div-title align-items-center gap-3">
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <img src="/icons/arrowright.svg" alt="Back" style={{ transform: 'rotate(180deg)' }} />
          </div>
          <span>
            <img src="/img/client1.jpg" alt="Owner Avatar" className="rounded-circle" style={{ width: '45px', height: '45px' }} />
          </span>
          <h1 className="m-0 fs-3 fw-bold">Project Owner 03</h1>
        </div>
        <div className="col-md-6 col-6 d-flex align-items-center div-titleright justify-content-end gap-2">
          <p className="m-0 text-muted">Team Members</p>
          <h1 className="m-0 text-primary fw-bold fs-3">12</h1>
        </div>
      </div>

      <div className="div-card pt-5 pb-5">
        <div className="row">
          <div className="col-xs-12 col-md-3">
            <div className="card border-0 no_mar">
              <div className="card-text">
                <h1>20</h1>
                <p>Total Projects</p>
              </div>
              <div className="img-total">
                <img src="/icons/total-project.svg" className="img-fluid" alt="Total Projects" />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-3">
            <div className="card border-0">
              <div className="card-text">
                <h1>5</h1>
                <p>Completed Projects</p>
              </div>
              <div className="img-total">
                <img src="/icons/current-project.svg" className="img-fluid" alt="Completed Projects" />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-3">
            <div className="card border-0">
              <div className="card-text">
                <h1>10</h1>
                <p>Pending Projects</p>
              </div>
              <div className="img-total">
                <img src="/icons/completed-project.svg" className="img-fluid" alt="Pending Projects" />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-3">
            <div className="card border-0">
              <div className="card-text">
                <h1>5</h1>
                <p>Approved Projects</p>
              </div>
              <div className="img-total">
                <img src="/icons/aproval.svg" className="img-fluid" alt="Approved Projects" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
