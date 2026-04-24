"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Download, Loader2, ShieldCheck, User, IdCard } from "lucide-react";

function DownloadContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId") || "";
  const name = searchParams.get("name") || "";
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!studentId || !name) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/download?studentId=${encodeURIComponent(studentId)}&name=${encodeURIComponent(name)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Attendance_Card_${studentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to download card. Please try again later.");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Identity Verified</h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-mono">CAMS HQ Credentials</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" /> Student Name
            </label>
            <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-lg text-white font-semibold">
              {name || "N/A"}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <IdCard className="w-3 h-3" /> Student ID
            </label>
            <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-lg text-white font-mono tracking-tighter">
              {studentId || "N/A"}
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading || !studentId || !name}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 rounded-lg shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Card...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download ID Card
            </>
          )}
        </button>

        <p className="text-center text-[9px] text-slate-600 uppercase tracking-[0.2em] font-medium leading-relaxed">
          This card is generated dynamically via CAMS HQ.<br/>
          Unauthorized tampering is prohibited.
        </p>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4 text-white font-mono">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-xs uppercase tracking-widest animate-pulse">Initializing Secure Tunnel...</p>
        </div>
      }>
        <DownloadContent />
      </Suspense>
    </main>
  );
}
