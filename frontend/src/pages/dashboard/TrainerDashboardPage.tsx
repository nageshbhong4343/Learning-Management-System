import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, GraduationCap, Calendar, CheckSquare, Users } from 'lucide-react';

export const TrainerDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trainer / Faculty Portal</h1>
        <p className="text-xs text-slate-400">Manage assigned batches, evaluate student assignments, and conduct mock interviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <span className="text-xs font-semibold text-slate-400">Assigned Batches</span>
          <p className="text-2xl font-bold text-white mt-1">3 Batches</p>
          <span className="text-[10px] text-emerald-400">Batch Alpha, Beta & Gamma</span>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <span className="text-xs font-semibold text-slate-400">Pending Mock Interviews</span>
          <p className="text-2xl font-bold text-white mt-1">5 Scheduled Today</p>
          <span className="text-[10px] text-blue-400">Technical & System Design</span>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <span className="text-xs font-semibold text-slate-400">Assignments to Grade</span>
          <p className="text-2xl font-bold text-white mt-1">12 Pending</p>
          <span className="text-[10px] text-purple-400">Django REST API Submissions</span>
        </Card>
      </div>
    </div>
  );
};
