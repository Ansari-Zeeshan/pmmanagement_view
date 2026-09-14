import React, { useState } from 'react';

export const SearchResultsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = ['Files', 'Updates', 'Tag', 'People'];

  return (
    <div className="divfilter2 ps-0 pe-0 w-100">
      <div className="search_div p-4">
        <div className="col-md-12 d-flex justify-content-start mb-3">
          <h1 className="fs-3 fw-bold text-dark m-0">Search</h1>
        </div>
        <div className="col-md-12 mb-4">
          <input
            type="text"
            className="form-control form-control-lg fs-6"
            placeholder="Search Everything"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-12 search_con">
          <p className="fw-semibold text-muted mb-2">I am Looking For</p>
          <div className="btn-flex d-flex gap-2 mb-4">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                className={`btn ${activeFilter === opt ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActiveFilter(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <h5 className="fw-bold text-dark fs-6 mb-2">Recent Searches</h5>
          <p className="grey text-muted mb-1 cursor-pointer">Emaar Beachfront Tower 1 baseline report</p>
          <p className="grey text-muted mb-1 cursor-pointer">Fitout Process Major work permit</p>
          <p className="grey text-muted mb-1 cursor-pointer">John Doe project lead deliverables</p>
        </div>
      </div>
    </div>
  );
};
