// App.js
import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css'; // Import the CSS file

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <div className="background-image">
        <h1>ShiftSync</h1>
        <h2>An Employee Time-Entry Management System</h2>
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <Dashboard user={user} />
        )}
      </div>
    </div>
  );
};

export default App;
