import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Award, Download, CheckCircle2, ShieldCheck, FileCheck, Sparkles } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.student_profile;

  const certificateScore = profile?.certificate_score || 88.0;
  const passingThreshold = 80.0; // Configurable threshold
  const isEligible = certificateScore >= passingThreshold;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-bold text-white">Certificate Examination & Verification</h1>
        <p className="text-xs text-slate-400">Automated evaluation, passing threshold status, and verified credential certificates.</p>
      </div>

      {/* Threshold Status Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-blue-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
              {certificateScore}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Certificate Eligibility Status</h3>
                <Badge variant={isEligible ? 'green' : 'red'} size="sm">
                  {isEligible ? 'PASSED & ELIGIBLE' : 'INELIGIBLE'}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Your Score: <strong className="text-emerald-400">{certificateScore}%</strong> (Passing Threshold: {passingThreshold}%)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Official Certificate Presentation Card */}
      {isEligible && (
        <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Badge variant="purple" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> VERIFIED CREDENTIAL
            </Badge>
          </div>

          <div className="text-center space-y-4 my-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Certificate of Completion</span>
            
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{user?.full_name}</h2>

            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              Has successfully fulfilled all curriculum requirements, sandboxed coding assessments, and passed the official examination for:
            </p>

            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Full Stack Software Engineering & Placement Program
            </h3>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 max-w-md mx-auto">
              <span>Issue Date: <strong>Aug 18, 2026</strong></span>
              <span>•</span>
              <span>Certificate No: <strong className="font-mono text-slate-200">CERT-2026-98765432</strong></span>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => alert("Downloading verified PDF certificate...")}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download PDF Certificate
            </Button>
          </div>

        </Card>
      )}

    </div>
  );
};
