import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Briefcase, Calendar, Video, CheckCircle2, UserCheck, Star } from 'lucide-react';

export const MockInterviewsPage: React.FC = () => {
  const interviews = [
    {
      id: 1,
      type: 'Technical Mock Interview',
      interviewer: 'Dr. Robert Chen',
      date: 'Aug 16, 2026',
      time: '02:00 PM - 02:45 PM',
      link: 'https://meet.google.com/abc-defg-hij',
      scores: { technical: 92, communication: 88, problem_solving: 95, confidence: 90, overall: 91.25 },
      recommendation: 'SELECTED',
      strengths: 'Exceptional Django ORM, REST API design and React component state mastery.',
      weaknesses: 'Review system design edge cases under high load.',
      feedback: 'Outstanding candidate, highly recommended for top-tier tech drives.'
    },
    {
      id: 2,
      type: 'HR & Behavioral Interview',
      interviewer: 'Michael Vance',
      date: 'Aug 12, 2026',
      time: '11:00 AM - 11:30 AM',
      link: 'https://meet.google.com/xyz-uvwx-rst',
      scores: { technical: 85, communication: 90, problem_solving: 88, confidence: 92, overall: 88.75 },
      recommendation: 'SELECTED',
      strengths: 'Clear communication, leadership experience, excellent culture fit.',
      weaknesses: 'None noted.',
      feedback: 'Cleared HR round cleanly.'
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mock Interview & Rubric Evaluation</h1>
          <p className="text-xs text-slate-400">Technical & HR mock interviews, live scorecard evaluations, and interviewer feedback.</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
          Schedule Mock Slot
        </Button>
      </div>

      <div className="space-y-4">
        {interviews.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{item.type}</h3>
                  <Badge variant="purple" size="sm">{item.scores.overall} / 100 OVERALL</Badge>
                  <Badge variant={item.recommendation === 'SELECTED' ? 'green' : 'amber'} size="sm">
                    {item.recommendation}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">Interviewer: <strong className="text-slate-200">{item.interviewer}</strong> • {item.date} ({item.time})</p>
              </div>

              {item.link && (
                <a href={item.link} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" leftIcon={<Video className="w-4 h-4 text-rose-400" />}>
                    Join Meeting Link
                  </Button>
                </a>
              )}
            </div>

            {/* Rubric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Technical</span>
                <p className="text-lg font-bold text-blue-400 mt-0.5">{item.scores.technical} / 100</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Communication</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">{item.scores.communication} / 100</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Problem Solving</span>
                <p className="text-lg font-bold text-purple-400 mt-0.5">{item.scores.problem_solving} / 100</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</span>
                <p className="text-lg font-bold text-amber-400 mt-0.5">{item.scores.confidence} / 100</p>
              </div>
            </div>

            {/* Feedback Details */}
            <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              <div><strong className="text-emerald-400">Strengths:</strong> {item.strengths}</div>
              <div><strong className="text-amber-400">Areas for Improvement:</strong> {item.weaknesses}</div>
              <div className="pt-2 border-t border-slate-800/80"><strong className="text-blue-400">Interviewer Remarks:</strong> {item.feedback}</div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
