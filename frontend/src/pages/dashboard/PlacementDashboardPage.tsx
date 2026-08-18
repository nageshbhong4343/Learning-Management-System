import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Building, Users, CheckCircle2, FileText, Download } from 'lucide-react';

export const PlacementDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Placement Officer Dashboard</h1>
          <p className="text-xs text-slate-400">Manage corporate relations, drive schedules, student eligibility, and job offers.</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export Candidates CSV</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <span className="text-xs font-semibold text-slate-400">Partner Companies</span>
          <p className="text-2xl font-bold text-white mt-1">45 Corporate</p>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <span className="text-xs font-semibold text-slate-400">Students Placed</span>
          <p className="text-2xl font-bold text-white mt-1">312 Placed</p>
          <span className="text-[10px] text-emerald-400">88.5% Placement Rate</span>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-400">Active Drives</span>
          <p className="text-2xl font-bold text-white mt-1">8 Drives</p>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <span className="text-xs font-semibold text-slate-400">Highest Package</span>
          <p className="text-2xl font-bold text-white mt-1">₹28,00,000 / yr (28 LPA)</p>
        </Card>
      </div>
    </div>
  );
};
