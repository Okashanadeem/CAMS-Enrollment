import Link from "next/link";
import { UserPlus, ShieldCheck, ArrowRight, BookOpen, BarChart3, GraduationCap, Award } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] font-sans text-slate-900">
      {/* Product Badge */}
      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Product of CAMS</span>
        </div>
      </div>

      {/* Classical Hero Section */}
      <div className="max-w-6xl mx-auto py-16 md:py-24 px-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9]">
              CLASS ATTENDANCE <br/>
              <span className="text-blue-600">MANAGEMENT</span>
            </h1>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed italic">
            "Enroll yourself in CAMS (Class Attendance Management System) through here. This enrollment will help you to track your attendance and other records perfectly."
            </p>
          <div className="pt-6">
            <Link
              href="/register"
              className="inline-flex items-center gap-4 bg-blue-600 text-white px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-95 border-b-4 border-blue-800"
            >
              <UserPlus className="w-5 h-5" />
              Begin Enrollment Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Classical Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-200 transition-all duration-500">
            <div className="mb-6 flex items-center justify-between">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <span className="text-[10px] font-black text-slate-300 uppercase">Feature 01</span>
            </div>
            <h3 className="text-base font-black mb-3 uppercase tracking-tight">Attendance Tracking</h3>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase">
              Real-time synchronization with the class attendance database.
            </p>
          </div>

          <div className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-200 transition-all duration-500">
            <div className="mb-6 flex items-center justify-between">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <span className="text-[10px] font-black text-slate-300 uppercase">Feature 02</span>
            </div>
            <h3 className="text-base font-black mb-3 uppercase tracking-tight">Class Records</h3>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase">
              Maintain a perfect history of your academic presence.
            </p>
          </div>

          <div className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-200 transition-all duration-500">
            <div className="mb-6 flex items-center justify-between">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <span className="text-[10px] font-black text-slate-300 uppercase">Feature 03</span>
            </div>
            <h3 className="text-base font-black mb-3 uppercase tracking-tight">Personal Portal</h3>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase">
               Designed specifically for the students of SMIU by the CR.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-12 bg-white border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            CAMS • Developed for Academic Excellence
        </p>
      </footer>
    </main>
  );
}
