import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/ValidateTimesheetsPage.css";

const ValidateTimesheetsPage = () => {
  const navigate = useNavigate();

  const [pastTimesheets, setPastTimesheets] = useState([
    { id: 1, employee: "John Doe", employeeId: "EMP001", project: "Backend API Development", fromDate: "2024-04-11", toDate: "2024-04-15", status: "Pending", hours: 42, rejectionReason: "" },
    { id: 2, employee: "Jane Smith", employeeId: "EMP002", project: "Frontend UI Design", fromDate: "2024-04-04", toDate: "2024-04-08", status: "Approved", hours: 44, rejectionReason: "" },
    { id: 3, employee: "Michael Johnson", employeeId: "EMP003", project: "Database Optimization", fromDate: "2024-03-28", toDate: "2024-04-01", status: "Rejected", hours: 40, rejectionReason: "Incomplete timesheet" },
    // Add more timesheet data here
  ]);

  const [rejectComment, setRejectComment] = useState(""); // State for reject comment
  const [activeRejectId, setActiveRejectId] = useState(null); // State for active reject id

  const handleGoBack = () => {
    navigate("/"); // Redirect to the dashboard page
  };

  const handleApprove = (id) => {
    const updatedTimesheets = pastTimesheets.map((timesheet) => {
      if (timesheet.id === id) {
        return { ...timesheet, status: "Approved" };
      }
      return timesheet;
    });
    setPastTimesheets(updatedTimesheets);
  };

  const handleReject = (id) => {
    // Set the active reject id
    setActiveRejectId(id);
    // Clear the comment when another row is rejected
    setRejectComment("");
  };

  const handleConfirmReject = () => {
    if (!rejectComment.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    const updatedTimesheets = pastTimesheets.map((timesheet) => {
      if (timesheet.id === activeRejectId) {
        return { ...timesheet, status: "Rejected", rejectionReason: rejectComment.trim() };
      }
      return timesheet;
    });
    setPastTimesheets(updatedTimesheets);
    setRejectComment("");
    setActiveRejectId(null); // Reset active reject id
  };

  return (
    <div className="timesheets-container">
      <h2>Validate Timesheets</h2>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Employee ID</th>
            <th>Project</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Status</th>
            <th>Hours</th>
            <th>Actions</th>
            <th>Rejection Reason</th>
          </tr>
        </thead>
        <tbody>
          {pastTimesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>{timesheet.employee}</td>
              <td>{timesheet.employeeId}</td>
              <td>{timesheet.project}</td>
              <td>{timesheet.fromDate}</td>
              <td>{timesheet.toDate}</td>
              <td>{timesheet.status}</td>
              <td>{timesheet.hours}</td>
              <td>
                {timesheet.status === "Pending" && (
                  <>
                    <button className="approve-button" onClick={() => handleApprove(timesheet.id)}>Approve</button>
                    <button className="reject-button" onClick={() => handleReject(timesheet.id)}>Reject</button>
                    {activeRejectId === timesheet.id && (
                      <div className="reject-comment">
                        <textarea
                          rows="2"
                          placeholder="Enter reason for rejection..."
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                        ></textarea>
                        <button className="confirm-reject" onClick={handleConfirmReject}>Confirm Reject</button>
                      </div>
                    )}
                  </>
                )}
              </td>
              <td>
                {timesheet.status === "Rejected" && (
                  <span>{timesheet.rejectionReason}</span>
                )}
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
