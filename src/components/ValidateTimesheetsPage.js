import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/ValidateTimesheetsPage.css";

const ValidateTimesheetsPage = () => {
  const navigate = useNavigate();

  const pastTimesheets = [
    { id: 1, project: "Backend API Development", fromDate: "2024-04-11", toDate: "2024-04-15", status: "Pending", hours: 7 },
    { id: 2, project: "Frontend UI Design", fromDate: "2024-04-04", toDate: "2024-04-08", status: "Approved", hours: 8 },
    { id: 3, project: "Database Optimization", fromDate: "2024-03-28", toDate: "2024-04-01", status: "Rejected", hours: 9 },
    // Add more timesheet data here
  ];

  const handleGoBack = () => {
    navigate("/"); // Redirect to the dashboard page
  };

  return (
    <div className="timesheets-container">
      <h2>Validate Timesheets</h2>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Status</th>
            <th>Hours</th>
            <th>Actions</th> {/* Add a new column for Actions */}
          </tr>
        </thead>
        <tbody>
          {pastTimesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>{timesheet.project}</td>
              <td>{timesheet.fromDate}</td>
              <td>{timesheet.toDate}</td>
              <td>{timesheet.status}</td>
              <td>{timesheet.hours}</td>
              <td>
                <button className="approve-button">Approve</button> {/* Add Approve button */}
                <button className="reject-button">Reject</button> {/* Add Reject button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
        <button className="go-back-button" onClick={handleGoBack}>Go Back to Dashboard</button>
      </div>
    </div>
  );
};

export default ValidateTimesheetsPage;
