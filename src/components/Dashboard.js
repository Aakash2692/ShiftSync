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

  useEffect(() => {
    // Mock user data
    setUserName("John Doe");
    setProject("Project X");
    // Mock dates
    const today = new Date();
    const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const mondayFormatted = monday.toISOString().split("T")[0];
    setFromDate(mondayFormatted);
    setToDate(calculateToDate(mondayFormatted));
    setMaxDate(mondayFormatted);
    setMinDate(calculateMinDate(mondayFormatted));
  }, []);

  useEffect(() => {
    const generateTimesheetTemplate = () => {
      const handleSubmit = (e) => {
        e.preventDefault();
        alert("Timesheet submitted");
      };

      const template = (
        <form className="timesheet-container" onSubmit={handleSubmit}>
          <h3>Timesheet Template</h3>
          {/* Add Employee Name and Project Details */}
          <div className="employee-details">
            <label>Employee Name:</label>
            <span>{userName}</span><br></br>
            {/* Add Project */}
            <label>Project:</label>
            <span>{project}</span><br></br>
            {/* Add Status */}
            <label>Status:</label>
            <span>Pending</span>
          </div>
          {/* From Date */}
          <label>From Date:</label>
          <div className="date-input">
            <button onClick={handlePrevWeek} disabled={fromDate === minDate}>&lt;</button>
            <input type="date" value={fromDate} onChange={handleFromDateChange} min={minDate} max={maxDate} readOnly/>
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
  }, [fromDate, minDate, maxDate, userName, project]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    setToDate(calculateToDate(e.target.value));
  };

  const handlePrevWeek = (e) => {
    e.preventDefault();
    const prevWeek = new Date(new Date(fromDate).getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekDate = prevWeek.toISOString().split('T')[0];
    setFromDate(prevWeekDate);
    setToDate(calculateToDate(prevWeekDate));
  };

  const handleNextWeek = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (fromDate !== today) {
      const nextWeek = new Date(new Date(fromDate).getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextWeekDate = nextWeek.toISOString().split('T')[0];
      setFromDate(nextWeekDate);
      setToDate(calculateToDate(nextWeekDate));
    }
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
    if (e.nativeEvent.submitter && e.nativeEvent.submitter.tagName === "BUTTON" && e.nativeEvent.submitter.type === "submit") {
      e.preventDefault();
      alert("Timesheet submitted");
    }
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
    </div>
  );
};

export default Dashboard;
