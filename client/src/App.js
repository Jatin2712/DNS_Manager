import React, { useState, useEffect } from 'react';
import './App.css';
import RegisterForm from './components/Auth/RegisterForm';
import LoginForm from './components/Auth/LoginForm';
import Navbar from './components/Navbar';
import DNSTable from './components/DNSRecord/DNSRecordTable';
import DNSForm from './components/DNSRecord/DNSRecordForm';
import DNSEditForm from './components/DNSRecord/DNSRecordEditForm';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} logout={logout} />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dns-table" /> : <Navigate to="/login" />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dns-table" element={isAuthenticated ? <DNSTable /> : <Navigate to="/login" />} />
          <Route path="/add-dns" element={isAuthenticated ? <DNSForm /> : <Navigate to="/login" />} />
          <Route path="/dns-record-form/:recordId" element={isAuthenticated ? <DNSEditForm /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;