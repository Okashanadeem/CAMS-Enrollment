'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, AlertCircle, Loader2, Cpu, Terminal, Shield, ChevronRight } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('cams_form_admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'INVALID AUTHENTICATION KEY');
      }
    } catch (err) {
      setError('HQ UPLINK FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-md w-full glass-card rounded-sm border border-hq-border overflow-hidden relative glow-blue">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-hq-blue to-transparent" />
        
        <div className="p-8 text-center border-b border-hq-border/50 bg-white/5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-hq-blue/10 border border-hq-blue/30 mb-6 group transition-all hover:bg-hq-blue/20">
            <Shield className="w-8 h-8 text-hq-blue group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="font-mono text-xl font-black text-white uppercase tracking-tighter">HQ AUTHENTICATION</h1>
          <p className="font-mono text-[9px] text-slate-500 mt-2 uppercase tracking-[0.4em]">Secure Access Protocol // 0x442</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-3 h-3 text-hq-blue" />
              Administrative Key
            </label>
            <div className="relative">
                <input
                type="password"
                required
                className="w-full bg-slate-900 border border-hq-border px-4 py-4 font-mono text-sm text-white placeholder:text-slate-800 outline-none transition-all focus:border-hq-blue/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/50 text-rose-400 font-mono text-[9px] uppercase tracking-widest">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-hq-blue text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group active:scale-[0.98] glow-blue"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                    Initialize Connection
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="p-4 border-t border-hq-border bg-black/40 flex items-center justify-between">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-hq-blue" />
                <div className="w-1.5 h-1.5 rounded-full bg-hq-border" />
                <div className="w-1.5 h-1.5 rounded-full bg-hq-border" />
            </div>
            <span className="font-mono text-[7px] text-slate-600 uppercase tracking-widest">Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
}
