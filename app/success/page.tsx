import Link from "next/link";
import { CheckCircle2, ArrowLeft, ShieldCheck, Download, ExternalLink, Award } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 py-20">
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Verification Header */}
        <div className="bg-emerald-500 p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 border border-white/30 shadow-2xl animate-bounce-slow">
                    <CheckCircle2 className="w-10 h-10 text-white stroke-[3]" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Registration Verified</h1>
                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.3em]">CAMS • Secure Enrollment System</p>
            </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Product of CAMS</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
              Your academic profile has been successfully linked to the Class Attendance Management System.
            </p>
          </div>

          {/* Verification Badge/Card */}
          <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 relative group">
              <ShieldCheck className="absolute top-4 right-4 w-5 h-5 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">
                          ID
                      </div>
                      <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment Status</p>
                          <p className="text-sm font-black text-slate-900 uppercase">Active & Synchronized</p>
                      </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Database Updated</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300 uppercase italic">Ref: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/"
              className="flex items-center justify-center gap-3 w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-100 border-b-4 border-blue-800 active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Portal
            </Link>
            
            <p className="text-[9px] font-black text-slate-400 uppercase text-center tracking-[0.3em] pt-4">
              Academic Excellence • SMIU Student Portal
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-900 text-white/30 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">Class Attendance Management System Ecosystem</p>
        </div>
      </div>
    </main>
  );
}
