import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Calendar, CheckCircle2, XCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ATTENDANCE' | 'LEAVE'>('ATTENDANCE');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const attendanceRecords = [
    { date: '2026-08-18', status: 'PRESENT', batch: 'Batch Alpha-2026', remarks: 'On Time' },
    { date: '2026-08-17', status: 'PRESENT', batch: 'Batch Alpha-2026', remarks: 'On Time' },
    { date: '2026-08-16', status: 'LATE', batch: 'Batch Alpha-2026', remarks: '15 mins late' },
    { date: '2026-08-15', status: 'PRESENT', batch: 'Batch Alpha-2026', remarks: 'On Time' },
    { date: '2026-08-14', status: 'LEAVE', batch: 'Batch Alpha-2026', remarks: 'Approved Leave' },
  ];

  const leaveHistory = [
    { id: 1, start: '2026-08-28', end: '2026-08-30', reason: 'Attending National Hackathon', status: 'APPROVED', remarks: 'Approved with full academic credit' },
    { id: 2, start: '2026-07-10', end: '2026-07-11', reason: 'Medical emergency', status: 'APPROVED', remarks: 'Medical certificate verified' },
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance & Leave Management</h1>
          <p className="text-xs text-slate-400">Daily lecture logs, batch attendance records, and leave request portal.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => setShowLeaveModal(true)} leftIcon={<FileText className="w-4 h-4" />}>
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-400">Overall Attendance</span>
          <p className="text-2xl font-bold text-white mt-1">94.8%</p>
          <span className="text-[10px] text-emerald-400">Punctual & Active</span>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <span className="text-xs font-semibold text-slate-400">Present Days</span>
          <p className="text-2xl font-bold text-white mt-1">42 Days</p>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-400">Late Days</span>
          <p className="text-2xl font-bold text-white mt-1">2 Days</p>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <span className="text-xs font-semibold text-slate-400">Leaves Taken</span>
          <p className="text-2xl font-bold text-white mt-1">3 Days</p>
          <span className="text-[10px] text-purple-400">All Approved</span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'ATTENDANCE' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Daily Attendance Records
        </button>
        <button
          onClick={() => setActiveTab('LEAVE')}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'LEAVE' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Leave Applications & History
        </button>
      </div>

      {activeTab === 'ATTENDANCE' ? (
        <Card title="Attendance History Log">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {attendanceRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono">{r.date}</td>
                    <td className="p-3 font-semibold">{r.batch}</td>
                    <td className="p-3">
                      <Badge variant={r.status === 'PRESENT' ? 'green' : r.status === 'LATE' ? 'amber' : 'red'} size="sm">
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-400">{r.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card title="Submitted Leave Applications">
          <div className="space-y-3">
            {leaveHistory.map((l) => (
              <div key={l.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{l.reason}</h4>
                    <Badge variant="green" size="sm">{l.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Duration: {l.start} to {l.end}</p>
                  <span className="text-[11px] text-emerald-400 font-medium">{l.remarks}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold text-white">Apply for Leave</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Leave request submitted!"); setShowLeaveModal(false); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Reason for Leave</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} placeholder="Provide details..." className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Application</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
