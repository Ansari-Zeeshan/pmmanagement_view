import React from 'react';
import { Link } from 'react-router-dom';

export const MyTasksPage = () => {
  const taskList = [
    {
      id: 'proj-1',
      name: 'Project 01',
      reference: 'PA-A1563',
      startDate: 'June 30, 2021',
      endDate: 'July 31, 2021',
      totalDays: '31 Days',
      submittedDate: 'July 31, 2021',
      priority: 'Low',
      status: 'Approved',
    },
    {
      id: 'proj-2',
      name: 'Emaar Beachfront Tower 1',
      reference: 'PA-A1564',
      startDate: 'Aug 01, 2021',
      endDate: 'Nov 30, 2021',
      totalDays: '121 Days',
      submittedDate: 'Aug 15, 2021',
      priority: 'High',
      status: 'In Progress',
    },
  ];

  return (
    <div className="divfilter2 divmargin ps-0 pe-0 w-100">
      <div className="row m-0">
        <div className="top_up padding-title">
          <div className="mysticky h1fixed mb-0">
            <h1>IT Project List</h1>
          </div>
        </div>
      </div>
      <div className="table-responsive table-scroll-wrapper shadow-sm rounded border p-0 bg-white mb-4">
        <table className="user_task w-100">
          <thead>
            <tr>
              <th className="userdiv task_head7 stickytask">
                <p className="m-0 fw-bold">Project Name</p>
              </th>
              <th className="userdiv task_head7">
                <p className="m-0 fw-bold">Reference</p>
              </th>
              <th className="userdiv task_head7">
                <p className="m-0 fw-bold">Start Date</p>
              </th>
              <th className="userdiv task_head7">
                <p className="m-0 fw-bold">End Date</p>
              </th>
              <th className="userdiv task_head7">
                <p className="m-0 fw-bold">Total Days</p>
              </th>
              <th className="userdiv task_head7">
                <p className="m-0 fw-bold">Project submitted</p>
              </th>
              <th className="task_head7">
                <p className="m-0 fw-bold">Priority</p>
              </th>
              <th className="task_head8">
                <p className="m-0 fw-bold">Status</p>
              </th>
              <th className="task_head9 task_head7">
                <p className="m-0 fw-bold">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((task) => (
              <tr key={task.id} className="user_add border-bottom">
                <td className="userdiv1 stickytask">
                  <p className="m-0 fw-bold">
                    <Link to="/projects/approval-preview">{task.name}</Link>
                  </p>
                </td>
                <td className="userdiv2">
                  <p className="m-0">{task.reference}</p>
                </td>
                <td className="userdiv3">
                  <p className="m-0">{task.startDate}</p>
                </td>
                <td className="userdiv4">
                  <p className="m-0">{task.endDate}</p>
                </td>
                <td className="userdiv5">
                  <p className="m-0">{task.totalDays}</p>
                </td>
                <td className="userdiv6">
                  <p className="m-0">{task.submittedDate}</p>
                </td>
                <td className="userdiv7">
                  <div className="proj_status">{task.priority}</div>
                </td>
                <td className="userdiv8">
                  <div className="proj_status">{task.status}</div>
                </td>
                <td className="userdiv9">
                  <Link to="/projects/approval-preview">
                    <img src="/icons/eye.svg" alt="view" className="me-2" />
                  </Link>
                  <img src="/icons/print.svg" alt="printer" style={{ cursor: 'pointer' }} onClick={() => window.print()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bottom_navigate">
        <div className="row justify-content-between align-items-center m-0">
          <div className="col-10 col-md-6 d-flex align-items-center leftone">
            <span className="d-flex align-items-center gap-2">
              <p className="m-0">Show</p>
              <select name="pageLen" id="pageLen" className="form-select form-select-sm d-inline-block w-auto">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
              <p className="m-0">per page</p>
            </span>
          </div>
          <div className="col-1 col-md-2 align-items-center rightone d-flex justify-content-end">
            <nav aria-label="...">
              <ul className="pagination align-items-center m-0">
                <li className="page-item disabled me-3" id="ArrowDisable">
                  <i className="material-icons">arrow_back_ios_new</i>
                </li>
                <li className="page-item" id="ArrowNext">
                  <i className="material-icons">arrow_forward_ios</i>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
