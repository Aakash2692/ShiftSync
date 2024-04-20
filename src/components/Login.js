// Login.js
import React, { useState } from 'react';
import '../components/css/Login.css'; // Import the CSS file

const Login = ({ setUser }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role is employee

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (employeeId.trim() === '' || password.trim() === '') {
      alert('Please enter both employee ID and password.');
      return;
    }
    // Sending employee ID, password, and role for authentication
    setUser({ employeeId, password, role });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="employeeId" aria-required>Employee ID: </label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="role">Role: </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
