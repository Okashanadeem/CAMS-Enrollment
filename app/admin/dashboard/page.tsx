'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  Trash2, 
  RefreshCw, 
  Loader2, 
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Shield,
  Activity,
  Terminal,
  Cpu,
  Database,
  Lock,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CourseEditModal from '@/components/CourseEditModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'students' | 'courses'>('students');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resetting, setResetting] = useState(false);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('cams_form_admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'students' 
        ? '/api/sync/students' 
        : '/api/courses';
      
      const headers: any = {};
      if (activeTab === 'students' || activeTab === 'courses') {
        headers['x-api-key'] = 'cams_sync_8f2d3e4a5b6c7d8e9f0a1b2c3d4e5f6g'; // Default sync key
      }

      const res = await fetch(endpoint, { headers });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('cams_form_admin_token');
    router.push('/admin');
  };

  const handleHardReset = async () => {
    const confirmDelete = confirm("⚠️ DANGER: This will permanently delete ALL registrations and courses from the HQ database. Are you absolutely sure?");
    if (!confirmDelete) return;

    const password = prompt("Authorize Reset (Admin Password):");
    if (!password) return;

    setResetting(true);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        setData([]);
      } else {
        alert(result.error || "Reset failed");
      }
    } catch (err) {
      alert("Error performing system reset");
    } finally {
      setResetting(false);
    }
  };

  const filteredData = data.filter((item: any) => {
    if (!item) return false;
    const searchLower = search.toLowerCase();
    if (activeTab === 'students') {
      return (item.fullName?.toLowerCase() || item.name?.toLowerCase() || '').includes(searchLower) || 
             (item.studentId?.toLowerCase() || '').includes(searchLower);
    } else {
      return (item.courseTitle?.toLowerCase() || '').includes(searchLower) || 
             (item.courseCode?.toLowerCase() || '').includes(searchLower);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background/50 border-b border-hq-border sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-hq-blue/20 p-2 rounded-sm border border-hq-blue/30">
               <Shield className="w-5 h-5 text-hq-blue" />
            </div>
            <div>
               <h1 className="font-mono text-sm font-black text-white uppercase tracking-tighter leading-none">CAMS HQ COMMAND</h1>
               <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1">Superintending Central Data Core</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-6 mr-6 border-r border-hq-border pr-6">
                <div className="text-right">
                   <p className="font-mono text-[8px] text-slate-500 uppercase">Data Throughput</p>
                   <p className="font-mono text-[10px] text-hq-cyan font-bold">ACTIVE_BROADCAST</p>
                </div>
                <div className="text-right">
                   <p className="font-mono text-[8px] text-slate-500 uppercase">Registry Status</p>
                   <p className="font-mono text-[10px] text-emerald-500 font-bold">NOMINAL</p>
                </div>
            </div>
            
            <button 
              onClick={handleHardReset}
              disabled={resetting}
              className="flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-500/10 font-mono text-[10px] uppercase tracking-widest transition-all border border-transparent hover:border-rose-500/30"
            >
              {resetting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
              Hard Reset
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest transition-all border border-hq-border"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-2 space-y-1">
            <p className="font-mono text-[8px] text-slate-600 uppercase tracking-[0.3em] mb-4 ml-2">Sub_Systems</p>
            <button 
              onClick={() => setActiveTab('students')}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-widest transition-all group",
                activeTab === 'students' ? "bg-hq-blue text-white glow-blue" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                Registry
              </div>
              <ChevronRight className={cn("w-3 h-3 transition-transform", activeTab === 'students' ? "rotate-90" : "")} />
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-widest transition-all group",
                activeTab === 'courses' ? "bg-hq-blue text-white glow-blue" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                Assets
              </div>
              <ChevronRight className={cn("w-3 h-3 transition-transform", activeTab === 'courses' ? "rotate-90" : "")} />
            </button>
            
            <div className="pt-10 space-y-4 px-2">
                <div className="p-4 border border-hq-border bg-white/5">
                   <p className="font-mono text-[8px] text-slate-500 uppercase mb-2">Sync Status</p>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-[9px] text-white">ALL NODES ONLINE</span>
                   </div>
                </div>
            </div>
          </div>

          {/* MAIN DATA TERMINAL */}
          <div className="lg:col-span-10 space-y-6">
            
            {/* STATS HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                <div className="glass-card p-6 border border-hq-border">
                    <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Global {activeTab}</p>
                    <p className="font-mono text-3xl font-black text-white mt-2">{data.length}</p>
                </div>
                <div className="glass-card p-6 border border-hq-border">
                    <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Active Filters</p>
                    <p className="font-mono text-3xl font-black text-hq-blue mt-2">{filteredData.length}</p>
                </div>
                <div className="glass-card p-6 border border-hq-border">
                    <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">System Load</p>
                    <p className="font-mono text-3xl font-black text-emerald-500 mt-2">0.02%</p>
                </div>
                <div className="glass-card p-6 border border-hq-border flex items-center justify-center">
                    <Activity className="w-10 h-10 text-hq-blue opacity-20" />
                </div>
            </div>

            <div className="glass-card border border-hq-border">
              {/* TERMINAL TOOLBAR */}
              <div className="p-4 border-b border-hq-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5">
                <div className="relative w-full sm:w-96">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder={`QUERY ${activeTab.toUpperCase()} DB...`}
                    className="w-full bg-slate-900 border border-hq-border pl-12 pr-4 py-3 font-mono text-[10px] text-white outline-none focus:border-hq-blue/50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] text-slate-600 uppercase mr-2">LAST_REFRESH: {new Date().toLocaleTimeString()}</span>
                    <button 
                    onClick={fetchData}
                    className="p-3 border border-hq-border hover:bg-white/5 text-slate-400 transition-all"
                    title="RE-INDEX DB"
                    >
                    <RefreshCw className={cn("w-4 h-4", loading ? 'animate-spin' : '')} />
                    </button>
                </div>
              </div>

              {/* DATA GRID */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      {activeTab === 'students' ? (
                        <>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identity</th>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registry ID</th>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comm Link</th>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">First Log</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset Title</th>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teacher</th>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resource Code</th>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                          <th className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hq-border">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-24 text-center">
                          <Activity className="w-10 h-10 animate-spin mx-auto mb-4 text-hq-blue" />
                          <p className="font-mono text-[10px] text-hq-blue animate-pulse tracking-[0.5em]">BUFFERING_DATA...</p>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-24 text-center">
                          <AlertCircle className="w-10 h-10 mx-auto mb-4 text-slate-700" />
                          <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">No matching records found in central core.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item: any, idx) => (
                        <tr key={item._id || idx} className="hover:bg-hq-blue/5 transition-all group">
                          {activeTab === 'students' ? (
                            <>
                              <td className="px-6 py-5">
                                <div className="font-mono text-[11px] font-bold text-white group-hover:text-hq-blue transition-colors uppercase tracking-tight">{item.fullName || item.name}</div>
                                <div className="font-mono text-[9px] text-slate-500 mt-0.5">{item.email}</div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="font-mono text-[10px] font-bold bg-hq-blue/10 text-hq-blue border border-hq-blue/20 px-2 py-1">
                                  {item.studentId}
                                </span>
                              </td>
                              <td className="px-6 py-5 font-mono text-[10px] text-slate-400 italic">{item.phone || 'NO_LINK'}</td>
                              <td className="px-6 py-5 font-mono text-[10px] text-slate-600">
                                {new Date(item.createdAt || item.submittedAt).toISOString().split('T')[0]}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-5 font-mono text-[11px] font-bold text-white group-hover:text-hq-blue transition-colors uppercase tracking-tight">{item.courseTitle}</td>
                              <td className="px-6 py-5 font-mono text-[10px] text-slate-400">{item.teacherEmail || 'NO_EMAIL'}</td>
                              <td className="px-6 py-5 font-mono text-[10px] text-hq-cyan font-bold">{item.courseCode}</td>
                              <td className="px-6 py-5">
                                <span className="font-mono text-[9px] bg-white/5 border border-hq-border text-slate-400 px-2 py-1 uppercase">
                                  {item.courseType}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                {item.isActive ? (
                                  <div className="flex items-center gap-2">
                                     <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                     <span className="font-mono text-[9px] text-emerald-500 font-bold uppercase">Linked</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                     <div className="w-1 h-1 rounded-full bg-slate-700" />
                                     <span className="font-mono text-[9px] text-slate-600 font-bold uppercase">Offline</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-5 text-right">
                                <button
                                  onClick={() => handleEditCourse(item)}
                                  className="p-2 hover:bg-hq-blue/10 text-slate-400 hover:text-hq-blue transition-all rounded"
                                  title="EDIT ASSET"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CourseEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchData}
        course={selectedCourse}
      />
    </div>
  );
}
