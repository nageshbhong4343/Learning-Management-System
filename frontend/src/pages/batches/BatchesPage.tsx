import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { batchesApi, Batch } from '../../api/batches';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { GraduationCap, Users, Calendar, Clock, Plus, Filter, Search } from 'lucide-react';

export const BatchesPage: React.FC = () => {
  const { role } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [batchType, setBatchType] = useState<any>('REGULAR');
  const [capacity, setCapacity] = useState(60);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await batchesApi.getBatches();
      setBatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await batchesApi.createBatch({
        name,
        code,
        batch_type: batchType,
        capacity,
        start_date: new Date().toISOString().split('T')[0],
      });
      setShowCreateModal(false);
      setName('');
      setCode('');
      fetchBatches();
    } catch (err) {
      alert('Failed to create batch.');
    }
  };

  const filtered = batches.filter(b => {
    const matchesType = filterType === 'ALL' || b.batch_type === filterType;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getBatchBadgeColor = (t: string) => {
    switch (t) {
      case 'PLACEMENT': return 'amber';
      case 'SPECIAL': return 'purple';
      case 'UPCOMING': return 'blue';
      default: return 'green';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Management</h1>
          <p className="text-xs text-slate-400">Regular, Special, Upcoming, and Placement acceleration batches.</p>
        </div>

        {role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN ? (
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create New Batch
          </Button>
        ) : null}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search batches by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'REGULAR', 'PLACEMENT', 'SPECIAL', 'UPCOMING'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap border transition ${
                filterType === type
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading batches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <Card key={b.id} className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={getBatchBadgeColor(b.batch_type)} size="sm">
                    {b.batch_type} BATCH
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400">{b.code}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{b.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{b.description || 'Full stack software engineering & placement training.'}</p>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> Timing:
                    </span>
                    <span className="font-semibold text-slate-200">{b.batch_timing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> Start Date:
                    </span>
                    <span>{b.start_date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5" /> Capacity:
                    </span>
                    <span className="font-semibold text-emerald-400">{b.enrolled_count} / {b.capacity} Enrolled</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Trainer: <strong className="text-white">{b.trainer_details?.full_name || 'Dr. Robert Chen'}</strong></span>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Batch</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <Input label="Batch Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Batch Gamma-2026" />
              <Input label="Batch Code" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="e.g. BATCH-GAMMA" />
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
              <Input label="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} required />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create Batch</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
