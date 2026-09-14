import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const NewITProjectRequestPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 5) {
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
          <ul className="stepper5">
            <li className={step === 1 ? 'active' : ''}>
              <div><span>1</span></div>
              <div className="mob_con">Project Information</div>
            </li>
            <li className={step === 2 ? 'active' : ''}>
              <div><span>2</span></div>
              <div className="mob_con">Project Scope</div>
            </li>
            <li className={step === 3 ? 'active' : ''}>
              <div><span>3</span></div>
              <div className="mob_con">Financial Information</div>
            </li>
            <li className={step === 4 ? 'active' : ''}>
              <div><span>4</span></div>
              <div className="mob_con">Cost Details</div>
            </li>
            <li className={step === 5 ? 'active' : ''}>
              <div><span>5</span></div>
              <div className="mob_con">Approvers</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="div3">
        <div className="step_wise">
          <div className="border_step" style={{ width: `${(step / 5) * 100}%` }}></div>
          <button className="btn" id="goback" onClick={handleBack}>
            Back
          </button>
          <div className="center_step">
            <h5 className="active">Step</h5>
            <span className="active">{step}</span>
            <span className="pie">/</span>
            <h5>Step 5</h5>
          </div>
          <button className="btn active" onClick={handleNext}>
            {step === 5 ? 'Submit' : 'Next'}
          </button>
        </div>

        <div className="form_div">
          <form onSubmit={handleNext}>
            <div className="con1 step_forward active">
              <h2>Project Info (Step {step} of 5)</h2>
              <p>Provide the Project Info details</p>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p>Request ID <span>*</span></p>
                  <input type="text" className="form-control" defaultValue="#REQ-000111222" required />
                </div>
                <div className="col-md-6 mb-3">
                  <p>Project Name <span>*</span></p>
                  <input type="text" className="form-control" placeholder="Project Name *" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p>Program <span>*</span></p>
                  <select className="form-select">
                    <option value="">Select Program</option>
                    <option value="p1">Emaar Digital Infrastructure</option>
                    <option value="p2">Retail Application Modernization</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <p>Category</p>
                  <select className="form-select">
                    <option value="">Select Category</option>
                    <option value="c1">Software Development</option>
                    <option value="c2">Cloud Migration</option>
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
