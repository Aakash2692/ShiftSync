// Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/css/Dashboard.css';

const Dashboard = ({ user }) => {
  const [userName, setUserName] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  const [timesheetTemplate, setTimesheetTemplate] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Pending');

  const generateTimesheetTemplate = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(endOfWeek.toISOString().split('T')[0]);

    const template = (
      <div className="timesheet-container">
        <h3>Timesheet Template</h3>
        <div>
          <p><strong>Name:</strong> {userName}</p>
          {projectDetails && (
            <>
              <p><strong>Project:</strong> {projectDetails.name}</p>
              <p><strong>Details:</strong> {projectDetails.details}</p>
            </>
          )}
          <p><strong>Status:</strong> {status}</p> {/* Display status */}
        </div>
        <form onSubmit={handleSubmit}>
          <label>Start Date:</label>
          <input type="date" name="startDate" value={startDate} readOnly />
          <label>End Date:</label>
          <input type="date" name="endDate" value={endDate} readOnly />
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
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <tr key={index}>
                  <td>{day}</td>
                  <td>
                    <select
                      name={`startTime_${day}`}
                      onChange={(e) => handleTimeChange(e, day)}
                    >
                      {renderTimeOptions()}
                    </select>
                  </td>
                  <td>
                    <select
                      name={`endTime_${day}`}
                      onChange={(e) => handleTimeChange(e, day)}
                    >
                      {renderTimeOptions()}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      name={`workHours_${day}`}
                      readOnly
                      value={day === 'Sunday' ? '0' : ''}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="button-container">
          <button type="submit">Submit Timesheet</button>
        </div>
        {/* Include status of the timesheet here */}
      </div>
    );
    setTimesheetTemplate(template);
  };

  useEffect(() => {
    // Fetch user details
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`/api/user/${user.id}`); // Assuming endpoint for fetching user details
        setUserName(userResponse.data.name);
        // Fetch project details for the user
        const projectDetailsResponse = await axios.get(`/api/project/${user.projectId}`);
        setProjectDetails(projectDetailsResponse.data);
        // Generate timesheet template
        generateTimesheetTemplate();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [user.id, user.projectId]);

  useEffect(() => {
    // Generate timesheet template
    generateTimesheetTemplate();
  }, [userName, projectDetails, status]);

  const handleTimeChange = (e, day) => {
    const startTimeName = `startTime_${day}`;
    const endTimeName = `endTime_${day}`;
    const workHoursName = `workHours_${day}`;
    const startTime = document.querySelector(`select[name="${startTimeName}"]`).value;
    const endTime = document.querySelector(`select[name="${endTimeName}"]`).value;
    
    // Parse start and end times
    const [startHour, startMinute, startPeriod] = startTime.split(/:| /);
    const [endHour, endMinute, endPeriod] = endTime.split(/:| /);
  
    // Convert start and end times to 24-hour format
    let start = parseInt(startHour, 10) + (startPeriod === 'PM' && startHour !== '12' ? 12 : 0) + parseInt(startMinute, 10) / 60;
    let end = parseInt(endHour, 10) + (endPeriod === 'PM' && endHour !== '12' ? 12 : 0) + parseInt(endMinute, 10) / 60;
  
    // Calculate work hours
    let hours = end - start;
    if (hours < 0) {
      hours += 24; // Handle cases where end time is on the next day
    }
  
    // Update the work hours input field
    const workHoursInput = document.querySelector(`input[name="${workHoursName}"]`);
    if (day === 'Sunday') {
      workHoursInput.value = '0'; // Set work hours to 0 for Sunday
    } else {
      workHoursInput.value = hours.toFixed(2);
    }
  
    // Disable Sunday hours
    if (day === 'Sunday') {
      document.querySelector(`select[name="${startTimeName}"]`).selectedIndex = 0;
      document.querySelector(`select[name="${endTimeName}"]`).selectedIndex = 0;
    }
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit timesheet logic
    alert('Timesheet submitted');
  };

  const renderTimeOptions = () => {
    const options = [];
    const startHour = 9; // Start time from 9 AM
    const endHour = 19; // End time at 7 PM
  
    for (let i = startHour; i <= endHour; i++) {
      options.push(
        <option key={`${i}:00 AM`} value={`${i}:00 AM`}>{`${i}:00 AM`}</option>,
        <option key={`${i}:00 PM`} value={`${i}:00 PM`}>{`${i}:00 PM`}</option>
      );
      options.push(
        <option key={`${i}:30 AM`} value={`${i}:30 AM`}>{`${i}:30 AM`}</option>,
        <option key={`${i}:30 PM`} value={`${i}:30 PM`}>{`${i}:30 PM`}</option>
      );
    }
  
    // Disable work hours selection for Sunday and set default value to 0
    options.push(
      <option key="0:00" value="0:00" disabled>Sunday</option>
    );
  
    return options;
  };

  return (
    <div className="dashboard-container">
      <div className="hamburger-menu">
        {user.role === 'manager' && (
          <>
            <button onClick={() => { /* Implement View Past Timesheets functionality */ }}>
              View Past Timesheets
            </button>
            <button onClick={() => { /* Implement Validate Timesheets functionality */ }}>
              Validate Timesheets
            </button>
          </>
        )}
        {user.role === 'employee' && (
          <button onClick={() => { /* Implement View Past Timesheets functionality */ }}>
            View Past Timesheets
          </button>
        )}
      </div>
      <h2>Dashboard</h2>
      {timesheetTemplate}
    </div>
  );
};

export default Dashboard;
