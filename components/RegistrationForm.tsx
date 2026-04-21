"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormData } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { 
  Loader2, Check, AlertCircle, User, Hash, Mail, 
  Phone, BookOpen, ArrowRight, 
  Search, CheckCircle2,
  Terminal, Zap, Shield, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  _id: string;
  courseCode: string;
  courseTitle: string;
  courseType: string;
}

export default function RegistrationForm() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      enrolledCourses: [],
    },
  });

  const selectedCourses = watch("enrolledCourses");
  const studentName = watch("name");
  const studentId = watch("studentId");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ["name", "studentId", "email", "phone"] 
      : ["enrolledCourses"];
    
    const result = await trigger(fieldsToValidate as any);
    if (result) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: RegistrationFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      const formattedData = {
        ...data,
        studentId: data.studentId.toUpperCase(),
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");
      router.push("/success");
    } catch (err: any) {
      setError(err.message);
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCourse = (course: Course) => {
    const isSelected = selectedCourses.some(
      (c) => c.courseCode === course.courseCode && c.courseType === course.courseType
    );

    if (isSelected) {
      setValue(
        "enrolledCourses",
        selectedCourses.filter(
          (c) => !(c.courseCode === course.courseCode && c.courseType === course.courseType)
        ),
        { shouldValidate: true }
      );
    } else {
      setValue(
        "enrolledCourses",
        [
          ...selectedCourses,
          {
            courseCode: course.courseCode,
            courseTitle: course.courseTitle,
            courseType: course.courseType,
          },
        ],
        { shouldValidate: true }
      );
    }
  };

  const filteredCourses = courses.filter(c => 
    c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Activity className="w-12 h-12 text-hq-blue animate-spin" />
        <p className="mt-6 font-mono text-[10px] tracking-[0.5em] text-hq-blue animate-pulse uppercase">Initializing Core Assets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* User-Friendly Progress Stepper */}
      <div className="flex items-center justify-center gap-4 md:gap-8 mb-10 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-500",
              step === s ? "border-hq-blue bg-hq-blue text-white shadow-lg shadow-hq-blue/20 scale-110" : 
              step > s ? "border-emerald-500 bg-emerald-500 text-white" : 
              "border-hq-border text-slate-600 bg-white/5"
            )}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            <span className={cn(
               "text-[10px] md:text-xs font-bold uppercase tracking-widest hidden sm:block",
               step === s ? "text-hq-blue" : "text-slate-500"
            )}>
              {s === 1 ? "Details" : s === 2 ? "Courses" : "Confirm"}
            </span>
            {s < 3 && <div className="w-4 h-[1px] bg-hq-border hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl border border-hq-border/50 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-hq-blue/50 via-hq-cyan/50 to-hq-blue/50" />
        
        {/* Form Header */}
        <div className="p-8 border-b border-hq-border/30 bg-white/5">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <User className="w-6 h-6 text-hq-blue" />
                        {step === 1 ? "Personal Profile" : step === 2 ? "Select Courses" : "Final Review"}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                       {step === 1 ? "Enter your official student records for identity verification." : 
                        step === 2 ? "Search and select the courses you are currently attending." : 
                        "Please verify your information before finalizing the synchronization."}
                    </p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 bg-slate-900/40">
            {error && (
                <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center text-rose-400 gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-bold uppercase">{error}</p>
                </div>
            )}

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        {[
                            { id: "name", label: "Legal Full Name", icon: User, placeholder: "Okasha Nadeem" },
                            { id: "studentId", label: "Student ID", icon: Hash, placeholder: "BSE-XXX-XXX" },
                            { id: "email", label: "Email Address", icon: Mail, placeholder: "name@example.com", type: "email" },
                            { id: "phone", label: "Phone Number", icon: Phone, placeholder: "03XX-XXXXXXX" },
                        ].map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <field.icon className="w-3 h-3 text-hq-blue" /> {field.label}
                                </label>
                                <div className="relative group">
                                    <input
                                        {...register(field.id as any)}
                                        type={field.type || "text"}
                                        className={cn(
                                            "w-full bg-slate-950/50 border border-hq-border/50 px-5 py-4 rounded-xl text-white placeholder:text-slate-700 outline-none transition-all focus:border-hq-blue/50 focus:bg-slate-950 shadow-inner",
                                            errors[field.id as keyof typeof errors] ? "border-rose-500/30" : "border-hq-border/50"
                                        )}
                                        placeholder={field.placeholder}
                                    />
                                    {errors[field.id as keyof typeof errors] && (
                                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1 animate-pulse italic">
                                            {errors[field.id as keyof typeof errors]?.message as string}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: COURSES */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950/50 p-4 rounded-2xl border border-hq-border/30">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-hq-border/50 rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-hq-blue/50 shadow-inner"
                                placeholder="Search Courses..."
                            />
                        </div>
                        <div className="font-bold text-xs text-hq-blue uppercase tracking-widest bg-hq-blue/10 px-4 py-3 rounded-xl border border-hq-blue/20">
                            {selectedCourses.length} Selected
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredCourses.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-hq-border/30 rounded-2xl">
                                <p className="text-slate-500 font-bold text-sm uppercase">No courses found</p>
                            </div>
                        ) : filteredCourses.map((course) => {
                            const isSelected = selectedCourses.some(
                                (c) => c.courseCode === course.courseCode && c.courseType === course.courseType
                            );
                            return (
                                <div
                                    key={course._id}
                                    onClick={() => toggleCourse(course)}
                                    className={cn(
                                        "flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group",
                                        isSelected 
                                        ? "border-hq-blue bg-hq-blue/10 shadow-lg shadow-hq-blue/5 scale-[1.01]" 
                                        : "border-hq-border/30 bg-white/5 hover:border-slate-700 hover:bg-white/10"
                                    )}
                                >
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm text-white uppercase tracking-tight group-hover:text-hq-blue transition-colors">
                                            {course.courseTitle}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-slate-500 border border-hq-border/50 px-2 py-0.5 rounded-lg bg-slate-950">
                                                {course.courseCode}
                                            </span>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                course.courseType === 'Lab' ? "bg-hq-cyan" : "bg-hq-blue"
                                            )}></div>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest",
                                                course.courseType === 'Lab' ? "text-hq-cyan" : "text-slate-400"
                                            )}>{course.courseType}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                        isSelected ? "border-hq-blue bg-hq-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-hq-border text-transparent"
                                    )}>
                                        <Check className="w-5 h-5 stroke-[3]" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STEP 3: FINAL REVIEW */}
            {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="border border-hq-blue/30 bg-hq-blue/10 p-10 rounded-2xl text-center relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 right-0 p-4">
                           <Shield className="w-16 h-16 text-hq-blue/5" />
                        </div>
                        <p className="text-[10px] font-bold text-hq-blue uppercase tracking-[0.4em] mb-3">System Identity Profile</p>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{studentName}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{studentId}</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-l-4 border-hq-blue pl-4 mb-4">Course Manifest ({selectedCourses.length} Units)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedCourses.map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-hq-border/50 rounded-xl group hover:border-hq-blue/30 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white uppercase group-hover:text-hq-blue transition-colors truncate max-w-[200px]">{c.courseTitle}</span>
                                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">{c.courseCode}</span>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-slate-950/80 rounded-2xl border border-hq-border/30">
                        <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 bg-slate-900 border-hq-border/50 text-hq-blue rounded cursor-pointer" />
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                            I verify that all information provided is accurate and authorized for synchronization with the central attendance core.
                        </p>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-5 mt-12">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-5 border border-hq-border/50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all rounded-xl active:scale-95"
                    >
                        Go Back
                    </button>
                )}
                
                {step < 3 ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="flex-[2] py-5 bg-hq-blue text-white font-bold text-xs uppercase tracking-widest hover:bg-hq-blue/90 transition-all flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-hq-blue/20 active:scale-95 group"
                    >
                        Next: {step === 1 ? "Course Selection" : "Final Review"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-[2] py-5 bg-hq-blue text-white font-bold text-xs uppercase tracking-widest hover:bg-hq-blue/90 transition-all flex items-center justify-center gap-3 rounded-xl shadow-lg shadow-hq-blue/30 active:scale-95 group"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Zap className="w-5 h-5 fill-white" />
                                Execute Sync
                            </>
                        )}
                    </button>
                )}
            </div>
        </form>

        <div className="p-4 bg-hq-blue/5 text-center border-t border-hq-border/30">
            <p className="font-mono text-[8px] text-hq-blue/70 uppercase tracking-[0.5em] animate-pulse">CONNECTION SECURE // HQ CORE v2.0</p>
        </div>
      </div>
    </div>
  );
}
