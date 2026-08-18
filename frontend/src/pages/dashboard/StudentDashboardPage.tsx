import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  UserCheck, Award, Code, Database, Calendar, Briefcase, Building,
  CheckCircle2, Clock, FileText, ArrowUpRight, TrendingUp, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid
} from 'recharts';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.student_profile;

  const testPerformanceData = [
    { subject: 'Python', score: 92, target: 80 },
    { subject: 'SQL', score: 88, target: 80 },
    { subject: 'Aptitude', score: 85, target: 80 },
    { subject: 'DSA', score: 95, target: 80 },
    { subject: 'React', score: 90, target: 80 },
  ];

  const attendanceData = [
    { month: 'Jan', attendance: 95 },
    { month: 'Feb', attendance: 92 },
    { month: 'Mar', attendance: 98 },
    { month: 'Apr', attendance: 94 },
    { month: 'May', attendance: 96 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 border border-blue-800/50 shadow-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-full bg-blue-600 border-2 border-white/20 flex items-center justify-center font-bold text-2xl shadow-inner text-white">
            {user?.first_name?.[0] || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user?.full_name}</h1>
              <Badge variant="green" size="sm">Active Student</Badge>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">{user?.email} • {profile?.college || 'Stanford University of Technology'}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
              <span>Batch: <strong className="text-white">{profile?.current_batch_name || 'Batch Alpha-2026'}</strong></span>
              <span>•</span>
              <span>Level: <strong className="text-emerald-400">{profile?.training_level || 'Level 3 - Advanced'}</strong></span>
              <span>•</span>
              <span>Status: <strong className="text-blue-300">{profile?.placement_status || 'Eligible'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 z-10">
          <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
            Resume Learning
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
            View Credentials
          </Button>
        </div>
      </div>

      {/* 8 Core Dashboard Score Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        
        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Attendance</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{profile?.attendance_percentage || 94.8}%</p>
          <span className="text-[10px] text-emerald-400 font-medium">Above 85% requirement</span>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Coding Score</span>
            <Code className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{profile?.coding_score || 95.0} / 100</p>
          <span className="text-[10px] text-blue-400 font-medium">Top 5% in Batch</span>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Mock Interview</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{profile?.mock_interview_score || 91.5} / 100</p>
          <span className="text-[10px] text-purple-400 font-medium">Recommended for HR</span>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Aptitude Score</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{profile?.aptitude_score || 89.2} / 100</p>
          <span className="text-[10px] text-amber-400 font-medium">Passed Level 3 Test</span>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">SQL Practice</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">42 Solved</p>
          <span className="text-[10px] text-cyan-400 font-medium">100% Query Accuracy</span>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Placement Drives</span>
            <Building className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">3 Upcoming</p>
          <span className="text-[10px] text-rose-400 font-medium">TCS, Infosys, Google</span>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Certificate Score</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">{profile?.certificate_score || 88.0}%</p>
          <span className="text-[10px] text-indigo-400 font-medium">Passed Threshold (80%)</span>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Items</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">2 Assignments</p>
          <span className="text-[10px] text-teal-400 font-medium">Due in 3 days</span>
        </Card>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7">
          <Card title="Subject Performance & Test Scores" subtitle="Scores compared against 80% passing threshold">
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card title="Monthly Attendance Trend" subtitle="Consistency over the last 5 months">
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Area type="monotone" dataKey="attendance" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>

      {/* Upcoming Placement Drives & Mock Interview Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6">
          <Card title="Upcoming Placement Drives" action={<Button variant="ghost" size="sm">View All</Button>}>
            <div className="space-y-3">
              {[
                { company: 'Google Software Engineering Drive', role: 'SDE-1 (Frontend & Systems)', date: 'Aug 24, 2026', package: '₹24,00,000 / yr (24 LPA)', status: 'Applied' },
                { company: 'TCS Digital Campus Hiring', role: 'Full Stack Developer', date: 'Aug 28, 2026', package: '₹9,00,000 / yr (9 LPA)', status: 'Shortlisted' },
                { company: 'Infosys Specialist Programmer', role: 'Python & AI Engineer', date: 'Sep 02, 2026', package: '₹12,50,000 / yr (12.5 LPA)', status: 'Eligible' },
              ].map((drive, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{drive.company}</h4>
                    <p className="text-xs text-slate-400">{drive.role} • {drive.package}</p>
                    <span className="text-[10px] text-blue-400 font-medium">Drive Date: {drive.date}</span>
                  </div>
                  <Badge variant={drive.status === 'Shortlisted' ? 'green' : 'blue'} size="sm">
                    {drive.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card title="Mock Interview & Rubric Feed" action={<Button variant="ghost" size="sm">Schedule</Button>}>
            <div className="space-y-3">
              {[
                { interviewer: 'Dr. Robert Chen', type: 'Technical Mock (Django & React)', score: '91/100', status: 'Passed & Recommended', date: 'Yesterday' },
                { interviewer: 'Michael Vance', type: 'HR & Communication Round', score: '88/100', status: 'Cleared', date: 'Aug 12, 2026' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{item.type}</h4>
                      <Badge variant="purple" size="sm">{item.score}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">Interviewer: {item.interviewer} • {item.date}</p>
                    <span className="text-[10px] text-emerald-400 font-medium">{item.status}</span>
                  </div>
                  <Button variant="outline" size="sm">Feedback</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
