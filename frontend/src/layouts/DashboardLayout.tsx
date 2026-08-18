import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { Badge } from '../components/ui/Badge';
import {
  LayoutDashboard, UserCheck, Users, GraduationCap, BookOpen,
  FileText, Code, Database, CalendarCheck, Award, Briefcase,
  Building, HelpCircle, Bell, LogOut, Menu, X, ShieldCheck, Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getRoleBadgeColor = (r: UserRole | null) => {
    switch (r) {
      case UserRole.SUPER_ADMIN: return 'purple';
      case UserRole.ADMIN: return 'blue';
      case UserRole.TRAINER: return 'green';
      case UserRole.PLACEMENT_OFFICER: return 'amber';
      case UserRole.STUDENT: return 'blue';
      case UserRole.PARENT: return 'purple';
      case UserRole.HR_INTERVIEWER: return 'slate';
      default: return 'slate';
    }
  };

  const navItems: SidebarItem[] = [
    { title: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, path: '/dashboard', roles: Object.values(UserRole) },
    { title: 'My Profile', icon: <UserCheck className="w-4 h-4" />, path: '/profile', roles: [UserRole.STUDENT] },
    { title: 'Students', icon: <Users className="w-4 h-4" />, path: '/students', roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TRAINER, UserRole.PLACEMENT_OFFICER] },
    { title: 'Batches', icon: <GraduationCap className="w-4 h-4" />, path: '/batches', roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TRAINER, UserRole.STUDENT] },
    { title: 'Learning / LMS', icon: <BookOpen className="w-4 h-4" />, path: '/learning', roles: [UserRole.STUDENT, UserRole.TRAINER, UserRole.ADMIN] },
    { title: 'Aptitude Practice', icon: <FileText className="w-4 h-4" />, path: '/aptitude', roles: [UserRole.STUDENT, UserRole.TRAINER] },
    { title: 'Coding Practice', icon: <Code className="w-4 h-4" />, path: '/coding', roles: [UserRole.STUDENT, UserRole.TRAINER, UserRole.ADMIN] },
    { title: 'SQL Sandbox', icon: <Database className="w-4 h-4" />, path: '/sql-practice', roles: [UserRole.STUDENT, UserRole.TRAINER] },
    { title: 'Attendance', icon: <CalendarCheck className="w-4 h-4" />, path: '/attendance', roles: [UserRole.STUDENT, UserRole.TRAINER, UserRole.ADMIN, UserRole.PARENT] },
    { title: 'Mock Interviews', icon: <Briefcase className="w-4 h-4" />, path: '/mock-interviews', roles: [UserRole.STUDENT, UserRole.TRAINER, UserRole.HR_INTERVIEWER, UserRole.PLACEMENT_OFFICER] },
    { title: 'Placement Drives', icon: <Building className="w-4 h-4" />, path: '/placement-drives', roles: [UserRole.STUDENT, UserRole.PLACEMENT_OFFICER, UserRole.ADMIN] },
    { title: 'Certificates', icon: <Award className="w-4 h-4" />, path: '/certificates', roles: [UserRole.STUDENT, UserRole.ADMIN] },
  ];

  const allowedNav = navItems.filter(item => role && item.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0 flex flex-col justify-between`}>
        
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>LMS Portal</span>
            </Link>
            <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">Main Navigation</div>
            {allowedNav.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout at Bottom */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                <Badge variant={getRoleBadgeColor(role)} size="sm">
                  {role?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navbar */}
        <header className="h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <Home className="w-3.5 h-3.5" />
              <span>/</span>
              <span className="text-slate-200 capitalize font-medium">{location.pathname.replace('/', '') || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Mode: <strong className="text-blue-400">{user?.login_mode}</strong></span>
            </div>

            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};
