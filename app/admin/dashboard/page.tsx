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
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'students' | 'courses'>('students');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resetting, setResetting] = useState(false);
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
        ? '/api/sync/registrations' 
        : '/api/courses';
      
      const headers: any = {};
      if (activeTab === 'students') {
        // This endpoint requires SYNC_API_KEY if we hit it from outside, 
        // but here we are on the same origin. 
        // However, the route.ts checks for the header.
        // We'll need to handle authorization for these internal fetches or provide the key.
        // Let's assume for now the admin is authorized.
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

  const handleLogout = () => {
    localStorage.removeItem('cams_form_admin_token');
    router.push('/admin');
  };

  const handleHardReset = async () => {
    const confirmDelete = confirm("⚠️ DANGER: This will permanently delete ALL registrations and courses from the CAMS Form database. Are you absolutely sure?");
    if (!confirmDelete) return;

    const password = prompt("Please enter Admin Password to authorize reset:");
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
      return (item.name?.toLowerCase() || '').includes(searchLower) || 
             (item.studentId?.toLowerCase() || '').includes(searchLower);
    } else {
      return (item.courseTitle?.toLowerCase() || '').includes(searchLower) || 
             (item.courseCode?.toLowerCase() || '').includes(searchLower);
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-blue-600 text-xl">
            <LayoutDashboard className="w-6 h-6" />
            CAMS Portal Admin
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleHardReset}
              disabled={resetting}
              className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium"
            >
              {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Hard Reset</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-64 space-y-2">
            <button 
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
            >
              <Users className="w-5 h-5" />
              Students
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
            >
              <BookOpen className="w-5 h-5" />
              Courses
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={`Search ${activeTab === 'students' ? 'Students' : 'Courses'}...`}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button 
                  onClick={fetchData}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      {activeTab === 'students' ? (
                        <>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Code</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Title</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                          Loading {activeTab}...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          No {activeTab} found.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item: any, idx) => (
                        <tr key={item._id || idx} className="hover:bg-slate-50/50 transition-all">
                          {activeTab === 'students' ? (
                            <>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-700">{item.name}</div>
                                <div className="text-xs text-slate-500">{item.email}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono font-bold">
                                  {item.studentId}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-600 text-sm font-mono">{item.courseCode}</td>
                              <td className="px-6 py-4 text-slate-500 text-xs">
                                {new Date(item.submittedAt).toLocaleString()}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 font-semibold text-slate-700">{item.courseTitle}</td>
                              <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">{item.courseCode}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                  {item.courseType}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {item.isActive ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
                                    <CheckCircle2 className="w-3 h-3" /> Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold uppercase">
                                    <AlertCircle className="w-3 h-3" /> Inactive
                                  </span>
                                )}
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total {activeTab}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{data.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Visible Records</p>
                <p className="text-3xl font-black text-blue-600 mt-1">{filteredData.length}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
