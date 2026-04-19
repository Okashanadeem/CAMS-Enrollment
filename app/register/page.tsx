import RegistrationForm from "@/components/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
      <RegistrationForm />
      
      <footer className="mt-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        &copy; {new Date().getFullYear()} Class Attendance Management System
      </footer>
    </main>
  );
}
