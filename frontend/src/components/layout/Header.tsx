import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, 
  Compass, 
  Clock, 
  FileCheck2, 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  ChevronDown, 
  GraduationCap,
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, switchDemoUser, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = async (type: 'student1' | 'student2' | 'admin') => {
    setDemoDropdownOpen(false);
    await switchDemoUser(type);
    if (type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', authRequired: true },
    { name: 'Results', path: '/results', authRequired: false },
    { name: 'Opportunities', path: '/opportunities', authRequired: false },
    { name: 'Revaluation', path: '/revaluation', authRequired: false },
    { name: 'Deadlines', path: '/deadlines', authRequired: false },
    { name: 'Documents', path: '/documents', authRequired: false },
    { name: 'Next Steps', path: '/next-steps', authRequired: true },
    { name: 'AI Assistant', path: '/ai-assistant', authRequired: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* Top Official Portal Banner */}
      <div className="bg-[#0A2540] text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">National Government Examination & Next-Step Portal</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline bg-blue-900/60 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-700/50">
              OFFICIAL PROTOTYPE
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Demo Switcher Quick Pill */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded text-xs font-medium border border-amber-500/30 transition"
              >
                <span>Demo Profile:</span>
                <strong className="text-white">
                  {user ? (isAdmin ? 'Admin (Board)' : user.full_name.split(' ')[0]) : 'Select'}
                </strong>
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Switch Test Profile
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('student1')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Arun Kumar</div>
                      <div className="text-[11px] text-emerald-600 font-medium">84.2% Pass (Distinction)</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Class 12</span>
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('student2')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Priya Sharma</div>
                      <div className="text-[11px] text-amber-600 font-medium">1 Compartment (Chemistry)</div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Class 12</span>
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-center justify-between border-t border-slate-100"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Dr. S. Ramalingam</div>
                      <div className="text-[11px] text-purple-600 font-medium">Controller of Examinations</div>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">Admin</span>
                  </button>
                </div>
              )}
            </div>

            <span className="text-slate-400 text-[11px]">Academic Year: 2026-27</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:shadow-blue-500/25 transition">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">GovResult<span className="text-blue-600">+</span></span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded">SMART</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-tight">National Examination & Next-Step Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold ${
                  isActive('/admin') ? 'bg-purple-100 text-purple-800' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/ai-assistant"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Ask AI Guide</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{user?.full_name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">{user?.full_name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
                      {user?.registration_number && (
                        <p className="text-blue-600 font-mono text-[10px] mt-0.5">Reg: {user.registration_number}</p>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      Student Dashboard
                    </Link>
                    <Link
                      to="/next-steps"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      My Recommended Next Steps
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-1.5 border-t border-slate-100 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold transition hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50"
            >
              Admin Portal
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium rounded-md hover:bg-red-50"
              >
                Sign Out ({user?.full_name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
