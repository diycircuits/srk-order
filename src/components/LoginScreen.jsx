import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginScreen = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@srkinnovation.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-red-500/30 border border-white/10">
            <Zap className="w-7 h-7 fill-white/20" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              DIY Circuits
            </h1>
            <p className="text-xs text-red-400 font-semibold tracking-wider uppercase mt-1">
              Enterprise Order Management & ERP System
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              diycircuits.in • Employee Login Gate
            </p>
          </div>
        </div>

        {/* Login Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6 backdrop-blur-xl">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-2xl text-xs flex items-center space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@diycircuits.in"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to DIY Circuits ERP'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Quick 1-Click Login Buttons */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <p className="text-[11px] font-bold text-center text-slate-400">
              ⚡ Direct 1-Click Login (Bina type kiye enter karein):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@diycircuits.in'); setPassword('admin123'); login('admin@diycircuits.in', 'admin123'); }}
                className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('warehouse@diycircuits.in'); setPassword('warehouse123'); login('warehouse@diycircuits.in', 'warehouse123'); }}
                className="bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                📦 Dispatch
              </button>
              <button
                type="button"
                onClick={() => { setEmail('sales@diycircuits.in'); setPassword('sales123'); login('sales@diycircuits.in', 'sales123'); }}
                className="bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-300 py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                💼 Sales
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-slate-500">
          🛡️ Zero Data Loss WAL Mode Active • Secured by DIY Circuits
        </p>

      </div>
    </div>
  );
};
