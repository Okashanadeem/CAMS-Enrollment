"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormData } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { 
  Loader2, Check, AlertCircle, User, Hash, Mail, 
  Phone, BookOpen, Send, Award, ArrowRight, 
  Search, Filter, CheckCircle2, ChevronRight
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
    const fetchStudentData = async () => {
      if (studentId && studentId.length >= 5) {
        try {
          const res = await fetch(`/api/students/${studentId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.fullName) setValue("name", data.fullName, { shouldValidate: true });
            if (data.email) setValue("email", data.email, { shouldValidate: true });
            if (data.phone) setValue("phone", data.phone, { shouldValidate: true });
          }
        } catch (err) {
          console.error("Error fetching student data:", err);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchStudentData();
    }, 500);

    return () => clearTimeout(timer);
  }, [studentId, setValue]);

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
      setStep(1); // Go back to first step to show error
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
        <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
        </div>
        <p className="mt-6 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Initialising CAMS Portal</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-10 px-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center group">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 font-black text-xs border-2",
              step === s ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110" : 
              step > s ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" : 
              "bg-white border-slate-100 text-slate-300"
            )}>
              {step > s ? <Check className="w-5 h-5 stroke-[3]" /> : s}
            </div>
            {s < 3 && (
              <div className={cn(
                "w-12 md:w-24 h-1 mx-2 rounded-full transition-all duration-700",
                step > s ? "bg-emerald-500" : "bg-slate-100"
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden">
        {/* Form Header */}
        <div className="p-8 pb-0 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Product of CAMS</span>
            </div>
            <div className="space-y-1">
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">
                    {step === 1 ? "Personal Profile" : step === 2 ? "Course Selection" : "Final Verification"}
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Step {step} of 3 • Secure Enrollment
                </p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 pt-8">
            {error && (
                <div className="mb-8 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-center text-rose-700 gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                </div>
            )}

            {/* STEP 1: PERSONAL INFO */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Highlighted Notice */}
                    <div className="bg-slate-900 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="flex gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-[11px] font-bold leading-relaxed text-slate-300 uppercase tracking-tight">
                                <span className="text-white font-black block mb-1">Important Requirement:</span>
                                Use the actual name and ID provided to the University. This identity will be verified across all academic records.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Component Factory */}
                        {[
                            { id: "name", label: "Full Name", icon: User, placeholder: "Okasha Nadeem" },
                            { id: "studentId", label: "Student ID", icon: Hash, placeholder: "BSE-25F-086", extraClass: "uppercase placeholder:normal-case" },
                            { id: "email", label: "Email Address", icon: Mail, placeholder: "okasha@example.com", type: "email" },
                            { id: "phone", label: "Phone Number", icon: Phone, placeholder: "0300-1234567" },
                        ].map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <field.icon className="w-3 h-3 text-blue-500" /> {field.label}
                                </label>
                                <div className="relative group">
                                    <input
                                        {...register(field.id as any)}
                                        type={field.type || "text"}
                                        className={cn(
                                            "w-full p-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none transition-all font-bold text-sm text-slate-900 placeholder:text-slate-400 shadow-sm",
                                            errors[field.id as keyof typeof errors] ? "border-rose-200 focus:border-rose-500" : "border-slate-100 focus:border-blue-600"
                                        )}
                                        placeholder={field.placeholder}
                                    />
                                    {touchedFields[field.id as keyof typeof touchedFields] && !errors[field.id as keyof typeof errors] && (
                                        <div className="absolute right-4 top-4 text-emerald-500 animate-in zoom-in duration-300">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {errors[field.id as keyof typeof errors] && (
                                    <p className="text-[10px] text-rose-500 font-bold ml-1 animate-in slide-in-from-top-1">
                                        {errors[field.id as keyof typeof errors]?.message as string}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: COURSE SELECTION */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <div className="relative w-full md:max-w-xs">
                            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-xs transition-all"
                                placeholder="Search by Code or Title..."
                            />
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
                                {selectedCourses.length} Courses Selected
                             </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                        {filteredCourses.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">No courses found matching your search</p>
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
                                        "flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer group",
                                        isSelected 
                                        ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/5 scale-[1.02]" 
                                        : "border-slate-50 bg-slate-50/30 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-black uppercase tracking-tight transition-colors",
                                            isSelected ? "text-blue-900" : "text-slate-800 group-hover:text-blue-600"
                                        )}>
                                            {course.courseTitle}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[9px] font-black bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm text-slate-500">
                                                {course.courseCode}
                                            </span>
                                            <div className={cn(
                                                "w-1 h-1 rounded-full",
                                                course.courseType === 'Lab' ? "bg-amber-400" : "bg-indigo-400"
                                            )}></div>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-[0.1em]",
                                                course.courseType === 'Lab' ? "text-amber-600" : "text-indigo-600"
                                            )}>{course.courseType}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500",
                                        isSelected ? "bg-blue-600 rotate-[360deg] shadow-lg shadow-blue-300" : "bg-white border-2 border-slate-100 group-hover:border-blue-200"
                                    )}>
                                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {errors.enrolledCourses && <p className="text-[10px] text-rose-500 font-bold ml-2 italic">{errors.enrolledCourses.message}</p>}
                </div>
            )}

            {/* STEP 3: VERIFICATION */}
            {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="text-center bg-blue-50 p-8 rounded-[2rem] border-2 border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600 rounded-full -mr-12 -mt-12 blur-xl"></div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2">Registration Summary</p>
                        <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">{studentName}</h3>
                        <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-widest">{studentId}</p>
                    </div>

                    <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-4 px-2">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enrolling in {selectedCourses.length} Courses</span>
                         </div>
                         <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedCourses.map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                                            {i + 1}
                                        </div>
                                        <span className="text-[11px] font-black uppercase text-slate-700 tracking-tight">{c.courseTitle}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400">{c.courseCode}</span>
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <Checkbox className="mt-1" defaultChecked id="terms" />
                        <label htmlFor="terms" className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight cursor-pointer">
                            I verify that all information provided is accurate and I understand that these courses will be added to my official CAMS attendance roster.
                        </label>
                    </div>
                </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center gap-4 mt-12">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-5 bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
                    >
                        Go Back
                    </button>
                )}
                
                {step < 3 ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-blue-800"
                    >
                        Continue to Step {step + 1}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-blue-800"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Submit Registration
                            </>
                        )}
                    </button>
                )}
            </div>
        </form>

        <div className="p-8 bg-slate-950 text-white text-center relative">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Academic Records Management Ecosystem</p>
        </div>
      </div>
    </div>
  );
}

// Simple internal checkbox if shadcn not installed
function Checkbox({ className, id, defaultChecked }: any) {
    return (
        <input 
            type="checkbox" 
            id={id}
            defaultChecked={defaultChecked}
            className={cn("w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500", className)} 
        />
    );
}
