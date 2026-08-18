import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Calendar, Award, Code, Briefcase, Send, CheckCircle2 } from 'lucide-react';

export const ParentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const parentProfile = user?.parent_profile;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Parent Academic Portal</h1>
          <p className="text-xs text-slate-400">
            Monitoring Ward: <strong className="text-blue-400">{parentProfile?.student_name || 'Alex Morgan'}</strong>
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Send className="w-4 h-4" />}>
          Request Detailed SMS/Email Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-400">Ward Attendance</span>
          <p className="text-2xl font-bold text-white mt-1">94.8%</p>
          <span className="text-[10px] text-emerald-400">Regular & Punctual</span>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <span className="text-xs font-semibold text-slate-400">Certificate Exam</span>
          <p className="text-2xl font-bold text-white mt-1">88.0%</p>
          <span className="text-[10px] text-blue-400">Passed Threshold</span>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <span className="text-xs font-semibold text-slate-400">Mock Interview Score</span>
          <p className="text-2xl font-bold text-white mt-1">91.5 / 100</p>
          <span className="text-[10px] text-purple-400">Cleared Technical Round</span>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-400">Placement Status</span>
          <p className="text-2xl font-bold text-white mt-1">Shortlisted</p>
          <span className="text-[10px] text-amber-400">Google & TCS Drives</span>
        </Card>
      </div>
    </div>
  );
};
