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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/25 border border-white/10">
            <Zap className="w-7 h-7 fill-white/20" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              SRK Innovations
            </h1>
            <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase mt-1">
              Enterprise Order Management & ERP System
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              srkinnovations.com • Morning Employee Login Gate
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
              <label className="block text-slate-300 font-bold mb-1.5">Employee Email / Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@srkinnovation.com"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
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
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to SRK ERP'}</span>
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
                onClick={() => { setEmail('admin@srkinnovation.com'); setPassword('admin123'); login('admin@srkinnovation.com', 'admin123'); }}
                className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('warehouse@srkinnovation.com'); setPassword('warehouse123'); login('warehouse@srkinnovation.com', 'warehouse123'); }}
                className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center"
              >
                📦 Dispatch
              </button>
              <button
                type="button"
                onClick={() => { setEmail('sales@srkinnovation.com'); setPassword('sales123'); login('sales@srkinnovation.com', 'sales123'); }}
                className="bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center"
              >
                💼 Sales
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-slate-500">
          🛡️ Zero Data Loss WAL Mode Active • Secured by SRK Innovations
        </p>

      </div>
    </div>
  );
};
