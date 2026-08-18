import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { studentsApi } from '../../api/students';
import { UserCheck, Lock, Save, Github, Linkedin, Globe, CheckCircle2, Award, Briefcase } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const profile = user?.student_profile;

  const [phone, setPhone] = useState(user?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(profile?.alternate_phone || '');
  const [city, setCity] = useState(profile?.city || 'San Francisco');
  const [state, setState] = useState(profile?.state || 'California');
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || 'https://github.com/alexmorgan');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || 'https://linkedin.com/in/alexmorgan');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolio_url || 'https://alexmorgan.dev');
  const [savedMessage, setSavedMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLocked = profile?.locked_by_admin || false;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await studentsApi.updateProfile({
        alternate_phone: alternatePhone,
        city,
        state,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
      });

      if (user) {
        setUser({
          ...user,
          student_profile: {
            ...user.student_profile!,
            ...updated,
          },
        });
      }

      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center font-bold text-2xl text-white">
            {user?.first_name?.[0] || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user?.full_name}</h1>
              {isLocked && (
                <Badge variant="amber" size="sm">
                  <Lock className="w-3 h-3 inline mr-1" /> Sensitive Fields Locked by Admin
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email} • {profile?.college || 'Stanford University of Technology'}</p>
          </div>
        </div>

        {savedMessage && (
          <Badge variant="green" size="md">
            <CheckCircle2 className="w-4 h-4 mr-1 inline" /> Profile Saved Successfully!
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Personal & Contact Data */}
        <Card title="Personal & Contact Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name (Locked)" value={user?.full_name || ''} disabled helperText="Contact admin to edit name" />
            <Input label="Email Address (Locked)" value={user?.email || ''} disabled helperText="System identification email" />
            <Input label="Primary Phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLocked} />
            <Input label="Alternate Phone" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} disabled={isLocked} />
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} disabled={isLocked} />
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} disabled={isLocked} />
          </div>
        </Card>

        {/* Academic Details */}
        <Card title="Academic Data (Admin Managed)">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="College" value={profile?.college || 'Stanford University of Technology'} disabled />
            <Input label="Degree & Branch" value={`${profile?.degree || 'B.Tech'} - ${profile?.branch || 'CSE'}`} disabled />
            <Input label="CGPA" value={`${profile?.cgpa || '8.95'} / 10.0`} disabled />
            <Input label="Graduation Year" value={String(profile?.graduation_year || 2026)} disabled />
            <Input label="Current Batch" value={profile?.current_batch_name || 'Batch Alpha-2026'} disabled />
            <Input label="Training Level" value={profile?.training_level || 'Level 3 - Advanced Placement'} disabled />
          </div>
        </Card>

        {/* Portfolio & Developer Links */}
        <Card title="Portfolio & Developer Profiles">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="GitHub Profile URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              leftIcon={<Github className="w-4 h-4" />}
            />
            <Input
              label="LinkedIn Profile URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              leftIcon={<Linkedin className="w-4 h-4" />}
            />
            <Input
              label="Personal Portfolio URL"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              leftIcon={<Globe className="w-4 h-4" />}
            />
          </div>
        </Card>

        {/* Action Bar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            disabled={isLocked}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>

      </form>
    </div>
  );
};
