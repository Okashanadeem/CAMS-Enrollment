import RegistrationForm from "@/components/RegistrationForm";
import { Activity } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration consistent with HQ theme */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-hq-blue/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-hq-cyan/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-hq-blue/30 bg-hq-blue/5 rounded-full mb-2">
            <Activity className="w-3 h-3 text-hq-blue" />
            <span className="font-mono text-[9px] text-hq-blue uppercase tracking-widest font-black">Secure Data Entry Node</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            ENROLLMENT <span className="text-hq-blue">TERMINAL</span>
          </h1>
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            Authorization Stage: Initialize Registry // Session: {new Date().toLocaleDateString()}
          </p>
        </div>

        <RegistrationForm />
      </div>

      <footer className="mt-20 text-center pb-10">
        <p className="font-mono text-[8px] text-slate-700 uppercase tracking-[0.5em]">
          Central Intelligence System • Academic Integrity Protocol
        </p>
      </footer>
    </main>
  );
}
