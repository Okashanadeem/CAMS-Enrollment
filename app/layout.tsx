import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CAMS HQ | Central Intelligence & Enrollment",
  description: "The primary data hub for the Class Attendance Management System. Superintending all child modules.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${mono.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-background text-foreground selection:bg-hq-blue/30 selection:text-white">
        {/* HQ Visual Layer */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          {/* Base Grid */}
          <div className="absolute inset-0 hq-grid opacity-30" />
          
          {/* Radial Center Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
          
          {/* Scanning Line Effect */}
          <div className="scanline" />

          {/* Abstract Data Shapes */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-hq-blue/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-hq-cyan/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="relative flex flex-col min-h-screen">
          {/* Header/Status Bar */}
          <header className="border-b border-hq-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-hq-blue animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-white">CAMS HQ CENTRAL</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-hq-border bg-white/5 rounded-full">
                    <Award className="w-3 h-3 text-hq-blue" />
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">Product of CAMS</span>
                 </div>
                 <div className="h-4 w-[1px] bg-hq-border" />
                 <span className="font-mono text-[9px] text-slate-500 uppercase tracking-tighter">Status: Active</span>
              </div>
            </div>
          </header>

          <main className="flex-1 relative">
            {children}
          </main>

          <footer className="border-t border-hq-border py-12 bg-background/50 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-hq-blue/20 to-transparent" />
             
             <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                   <div className="space-y-2">
                      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">
                        Class Attendance Management System // Central Intelligence
                      </p>
                      <p className="font-mono text-xs text-white uppercase tracking-widest font-bold">
                        System managed and designed by CR of the section 
                        <span className="text-hq-blue"> Okasha Nadeem</span>
                      </p>
                   </div>
                   
                   <Link 
                      href="https://linkedin.com/in/okasha-nadeem" 
                      target="_blank"
                      className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-hq-border hover:border-hq-blue/50 transition-all rounded-xl"
                   >
                      <ExternalLink className="w-4 h-4 text-hq-blue group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">Connect via LinkedIn</span>
                   </Link>

                   <div className="flex items-center gap-4 opacity-20 mt-4">
                      <div className="w-12 h-[1px] bg-slate-500" />
                      <div className="w-2 h-2 rounded-full bg-hq-blue" />
                      <div className="w-12 h-[1px] bg-slate-500" />
                   </div>
                   
                   <p className="font-mono text-[8px] text-slate-700 uppercase tracking-[0.5em]">
                      All rights reserved • © 2026 HQ CORE PROTOCOLS
                   </p>
                </div>
             </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
