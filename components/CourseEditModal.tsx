"use client";

import { useState, useEffect } from "react";
import { 
  X, Save, Trash2, AlertCircle, Loader2, 
  Terminal, Cpu, Hash, User, Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  _id: string;
  courseCode: string;
  courseTitle: string;
  courseType: string;
  teacherEmail: string;
  isActive: boolean;
}

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course: Course | null;
}

export default function CourseEditModal({
  isOpen,
  onClose,
  onSuccess,
  course,
}: CourseEditModalProps) {
  const [formData, setFormData] = useState({
    courseTitle: "",
    courseCode: "",
    teacherEmail: "",
    courseType: "Theory",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({
        courseTitle: course.courseTitle || "",
        courseCode: course.courseCode || "",
        teacherEmail: course.teacherEmail || "",
        courseType: course.courseType || "Theory",
        isActive: course.isActive ?? true,
      });
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update course");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("⚠️ DANGER: Permanently delete this course asset? This cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete course");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-lg border border-hq-border/50 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-hq-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        
        {/* Header */}
        <div className="p-6 border-b border-hq-border/30 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-hq-blue/20 rounded-sm border border-hq-blue/30">
              <Cpu className="w-4 h-4 text-hq-blue" />
            </div>
            <div>
              <h2 className="font-mono text-xs font-black text-white uppercase tracking-tighter leading-none">Modify Asset Core</h2>
              <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1">Resource ID: {course._id.substring(0, 8)}...</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 text-slate-500 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-slate-900/40">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded flex items-center text-rose-400 gap-3 text-[10px] font-mono uppercase">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Course Title */}
            <div className="space-y-1.5">
              <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-hq-blue" /> Asset Nomenclature
              </label>
              <input
                type="text"
                required
                value={formData.courseTitle}
                onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                className="w-full bg-slate-950/50 border border-hq-border/50 px-4 py-3 font-mono text-xs text-white outline-none focus:border-hq-blue/50 transition-all"
                placeholder="e.g. ADVANCED DATA STRUCTURES"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Course Code */}
              <div className="space-y-1.5">
                <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Hash className="w-3 h-3 text-hq-blue" /> Index Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  className="w-full bg-slate-950/50 border border-hq-border/50 px-4 py-3 font-mono text-xs text-white outline-none focus:border-hq-blue/50 transition-all uppercase"
                  placeholder="CS301"
                />
              </div>

              {/* Course Type */}
              <div className="space-y-1.5">
                <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-hq-blue" /> Asset Class
                </label>
                <select
                  value={formData.courseType}
                  onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                  className="w-full bg-slate-950/50 border border-hq-border/50 px-4 py-3 font-mono text-xs text-white outline-none focus:border-hq-blue/50 transition-all appearance-none"
                >
                  <option value="Theory">Theory</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
            </div>

            {/* Teacher Email */}
            <div className="space-y-1.5">
              <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <User className="w-3 h-3 text-hq-blue" /> Superintendent Link (Email)
              </label>
              <input
                type="email"
                value={formData.teacherEmail}
                onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                className="w-full bg-slate-950/50 border border-hq-border/50 px-4 py-3 font-mono text-xs text-white outline-none focus:border-hq-blue/50 transition-all"
                placeholder="teacher@smiu.edu.pk"
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-hq-border/30 rounded mt-4 cursor-pointer hover:bg-white/10 transition-all"
                 onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
              <div className={cn(
                "w-4 h-4 border flex items-center justify-center transition-all",
                formData.isActive ? "bg-hq-blue border-hq-blue" : "border-hq-border"
              )}>
                {formData.isActive && <div className="w-2 h-2 bg-white" />}
              </div>
              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">Asset Active (Publicly Visible)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-3 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95 disabled:opacity-50"
              title="DELETE ASSET"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-hq-blue text-white font-mono text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-hq-blue/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 glow-blue"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : (
                <>
                  <Save className="w-3 h-3" />
                  Commit Changes
                </>
              )}
            </button>
          </div>
        </form>

        <div className="p-3 bg-hq-blue/5 text-center border-t border-hq-border/30">
          <p className="font-mono text-[7px] text-hq-blue/50 uppercase tracking-[0.4em] animate-pulse">CORE_REST_API_STABLE // SECURE_WRITE</p>
        </div>
      </div>
    </div>
  );
}
