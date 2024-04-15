import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/Dashboard.css";

const Dashboard = ({ user }) => {
  const [userName, setUserName] = useState("");
  const [timesheetTemplate, setTimesheetTemplate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`/api/user/${user.id}`);
        setUserName(userResponse.data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    const generateTimesheetTemplate = () => {
      const template = (
        <div className="timesheet-container">
          <h3>Timesheet Template</h3>
          <form onSubmit={handleSubmit}>
            <label>From Date:</label>
            <input type="date" name="fromDate" />
            <label>To Date:</label>
            <input type="date" name="toDate" />
            <table className="timesheet-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Work Hours</th>
                  <th>Status</th>
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
                    <td>Pending</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="button-container">
              <button type="submit">Submit Timesheet</button>
            </div>
          </form>
        </div>
      );
      setTimesheetTemplate(template);
    };

    generateTimesheetTemplate();
  }, []);

  const handleTimeChange = (e, day) => {
    const startTimeName = `startTime_${day}`;
    const endTimeName = `endTime_${day}`;
    const workHoursName = `workHours_${day}`;
    const startTime = document.querySelector(
      `select[name="${startTimeName}"]`
    ).value;
    const endTime = document.querySelector(
      `select[name="${endTimeName}"]`
    ).value;
    const [startHour, startMinute, startPeriod] = startTime.split(/:| /);
    const [endHour, endMinute, endPeriod] = endTime.split(/:| /);
    let start =
      parseInt(startHour, 10) +
      (startPeriod === "PM" && startHour !== "12" ? 12 : 0) +
      parseInt(startMinute, 10) / 60;
    let end =
      parseInt(endHour, 10) +
      (endPeriod === "PM" && endHour !== "12" ? 12 : 0) +
      parseInt(endMinute, 10) / 60;
    let hours = end - start;
    if (hours < 0) hours += 24;
    document.querySelector(`input[name="${workHoursName}"]`).value =
      hours.toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Timesheet submitted");
  };

  const renderTimeOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push(
        <option key={`${i}:00 AM`} value={`${i}:00 AM`}>{`${i}:00 AM`}</option>,
        <option key={`${i}:00 PM`} value={`${i}:00 PM`}>{`${i}:00 PM`}</option>
      );
      options.push(
        <option key={`${i}:30 AM`} value={`${i}:30 AM`}>{`${i}:30 AM`}</option>,
        <option key={`${i}:30 PM`} value={`${i}:30 PM`}>{`${i}:30 PM`}</option>
      );
    }
    return options;
  };

  const handleLogout = () => {
    // Clear user session and redirect to login page
    sessionStorage.clear(); // Clears all data stored in sessionStorage
    window.location.href = "/login"; // Redirects to the login page
  };

  const handleViewPastTimesheets = () => {
    // Implement View Past Timesheets functionality
  };

  const handleValidateTimesheets = () => {
    // Implement Validate Timesheets functionality
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">
        {user.role === "manager" && (
          <>
            <button onClick={handleViewPastTimesheets}>View Past Timesheets</button>
            <button onClick={handleValidateTimesheets}>Validate Timesheets</button>
          </>
        )}
        {user.role === "employee" && (
          <button onClick={handleViewPastTimesheets}>View Past Timesheets</button>
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
