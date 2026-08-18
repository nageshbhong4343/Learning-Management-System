import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { StudentDashboardPage } from './StudentDashboardPage';
import { AdminDashboardPage } from './AdminDashboardPage';
import { TrainerDashboardPage } from './TrainerDashboardPage';
import { PlacementDashboardPage } from './PlacementDashboardPage';
import { ParentDashboardPage } from './ParentDashboardPage';

export const DashboardDispatcher: React.FC = () => {
  const { role } = useAuth();

  switch (role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return <AdminDashboardPage />;
    case UserRole.TRAINER:
      return <TrainerDashboardPage />;
    case UserRole.PLACEMENT_OFFICER:
    case UserRole.HR_INTERVIEWER:
      return <PlacementDashboardPage />;
    case UserRole.PARENT:
      return <ParentDashboardPage />;
    case UserRole.STUDENT:
    default:
      return <StudentDashboardPage />;
  }
};
