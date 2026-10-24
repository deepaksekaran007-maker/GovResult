import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, ArrowRight, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = async (type: 'student1' | 'student2' | 'admin') => {
    setError('');
    setIsLoading(true);
    try {
      await switchDemoUser(type);
      if (type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate demo user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#F4F6F9]">
      <div className="max-w-md w-full space-y-6">
        {/* Top Branding Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-700 text-white shadow-lg">
            <Shield className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to GovResult<span className="text-blue-600">+</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            National Examination Result & Personalized Next-Step Assistant
          </p>
        </div>

        {/* Demo Quick Logins Box */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              1-Click Demo Profiles (Testing Mode)
            </span>
            <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
              MOCK DATA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoClick('student1')}
              disabled={isLoading}
              className="p-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-left rounded-xl transition flex flex-col justify-between shadow-sm group"
            >
              <div className="font-bold text-slate-900 group-hover:text-emerald-800">Arun Kumar</div>
              <div className="text-[11px] text-emerald-600 font-semibold">84.2% Pass (Distinction)</div>
              <div className="text-[10px] text-slate-400 mt-1">Class 12 • Higher Ed Pathway</div>
            </button>

            <button
              onClick={() => handleDemoClick('student2')}
              disabled={isLoading}
              className="p-2.5 bg-white hover:bg-amber-50 border border-amber-200 text-left rounded-xl transition flex flex-col justify-between shadow-sm group"
            >
              <div className="font-bold text-slate-900 group-hover:text-amber-800">Priya Sharma</div>
              <div className="text-[11px] text-amber-600 font-semibold">1 Compartment (Chemistry)</div>
              <div className="text-[10px] text-slate-400 mt-1">Class 12 • Supplementary</div>
            </button>
          </div>

          <button
            onClick={() => handleDemoClick('admin')}
            disabled={isLoading}
            className="w-full py-2 bg-purple-100/70 hover:bg-purple-100 text-purple-900 rounded-lg text-xs font-bold border border-purple-200 flex items-center justify-center gap-1.5 transition"
          >
            <Shield className="w-3.5 h-3.5 text-purple-700" />
            <span>Login as Official Board Admin (Dr. S. Ramalingam)</span>
          </button>
        </div>

        {/* Regular Login Card */}
        <div className="bg-white rounded-2xl shadow-gov border border-slate-200/80 p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-blue-600 hover:underline text-[11px]">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register New Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
