import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/Dashboard.css";

const Dashboard = ({ user }) => {
  const [userName, setUserName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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
    // Get today's date
    const today = new Date();
    // Calculate the difference between today and the previous Monday
    const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    // Create a new Date object for the previous Monday
    const monday = new Date(today.setDate(diff));
    // Format the date as "YYYY-MM-DD"
    const mondayFormatted = monday.toISOString().split('T')[0];
    // Set fromDate to the previous Monday
    setFromDate(mondayFormatted);
    // Calculate toDate accordingly
    setToDate(calculateToDate(mondayFormatted));
  }, []);

  useEffect(() => {
    const generateTimesheetTemplate = () => {
      const template = (
        <div className="timesheet-container">
          <h3>Timesheet Template</h3>
          <form onSubmit={handleSubmit}>
            <label>From Date:</label>
            <div className="date-input">
              <input type="date" value={fromDate} onChange={handleFromDateChange} />
              <button onClick={handlePrevWeek}>&lt;</button>
              <button onClick={handleNextWeek}>&gt;</button>
            </div>
            <label>To Date:</label>
            <input type="date" value={toDate} disabled />
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
  }, [fromDate]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    setToDate(calculateToDate(e.target.value));
  };

  const handlePrevWeek = (e) => {
    e.preventDefault(); // Prevent default behavior
    const prevWeek = new Date(new Date(fromDate).getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekDate = prevWeek.toISOString().split('T')[0];
    setFromDate(prevWeekDate);
    setToDate(calculateToDate(prevWeekDate));
  };

  const handleNextWeek = (e) => {
    e.preventDefault(); // Prevent default behavior
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
    // Check if the submit event was triggered by clicking the submit button
    if (e.nativeEvent.submitter && e.nativeEvent.submitter.tagName === "BUTTON" && e.nativeEvent.submitter.type === "submit") {
      // Show the alert only when the submit button is clicked
      e.preventDefault(); // Prevent the form from submitting
      alert("Timesheet submitted");
    }
  };
  

const renderTimeOptions = () => {
  const options = [];
  // Start loop from 9 AM (09:00) and end at 6 PM (18:00)
  for (let i = 9; i <= 18; i++) {
    // Add options for each hour
    options.push(
      <option key={`${i}:00`} value={`${i}:00`}>{`${i}:00`}</option>,
      <option key={`${i}:30`} value={`${i}:30`}>{`${i}:30`}</option>
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
