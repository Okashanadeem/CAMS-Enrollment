import Link from "next/link";
import { CheckCircle, ArrowRight, Zap, ShieldCheck, Activity } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 relative">
      <div className="max-w-xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">
        
        {/* HQ Confirmation Unit */}
        <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full" />
            <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-sm border-2 border-emerald-500/50 bg-emerald-500/10 text-emerald-500 animate-[bounce_2s_infinite]">
                <CheckCircle className="w-12 h-12" />
            </div>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 border border-emerald-500/30 bg-emerald-500/5 rounded-full mb-4">
             <Activity className="w-3 h-3 text-emerald-500" />
             <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest font-black">Sync Executed Successfully</span>
          </div>
          <h1 className="font-mono text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
            DATA <span className="text-emerald-500">SECURED</span>
          </h1>
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            Your identity has been broadcasted to the HQ Data Core. 
            All CAMS child modules are now synchronized with your record.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-5 bg-white text-black font-mono text-[10px] uppercase font-black tracking-widest hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Terminal Home
          </Link>
          <div className="w-2 h-2 rounded-full bg-hq-border hidden sm:block" />
          <Link
            href="/register"
            className="w-full sm:w-auto px-10 py-5 border border-hq-border text-slate-400 font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-white/5 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            New Entry
            <Zap className="w-3 h-3 fill-slate-400" />
          </Link>
        </div>

        {/* Technical Footer */}
        <div className="pt-12 border-t border-hq-border/30 max-w-[200px] mx-auto">
           <p className="font-mono text-[7px] text-slate-700 uppercase tracking-[0.6em]">Core_Sync_Protocol_v2</p>
        </div>
      </div>
    </main>
  );
}
