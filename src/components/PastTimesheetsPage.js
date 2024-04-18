import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/PastTimesheetsPage.css";

const PastTimesheetsPage = () => {
  const navigate = useNavigate();

  const pastTimesheets = [
    { id: 1, project: "Backend API Development", date: "2024-04-15", status: "Pending", hours: 7 },
    { id: 2, project: "Frontend UI Design", date: "2024-04-08", status: "Approved", hours: 8 },
    { id: 3, project: "Database Optimization", date: "2024-04-01", status: "Rejected", hours: 9 },
    { id: 4, project: "Backend API Development", date: "2024-03-25", status: "Approved", hours: 7 },
    { id: 5, project: "Frontend UI Design", date: "2024-03-18", status: "Approved", hours: 8 },
    { id: 6, project: "Database Optimization", date: "2024-03-11", status: "Approved", hours: 9 },
    { id: 7, project: "Backend API Development", date: "2024-03-04", status: "Rejected", hours: 7 },
    { id: 8, project: "Frontend UI Design", date: "2024-02-26", status: "Approved", hours: 8 },
    { id: 9, project: "Database Optimization", date: "2024-02-19", status: "Pending", hours: 9 },
    { id: 10, project: "Backend API Development", date: "2024-02-12", status: "Approved", hours: 7 },
  ];

  const handleGoBack = () => {
    navigate("/"); // Redirect to the dashboard page
  };

  return (
    <div className="timesheets-container">
      <h2>Past Timesheets</h2>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Date</th>
            <th>Status</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {pastTimesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>{timesheet.project}</td>
              <td>{timesheet.date}</td>
              <td>{timesheet.status}</td>
              <td>{timesheet.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleGoBack}>Go Back to Dashboard</button>
    </div>
  );
};

export default PastTimesheetsPage;
