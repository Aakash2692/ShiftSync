import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/Dashboard.css";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [project, setProject] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timesheetTemplate, setTimesheetTemplate] = useState(null);
  const [maxDate, setMaxDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [pastTimesheets, setPastTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  
  // State for rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  useEffect(() => {
    // Mock user data based on role
    if (user.role === "manager") {
      setUserName("Alice Smith");
      setProject("Timesheet App");
    } else {
      setUserName("Vivek Bindra");
      setProject("Database Optimization");
    }

    // Mock dates
    const today = new Date();
    const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const mondayFormatted = monday.toISOString().split("T")[0];
    setFromDate(mondayFormatted);
    setToDate(calculateToDate(mondayFormatted));
    setMaxDate(mondayFormatted);
    setMinDate(calculateMinDate(mondayFormatted));

    // Load past timesheets from localStorage
    const storedTimesheets = JSON.parse(localStorage.getItem("timesheets")) || [];
    setPastTimesheets(storedTimesheets);

    // Set initial filtered timesheets for the current week
    const initialFilteredTimesheets = filterTimesheetsByWeek(storedTimesheets, mondayFormatted, calculateToDate(mondayFormatted));
    setFilteredTimesheets(initialFilteredTimesheets);
  }, [user.role]);

  useEffect(() => {
    const generateTimesheetTemplate = () => {
      const template = (
        <form className="timesheet-container" onSubmit={handleSubmit}>
          <h3>Timesheet Template</h3>
          {/* Add Employee Name and Project Details */}
          <div className="employee-details">
            <label>Employee Name:</label>
            <span>{userName}</span><br />
            {/* Add Project */}
            <label>Project:</label>
            <span>{project}</span><br />
            {/* Add Status */}
            <label>Status:</label>
            <span>{getUserTimesheetStatus()}</span>
            {selectedTimesheet && selectedTimesheet.status === "Rejected" && (
              <div className="rejection-reason-display">
                <p>Rejection Reason:</p>
                <p>{selectedTimesheet.rejectionReason}</p>
              </div>
            )}
          </div>
          {/* From Date */}
          <label>From Date:</label>
          <div className="date-input">
            <button onClick={handlePrevWeek} disabled={fromDate === minDate}>&lt;</button>
            <input type="date" value={fromDate} onChange={handleFromDateChange} min={minDate} max={maxDate} readOnly />
            <button onClick={handleNextWeek} disabled={fromDate === maxDate}>&gt;</button>
          </div>
          {/* To Date */}
          <label>To Date:</label>
          <input type="date" value={toDate} disabled />
          {/* Timesheet Table */}
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Work Hours</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, index) => (
                <tr key={index}>
                  <td>{day}</td>
                  <td>
                    <select
                      name={`startTime_${day}`}
                      onChange={(e) => handleTimeChange(e, day)}
                      disabled={day === "Sunday"}
                    >
                      {renderTimeOptions()}
                    </select>
                  </td>
                  <td>
                    <select
                      name={`endTime_${day}`}
                      onChange={(e) => handleTimeChange(e, day)}
                      disabled={day === "Sunday"}
                    >
                      {renderTimeOptions()}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      name={`workHours_${day}`}
                      readOnly
                      value={day === "Sunday" ? "0" : ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Submit Button */}
          <div className="button-container">
            <button type="submit">Submit Timesheet</button>
          </div>
        </form>
      );
      setTimesheetTemplate(template);
    };

    generateTimesheetTemplate();
  }, [fromDate, minDate, maxDate, userName, project, selectedTimesheet]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    setToDate(calculateToDate(e.target.value));
    updateFilteredTimesheets(e.target.value, calculateToDate(e.target.value));
  };

  const handlePrevWeek = (e) => {
    e.preventDefault();
    const prevWeek = new Date(new Date(fromDate).getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekDate = prevWeek.toISOString().split('T')[0];
    setFromDate(prevWeekDate);
    setToDate(calculateToDate(prevWeekDate));
    updateFilteredTimesheets(prevWeekDate, calculateToDate(prevWeekDate));
  };

  const handleNextWeek = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (fromDate !== today) {
      const nextWeek = new Date(new Date(fromDate).getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextWeekDate = nextWeek.toISOString().split('T')[0];
      setFromDate(nextWeekDate);
      setToDate(calculateToDate(nextWeekDate));
      updateFilteredTimesheets(nextWeekDate, calculateToDate(nextWeekDate));
    }
  };

  const updateFilteredTimesheets = (startDate, endDate) => {
    setFilteredTimesheets(filterTimesheetsByWeek(pastTimesheets, startDate, endDate));
  };

  const filterTimesheetsByWeek = (timesheets, startDate, endDate) => {
    return timesheets.filter((timesheet) => timesheet.fromDate >= startDate && timesheet.toDate <= endDate);
  };

  const calculateToDate = (fromDate) => {
    const toDate = new Date(new Date(fromDate).getTime() + 6 * 24 * 60 * 60 * 1000);
    return toDate.toISOString().split('T')[0];
  };

  const calculateMinDate = (fromDate) => {
    const minDate = new Date(new Date(fromDate).getTime() - 28 * 24 * 60 * 60 * 1000); // 4 weeks back
    return minDate.toISOString().split('T')[0];
  };

  const handleTimeChange = (e, day) => {
    const startTimeName = `startTime_${day}`;
    const endTimeName = `endTime_${day}`;
    const workHoursName = `workHours_${day}`;
    const startTime = document.querySelector(`select[name="${startTimeName}"]`).value;
    const endTime = document.querySelector(`select[name="${endTimeName}"]`).value;
    const [startHour, startMinute, startPeriod] = startTime.split(/:| /);
    const [endHour, endMinute, endPeriod] = endTime.split(/:| /);
    let start = parseInt(startHour, 10) + (startPeriod === "PM" && startHour !== "12" ? 12 : 0) + parseInt(startMinute, 10) / 60;
    let end = parseInt(endHour, 10) + (endPeriod === "PM" && endHour !== "12" ? 12 : 0) + parseInt(endMinute, 10) / 60;
    let hours = end - start;
    if (hours < 0) hours += 24;
    document.querySelector(`input[name="${workHoursName}"]`).value = hours.toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedTimesheets = JSON.parse(localStorage.getItem("timesheets")) || [];
  
    const weekAlreadySubmittedIndex = storedTimesheets.findIndex((timesheet) => {
      return timesheet.employeeId === user.employeeId
        && timesheet.fromDate === fromDate
        && timesheet.toDate === toDate;
    });
  
    if (weekAlreadySubmittedIndex !== -1) {
      // Update existing timesheet
      storedTimesheets[weekAlreadySubmittedIndex].status = "Pending"; // Reset status if resubmitting
      storedTimesheets[weekAlreadySubmittedIndex].hours = calculateTotalHours();
      storedTimesheets[weekAlreadySubmittedIndex].rejectionReason = ""; // Reset rejection reason if resubmitting
    } else {
      // Create a new timesheet object
      const newTimesheet = {
        id: storedTimesheets.length + 1,
        employee: userName,
        employeeId: user.employeeId,
        project: project,
        fromDate: fromDate,
        toDate: toDate,
        status: "Pending",
        hours: calculateTotalHours(),
        rejectionReason: "",
      };
      storedTimesheets.push(newTimesheet);
    }
  
    localStorage.setItem("timesheets", JSON.stringify(storedTimesheets));
    setPastTimesheets(storedTimesheets);
    setFilteredTimesheets(storedTimesheets);
    
    alert("Timesheet submitted successfully.");
    resetWorkHours();
  };
  
  const calculateTotalHours = () => {
    // Calculate total hours worked for the week
    let totalHours = 0;
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((day) => {
      const workHours = parseFloat(document.querySelector(`input[name="workHours_${day}"]`).value) || 0;
      totalHours += workHours;
    });
    return totalHours.toFixed(2);
  };

  const renderTimeOptions = () => {
    const options = [];
    for (let i = 9; i <= 18; i++) {
      options.push(
        <option key={`${i}:00`} value={`${i}:00`}>{`${i}:00`}</option>,
        <option key={`${i}:30`} value={`${i}:30`}>{`${i}:30`}</option>
      );
    }
    return options;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handleValidateTimesheets = () => {
    navigate("/validate-timesheets");
  };

  const getUserTimesheetStatus = () => {
    const currentWeekTimesheets = filteredTimesheets.filter((timesheet) => {
      return timesheet.employeeId === user.employeeId
        && timesheet.fromDate === fromDate
        && timesheet.toDate === toDate;
    });
  
    if (currentWeekTimesheets.length === 0) {
      return "Not Submitted";
    } else {
      const status = currentWeekTimesheets[0].status;
      return status;
    }
  };
  

  const resetWorkHours = () => {
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((day) => {
      document.querySelector(`input[name="workHours_${day}"]`).value = "";
    });
  };

  const handleReject = () => {
    if (!selectedTimesheet) return;
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

  return (
    <div className="dashboard-container">
      <div className="navbar">
        {user.role === "manager" && (
          <button onClick={handleValidateTimesheets}>Validate Timesheets</button>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h2>Dashboard</h2>
      <h3>
        Welcome, {userName} ({user.role})
      </h3>
      {timesheetTemplate}

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

export default Dashboard;
