import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/ValidateTimesheetsPage.css";

const ValidateTimesheetsPage = ({ user }) => {
  const navigate = useNavigate();

  const [pastTimesheets, setPastTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const storedTimesheets = JSON.parse(localStorage.getItem("timesheets")) || [];
    setPastTimesheets(storedTimesheets);
  }, []);

  const handleApprove = (id) => {
    const updatedTimesheets = pastTimesheets.map((timesheet) => {
      if (timesheet.id === id) {
        return { ...timesheet, status: "Approved" };
      }
      return timesheet;
    });
    setPastTimesheets(updatedTimesheets);
    localStorage.setItem("timesheets", JSON.stringify(updatedTimesheets));
  };

  const handleReject = (id) => {
    const timesheetToReject = pastTimesheets.find((timesheet) => timesheet.id === id);
    setSelectedTimesheet(timesheetToReject);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    const updatedTimesheets = pastTimesheets.map((timesheet) => {
      if (timesheet.id === selectedTimesheet.id) {
        return { ...timesheet, status: "Rejected", rejectionReason: rejectionReason };
      }
      return timesheet;
    });
    setPastTimesheets(updatedTimesheets);
    localStorage.setItem("timesheets", JSON.stringify(updatedTimesheets));
    setShowRejectModal(false);
    setRejectionReason("");
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  const handleClearRecords = () => {
    // Clear all past timesheets
    setPastTimesheets([]);
    localStorage.removeItem("timesheets");
  };

  return (
    <div className="timesheets-container">
      <h2>Validate Timesheets</h2>
      <div className="button-container">
        <button className="clear-button" onClick={handleClearRecords}>
          Clear Records
        </button>
      </div>
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
                    <button className="approve-button" onClick={() => handleApprove(timesheet.id)}>
                      Approve
                    </button>
                    <button className="reject-button" onClick={() => handleReject(timesheet.id)}>
                      Reject
                    </button>
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
        <button className="go-back-button" onClick={() => navigate("/")}>
          Go Back to Dashboard
        </button>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="reject-modal">
          <div className="modal-content">
            <span className="close" onClick={handleRejectCancel}>&times;</span>
            <h2>Reject Timesheet</h2>
            <p>Please provide a reason for rejecting this timesheet:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
            ></textarea>
            <div className="button-container">
              <button onClick={handleRejectCancel}>Cancel</button>
              <button onClick={handleRejectConfirm}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidateTimesheetsPage;
