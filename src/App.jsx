import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DiagnosticPage from './pages/DiagnosticPage';
import ResultPage from './pages/ResultPage';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/evaluacion" element={<DiagnosticPage />} />
        <Route path="/resultado" element={<ResultPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
