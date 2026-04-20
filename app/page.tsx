import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Database, 
  Cpu, 
  Zap, 
  Terminal,
  Activity,
  UserPlus,
  UserCheck,
  LineChart
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center relative px-4 overflow-hidden">
      
      {/* Background Tech Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-hq-blue/5 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-hq-cyan/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10 py-12">
        {/* HQ Branding */}
        <div className="flex justify-center mb-8">
          <div className="glass-card px-5 py-2 rounded-full border border-hq-blue/30 flex items-center gap-3 glow-blue">
            <Activity className="w-4 h-4 text-hq-blue animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] font-black uppercase text-white/80">Central Intelligence Core</span>
          </div>
        </div>

        {/* Main Command Display */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              STUDENT <span className="text-hq-blue drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">ENROLLMENT</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
               The central gateway for the Class Attendance Management System. 
               Enroll here to initialize your academic identity across the ecosystem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-4 bg-hq-blue text-white px-10 py-5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-hq-blue/90 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Begin Enrollment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin"
              className="group inline-flex items-center gap-4 border border-hq-border text-slate-300 px-10 py-5 rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              Administrative Access
            </Link>
          </div>
        </div>

        {/* Frosted Glass Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-hq-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="glass-card p-8 border border-hq-border/50 rounded-2xl relative z-10 backdrop-blur-2xl bg-white/[0.03] hover:border-hq-blue/40 transition-all h-full shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-hq-blue/10 flex items-center justify-center mb-6 border border-hq-blue/20">
                <Database className="w-6 h-6 text-hq-blue" />
              </div>
              <h3 className="text-white font-black text-xl mb-3 tracking-tight">Main Hub</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                This is the central command station to enroll yourself into the system. It serves as the primary registry for the entire CAMS network.
              </p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-hq-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="glass-card p-8 border border-hq-border/50 rounded-2xl relative z-10 backdrop-blur-2xl bg-white/[0.03] hover:border-hq-cyan/40 transition-all h-full shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-hq-cyan/10 flex items-center justify-center mb-6 border border-hq-cyan/20">
                <LineChart className="w-6 h-6 text-hq-cyan" />
              </div>
              <h3 className="text-white font-black text-xl mb-3 tracking-tight">Record Tracking</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Your enrollment will help you and us to track your attendance and assignment records perfectly through our autonomous sync protocols.
              </p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="glass-card p-8 border border-hq-border/50 rounded-2xl relative z-10 backdrop-blur-2xl bg-white/[0.03] hover:border-white/30 transition-all h-full shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <UserCheck className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-white font-black text-xl mb-3 tracking-tight">Autonomous Core</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Everything is fully autonomous and managed by the CR of the section, Okasha Nadeem, to maintain absolute system integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Footer Detail */}
        <div className="mt-20 flex flex-col items-center gap-4">
           <div className="flex gap-2">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`h-1 w-4 rounded-full ${i < 6 ? 'bg-hq-blue' : 'bg-hq-border'}`} />
              ))}
           </div>
           <span className="font-mono text-[8px] text-slate-600 uppercase tracking-[0.6em]">Core_Sync_Initialized // Admin: Okasha Nadeem</span>
        </div>
      </div>
    </main>
  );
}
