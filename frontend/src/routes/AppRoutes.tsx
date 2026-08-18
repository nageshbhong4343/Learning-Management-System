import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardDispatcher } from '../pages/dashboard/DashboardDispatcher';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { BatchesPage } from '../pages/batches/BatchesPage';
import { LMSCoursePage } from '../pages/learning/LMSCoursePage';
import { AptitudePage } from '../pages/aptitude/AptitudePage';
import { CodingPracticePage } from '../pages/coding/CodingPracticePage';
import { SQLPracticePage } from '../pages/sql/SQLPracticePage';
import { AttendancePage } from '../pages/attendance/AttendancePage';
import { MockInterviewsPage } from '../pages/interviews/MockInterviewsPage';
import { PlacementDrivesPage } from '../pages/placement/PlacementDrivesPage';
import { CertificatesPage } from '../pages/certificates/CertificatesPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardDispatcher /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/batches" element={<ProtectedRoute><BatchesPage /></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><LMSCoursePage /></ProtectedRoute>} />
      <Route path="/aptitude" element={<ProtectedRoute><AptitudePage /></ProtectedRoute>} />
      <Route path="/coding" element={<ProtectedRoute><CodingPracticePage /></ProtectedRoute>} />
      <Route path="/sql-practice" element={<ProtectedRoute><SQLPracticePage /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
      <Route path="/mock-interviews" element={<ProtectedRoute><MockInterviewsPage /></ProtectedRoute>} />
      <Route path="/placement-drives" element={<ProtectedRoute><PlacementDrivesPage /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
