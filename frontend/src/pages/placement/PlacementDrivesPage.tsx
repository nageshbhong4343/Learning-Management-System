import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Building, Calendar, MapPin, DollarSign, CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';

export const PlacementDrivesPage: React.FC = () => {
  const [appliedIds, setAppliedIds] = useState<number[]>([1]);

  const drives = [
    {
      id: 1,
      company: 'Google Cloud India',
      title: 'Software Engineer - Entry Level (SDE 1)',
      location: 'Bengaluru / Hyderabad (Hybrid)',
      package: '₹24,00,000 / yr (24 LPA)',
      min_cgpa: 8.0,
      deadline: '2026-08-25',
      date: '2026-09-02',
      status: 'SHORTLISTED',
      description: 'Building high-scale Django microservices, React web applications, and distributed databases.'
    },
    {
      id: 2,
      company: 'TCS Digital',
      title: 'Digital Systems Developer',
      location: 'Mumbai / Pune / Hybrid',
      package: '₹9,00,000 / yr (9 LPA)',
      min_cgpa: 7.0,
      deadline: '2026-08-30',
      date: '2026-09-10',
      status: 'ELIGIBLE',
      description: 'Campus placement drive for full stack web development and cloud infrastructure.'
    },
    {
      id: 3,
      company: 'Infosys Specialist Programmer',
      title: 'Python & AI Engineer',
      location: 'Bengaluru / Mysuru',
      package: '₹12,50,000 / yr (12.5 LPA)',
      min_cgpa: 7.5,
      deadline: '2026-09-05',
      date: '2026-09-15',
      status: 'ELIGIBLE',
      description: 'Machine learning model API integration and scalable Python services.'
    }
  ];

  const handleApply = (id: number) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Placement Drives & Corporate Relations</h1>
          <p className="text-xs text-slate-400">Campus hiring drives, eligibility screening, application tracking, and job offers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {drives.map((d) => {
          const isApplied = appliedIds.includes(d.id);
          return (
            <Card key={d.id} className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={isApplied ? 'green' : 'blue'} size="sm">
                    {isApplied ? 'APPLIED' : 'ELIGIBLE'}
                  </Badge>
                  <span className="text-xs font-semibold text-emerald-400">{d.package}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-blue-400 shrink-0" />
                  <h3 className="text-sm font-bold text-white leading-tight">{d.company}</h3>
                </div>

                <h4 className="text-xs font-semibold text-slate-200 mb-2">{d.title}</h4>
                <p className="text-xs text-slate-400 mb-4">{d.description}</p>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-slate-200">{d.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Min CGPA:</span>
                    <span className="font-semibold text-amber-400">{d.min_cgpa} CGPA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Drive Date:</span>
                    <span>{d.date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Deadline: {d.deadline}</span>
                <Button
                  variant={isApplied ? 'outline' : 'primary'}
                  size="sm"
                  disabled={isApplied}
                  onClick={() => handleApply(d.id)}
                  leftIcon={isApplied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                >
                  {isApplied ? 'Applied' : 'Apply Now'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};
