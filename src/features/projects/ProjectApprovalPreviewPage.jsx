import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProjectApprovalPreviewPage = () => {
  const navigate = useNavigate();

  return (
    <div className="proj_approval w-100 p-4">
      <div className="row m-0">
        <div className="proj_form bg-white p-4 rounded shadow-sm">
          <div className="row">
            <div className="grid_top d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <div className="grid1">
                <h2>
                  <img src="/icons/emaar.svg" alt="Emaar Logo" style={{ height: '40px' }} />
                </h2>
              </div>
              <div className="grid2 text-center">
                <h1 className="h4 text-uppercase fw-bold text-dark m-0">Technology approval_request form</h1>
              </div>
              <div className="grid3 text-end text-muted small">
                <p className="m-0">
                  Emaar properties PJSC <br />
                  P.O.Box 9440, Dubai <br />
                  United Arab Emirates <br />
                  T +971 4373333
                </p>
              </div>
            </div>

            <div className="sep_div d-flex justify-content-between bg-light p-3 rounded mb-4">
              <div>
                <h4 className="h6 fw-bold m-0 text-primary">Reference Number: ITPR/June/2021-737</h4>
              </div>
              <div>
                <h4 className="h6 fw-bold m-0 text-muted">Date: June/24/2021 - 06:43 PM</h4>
              </div>
            </div>

            <div className="main_form">
              <div className="mainform_head border-bottom pb-2 mb-3">
                <h1 className="h5 fw-bold text-dark m-0">Project information</h1>
              </div>
              <div className="con_pad">
                <div className="row py-2 border-bottom">
                  <div className="col-md-3 fw-semibold">Project Name :</div>
                  <div className="col-md-9 text-muted">Dubai Hills Mall Expansion</div>
                </div>
                <div className="row py-2 border-bottom">
                  <div className="col-md-3 fw-semibold">Request Creator :</div>
                  <div className="col-md-9 text-muted">Nikesh Sharma</div>
                </div>
                <div className="row py-2 border-bottom">
                  <div className="col-md-3 fw-semibold">Business Unit :</div>
                  <div className="col-md-9 text-muted">Emaar Malls & Retail</div>
                </div>
                <div className="row py-2 border-bottom">
                  <div className="col-md-3 fw-semibold">Business Project Manager :</div>
                  <div className="col-md-9 text-muted">Muhammed Momin</div>
                </div>
                <div className="row py-2 border-bottom">
                  <div className="col-md-3 fw-semibold">Project Description :</div>
                  <div className="col-md-9 text-muted">
                    Implementation of next-generation IoT sensor telemetry and digital signage for Dubai Hills Mall.
                  </div>
                </div>
                <div className="row py-2 border-bottom">
                  <div className="col-md-3 fw-semibold">IT Business Partner :</div>
                  <div className="col-md-9 text-muted">Abishek KR</div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                Print Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
