import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#F4F6F9]">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-700 text-white shadow-lg">
            <KeyRound className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reset Portal Access
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-gov border border-slate-200/80 p-6 sm:p-8 space-y-5">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-900">{email}</strong>, you will receive an official reset link shortly.
              </p>
              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <span>Send Reset Link</span>
              </button>

              <div className="pt-2 text-center">
                <Link to="/login" className="text-xs text-slate-600 hover:text-slate-900 font-semibold hover:underline">
                  Cancel and return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
