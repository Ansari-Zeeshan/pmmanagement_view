import React from 'react';
import { Link } from 'react-router-dom';

export const RequestsPage = () => {
  return (
    <div className="change-req mt-5 w-100">
      <div className="row m-0">
        <div className="center">
          <h1>Select the requests</h1>
          <p className="desc">
            Sample description while collaborating seamlessly with your team, tracking progress, and reaching goals with this template.
          </p>
          <Link to="/requests/new-it-project" className="text-decoration-none">
            <div className="itproj_div">
              <div className="grid">
                <div className="grid1">
                  <span>
                    <img src="/icons/NEw IT.svg" className="button" alt="New IT Request" />
                  </span>
                  <span>
                    <img src="/icons/NEw IT_blue.svg" alt="New IT Request Active" />
                  </span>
                </div>
                <div className="grid2">
                  <h2>New IT Project Request</h2>
                  <p>Submit a formal intake request for new enterprise technology initiatives and projects.</p>
                </div>
                <div className="grid3">
                  <div>
                    <i className="material-icons">check</i>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/requests/change-project" className="text-decoration-none">
            <div className="itproj_div">
              <div className="grid">
                <div className="grid1">
                  <span>
                    <img src="/icons/changeproject.svg" alt="Change Request" />
                  </span>
                  <span>
                    <img src="/icons/change project_blue.svg" alt="Change Request Active" />
                  </span>
                </div>
                <div className="grid2">
                  <h2>Change Project Request</h2>
                  <p>Request baseline modifications to scope, schedule, or financial allocations for existing projects.</p>
                </div>
                <div className="grid3">
                  <div>
                    <i className="material-icons">check</i>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/requests/new-it-project" className="text-decoration-none bg-light">
            <div className="itproj_div">
              <div className="grid">
                <div className="grid1">
                  <span>
                    <img src="/icons/Closure-grey.svg" alt="Project Closure" />
                  </span>
                  <span>
                    <img src="/icons/closure_blue.svg" alt="Project Closure Active" />
                  </span>
                </div>
                <div className="grid2">
                  <h2>IT Project Closure</h2>
                  <p>Initiate final signoff, asset handover, and financial reconciliation for completed projects.</p>
                </div>
                <div className="grid3">
                  <div>
                    <i className="material-icons">check</i>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
