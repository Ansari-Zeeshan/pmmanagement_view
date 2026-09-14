import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChangeProjectRequestPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/requests');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/requests');
    }
  };

  return (
    <>
      <div className="div2">
        <div className="center_div">
          <ul>
            <li className={step === 1 ? 'active' : ''}>
              <div><span>1</span></div>
              <div className="mob_con">Information</div>
            </li>
            <li className={step === 2 ? 'active' : ''}>
              <div><span>2</span></div>
              <div className="mob_con">Attachments</div>
            </li>
            <li className={step === 3 ? 'active' : ''}>
              <div><span>3</span></div>
              <div className="mob_con">Approvers</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="div3">
        <div className="step_wise">
          <div className="border_step" style={{ width: `${(step / 3) * 100}%` }}></div>
          <button className="btn" id="goback" onClick={handleBack}>
            Back
          </button>
          <div className="center_step">
            <h5 className="active">Step</h5>
            <span className="active">{step}</span>
            <span className="pie">/</span>
            <h5>Step 3</h5>
          </div>
          <button className="btn active" onClick={handleNext}>
            {step === 3 ? 'Submit' : 'Next'}
          </button>
        </div>

        <div className="form_div">
          <form onSubmit={handleNext}>
            <div className="con1 step_forward active">
              <h2>Change Request Information (Step {step} of 3)</h2>
              <p>Provide the Information for baseline change</p>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p>Date of Request <span>*</span></p>
                  <input type="date" className="form-control" defaultValue="2026-09-13" required />
                </div>
                <div className="col-md-6 mb-3">
                  <p>Priority <span>*</span></p>
                  <select className="form-select" required>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p>Target Project</p>
                  <select className="form-select">
                    <option value="p1">Emaar Beachfront Tower 1</option>
                    <option value="p2">Dubai Mall Expansion</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <p>Change Type</p>
                  <select className="form-select">
                    <option value="budget">Budget Adjustment</option>
                    <option value="timeline">Schedule Extension</option>
                    <option value="scope">Scope Revision</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
