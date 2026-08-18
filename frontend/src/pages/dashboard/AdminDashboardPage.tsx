import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { batchesApi } from '../../api/batches';
import { usersApi } from '../../api/users';
import { UserRole } from '../../types/auth';
import { Users, GraduationCap, Plus, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  // Modal State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Batch Form State
  const [batchName, setBatchName] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [batchType, setBatchType] = useState<any>('REGULAR');
  const [batchCapacity, setBatchCapacity] = useState(60);

  // User Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [password, setPassword] = useState('Password123!');

  // Toast / Status Message
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const code = batchCode || `BATCH-${Date.now().toString().slice(-4)}`;
      await batchesApi.createBatch({
        name: batchName,
        code: code,
        batch_type: batchType,
        capacity: batchCapacity,
        start_date: new Date().toISOString().split('T')[0],
      });

      setMessage({ text: `Batch "${batchName}" created successfully!`, type: 'success' });
      setShowBatchModal(false);
      setBatchName('');
      setBatchCode('');
    } catch (err: any) {
      setMessage({ text: err?.response?.data?.detail || 'Failed to create batch.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await usersApi.createUser({
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: userRole,
        password,
      });

      setMessage({ text: `User "${firstName} ${lastName}" (${userRole}) added successfully!`, type: 'success' });
      setShowUserModal(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
    } catch (err: any) {
      const errDetail = err?.response?.data?.email?.[0] || err?.response?.data?.password?.[0] || err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0] || 'Failed to add user.';
      setMessage({ text: errDetail, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Working Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Administration Dashboard</h1>
          <p className="text-xs text-slate-400">Global LMS control, batch monitoring, system security, and user creation.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowBatchModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Batch
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUserModal(true)}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Global Status Message Toast */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          message.type === 'success' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' : 'bg-rose-950/80 border-rose-800 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <span className="text-xs font-semibold text-slate-400">Total Active Students</span>
          <p className="text-2xl font-bold text-white mt-1">1,248</p>
          <span className="text-[10px] text-blue-400">+12% this month</span>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-400">Active Batches</span>
          <p className="text-2xl font-bold text-white mt-1">18</p>
          <span className="text-[10px] text-emerald-400">4 Special Batches</span>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <span className="text-xs font-semibold text-slate-400">Trainers & Faculty</span>
          <p className="text-2xl font-bold text-white mt-1">32</p>
          <span className="text-[10px] text-purple-400">100% Allocated</span>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-400">Placement Drives</span>
          <p className="text-2xl font-bold text-white mt-1">14 Active</p>
          <span className="text-[10px] text-amber-400">85 Candidates Shortlisted</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card title="Batch Performance Overview">
            <div className="space-y-3">
              {[
                { name: 'Batch Alpha-2026', trainer: 'Dr. Robert Chen', students: 45, attendance: '94.8%', status: 'Regular' },
                { name: 'Batch Beta-Placement', trainer: 'Nagesh Bhong', students: 38, attendance: '96.2%', status: 'Placement Batch' },
                { name: 'Batch Gamma-Special', trainer: 'Michael Vance', students: 30, attendance: '91.0%', status: 'Special Batch' },
              ].map((batch, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{batch.name}</h4>
                    <p className="text-xs text-slate-400">Trainer: {batch.trainer} • {batch.students} Students</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-emerald-400 font-semibold">{batch.attendance}</span>
                    <Badge variant="blue" size="sm">{batch.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card title="System Health & Security">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                <span className="text-slate-300">JWT SimpleJWT Engine</span>
                <Badge variant="green" size="sm">Active</Badge>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                <span className="text-slate-300">Sandboxed Coding Runner</span>
                <Badge variant="green" size="sm">Ready</Badge>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                <span className="text-slate-300">Celery Background Workers</span>
                <Badge variant="green" size="sm">4 Workers</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CREATE BATCH MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Batch</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3">
              <Input
                label="Batch Name"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                required
                placeholder="e.g. Batch Delta-2026"
              />
              <Input
                label="Batch Code"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="e.g. BATCH-DELTA (Auto-generated if empty)"
              />
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Batch Type</label>
                <select
                  value={batchType}
                  onChange={(e) => setBatchType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg p-2.5"
                >
                  <option value="REGULAR">Regular Batch</option>
                  <option value="UPCOMING">Upcoming Batch</option>
                  <option value="SPECIAL">Special Batch</option>
                  <option value="PLACEMENT">Placement Batch</option>
                </select>
              </div>
              <Input
                label="Capacity"
                type="number"
                value={batchCapacity}
                onChange={(e) => setBatchCapacity(Number(e.target.value))}
                required
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setShowBatchModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={loading}>
                  Create Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New System User</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="e.g. Ramesh"
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="e.g. Kulkarni"
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. ramesh@lms.com"
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
              />

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Assign User Role</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg p-2.5"
                >
                  <option value={UserRole.STUDENT}>Student</option>
                  <option value={UserRole.TRAINER}>Trainer</option>
                  <option value={UserRole.PLACEMENT_OFFICER}>Placement Officer</option>
                  <option value={UserRole.HR_INTERVIEWER}>HR Interviewer</option>
                  <option value={UserRole.PARENT}>Parent</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                </select>
              </div>

              <Input
                label="Initial Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setShowUserModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={loading}>
                  Add User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
