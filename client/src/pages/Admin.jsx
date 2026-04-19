import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, Award, AlertTriangle, 
  TrendingUp, BarChart3, PieChart, LineChart, Shield,
  Search, Filter, Download, Send, Settings, Bell,
  Menu, X, CheckCircle, XCircle,
  Activity, Target, Zap, Brain, LogIn, Loader2, Clock, Video, VideoOff
} from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'https://codecraft01-delta.vercel.app/api';
const SOCKET_URL = 'https://codecraft01-delta.vercel.app';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [violations, setViolations] = useState([]);
  const [error, setError] = useState('');

  const [liveStudents, setLiveStudents] = useState([]);
  const [socket, setSocket] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [studentsRes, leaderboardRes, statsRes, violationsRes] = await Promise.all([
        axios.get(`${API_URL}/students`),
        axios.get(`${API_URL}/leaderboard`),
        axios.get(`${API_URL}/stats`),
        axios.get(`${API_URL}/violations`)
      ]);
      
      setStudents(studentsRes.data);
      setLeaderboard(leaderboardRes.data);
      setStats(statsRes.data);
      setViolations(violationsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      initSocket();
    }
  }, [isLoggedIn]);

  const initSocket = () => {
    const newSocket = io(SOCKET_URL);
    
    newSocket.on('connect', () => {
      console.log('Admin socket connected');
    });

    newSocket.on('students-update', (data) => {
      setLiveStudents(data);
    });

    newSocket.on('student-joined', (student) => {
      console.log('Student joined:', student);
    });

    newSocket.on('student-left', (data) => {
      console.log('Student left:', data);
    });

    newSocket.on('violation-update', (data) => {
      console.log('Violation update:', data);
      setLiveStudents(prev => prev.map(s => 
        s.roll === data.roll ? { ...s, violations: data.violations, status: data.status } : s
      ));
    });

    newSocket.on('video-stream', (data) => {
      setLiveStudents(prev => prev.map(s => 
        s.roll === data.roll ? { ...s, isCameraOn: data.status === 'active' } : s
      ));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleStatusUpdate = async (studentId, newStatus) => {
    try {
      await axios.post(`${API_URL}/update-status`, { studentId, status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400';
      case 'Completed': return 'bg-blue-500/20 text-blue-400';
      case 'Left': return 'bg-red-500/20 text-red-400';
      case 'Flagged': return 'bg-orange-500/20 text-orange-400';
      case 'Disqualified': return 'bg-red-500/20 text-red-400';
      case 'Warning': return 'bg-amber-500/20 text-amber-400';
      case 'Selected': return 'bg-emerald-500/20 text-emerald-400';
      case 'Not Selected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll?.includes(searchTerm)
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]" />
        
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-4">
              <Shield className="size-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-slate-400 mt-2">Enter your credentials to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter password"
              />
            </div>
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="size-5" />
              Login
            </button>
          </form>
          
          <p className="text-center text-slate-500 text-sm mt-6">
            Default: admin / admin123
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'violations', label: 'Violations', icon: Shield },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents || 0, icon: Users, trend: '', color: 'violet' },
    { label: 'Selected', value: stats.selectedStudents || 0, icon: UserCheck, trend: '', color: 'emerald' },
    { label: 'Rejected', value: stats.rejectedStudents || 0, icon: UserX, trend: '', color: 'red' },
    { label: 'Pending', value: stats.pendingStudents || 0, icon: Clock, trend: '', color: 'blue' },
    { label: 'Avg Score', value: `${stats.averageScore || 0}%`, icon: TrendingUp, trend: '', color: 'amber' },
    { label: 'Highest Score', value: `${stats.highestScore || 0}%`, icon: Award, trend: '', color: 'yellow' },
    { label: 'Total Violations', value: stats.totalViolations || 0, icon: AlertTriangle, trend: '', color: 'orange' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed left-0 top-0 h-full bg-slate-900 border-r border-white/10 transition-all duration-300 z-40`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Shield className="size-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
            {sidebarOpen ? <X className="size-5 text-slate-400" /> : <Menu className="size-5 text-slate-400" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="size-5" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white capitalize">{tabs.find(t => t.id === activeTab)?.label}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="p-2 hover:bg-white/10 rounded-lg" title="Refresh">
              <Loader2 className={`size-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg relative">
              <Bell className="size-5 text-slate-400" />
              {violations.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <div className="size-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-white font-medium">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-10 text-violet-400 animate-spin" />
              <span className="ml-3 text-slate-400">Loading data...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {statCards.map((stat, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
                        <div className={`size-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-3`}>
                          <stat.icon className={`size-5 text-${stat.color}-400`} />
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <Download className="size-5 text-violet-400" />
                      <span className="text-white">Export Results</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <Send className="size-5 text-indigo-400" />
                      <span className="text-white">Send Emails</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <Bell className="size-5 text-amber-400" />
                      <span className="text-white">Send Alerts</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <Settings className="size-5 text-slate-400" />
                      <span className="text-white">Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'monitoring' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-emerald-400 text-sm font-medium">{liveStudents.length} Active</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name or roll..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  {liveStudents.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                      <Video className="size-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No students online</p>
                      <p className="text-slate-500 text-sm mt-2">Waiting for students to start the exam...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {liveStudents
                        .filter(s => 
                          s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.roll?.includes(searchTerm)
                        )
                        .map((student) => (
                          <div 
                            key={student.roll} 
                            className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
                              student.status === 'Suspicious' || student.status === 'Disqualified' 
                                ? 'border-red-500/50 animate-pulse' 
                                : 'border-white/10'
                            }`}
                          >
                            <div className="relative h-40 bg-slate-800 flex items-center justify-center">
                              {student.isCameraOn ? (
                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                  <div className="text-center">
                                    <Video className="size-8 text-emerald-400 mx-auto mb-2" />
                                    <span className="text-emerald-400 text-sm">Camera Active</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <VideoOff className="size-10 text-slate-500 mx-auto mb-2" />
                                  <span className="text-slate-500 text-sm">Camera Off</span>
                                </div>
                              )}
                              
                              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                                student.status === 'Active' ? 'bg-emerald-500/80 text-white' :
                                student.status === 'Warning' ? 'bg-amber-500/80 text-white' :
                                student.status === 'Suspicious' ? 'bg-orange-500/80 text-white' :
                                'bg-red-500/80 text-white'
                              }`}>
                                {student.status}
                              </div>
                              
                              {student.violations > 0 && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-500/80 rounded-full">
                                  <AlertTriangle className="size-3 text-white" />
                                  <span className="text-white text-xs font-medium">{student.violations}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-3">
                              <h4 className="text-white font-medium truncate">{student.name}</h4>
                              <p className="text-slate-400 text-sm">{student.roll}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'violations' && (
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {violations.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        No violations found
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Roll Number</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Violations</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Score</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {violations.map((v) => (
                            <tr key={v.id} className="hover:bg-white/5 transition-all">
                              <td className="px-6 py-4 text-white font-medium">{v.name}</td>
                              <td className="px-6 py-4 text-slate-400">{v.roll}</td>
                              <td className="px-6 py-4">
                                <span className="text-red-400 font-bold">{v.violations}</span>
                              </td>
                              <td className="px-6 py-4 text-slate-400">{v.percentage}%</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(v.status)}`}>
                                  {v.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button 
                                  onClick={() => handleStatusUpdate(v.id, 'Disqualified')}
                                  className="px-3 py-1 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition"
                                >
                                  Override
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                  {leaderboard.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center order-2">
                        <span className="text-6xl">🥈</span>
                        <h3 className="text-lg font-bold text-white mt-2">{leaderboard[1]?.name || '-'}</h3>
                        <p className="text-slate-400">{leaderboard[1]?.percentage || 0}%</p>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-400 text-white text-sm font-bold rounded-full">2</div>
                      </div>
                      <div className="relative bg-gradient-to-b from-amber-500/20 to-violet-500/20 border border-amber-500/30 rounded-2xl p-6 text-center order-1">
                        <span className="text-6xl">🥇</span>
                        <h3 className="text-lg font-bold text-white mt-2">{leaderboard[0]?.name || '-'}</h3>
                        <p className="text-amber-400">{leaderboard[0]?.percentage || 0}%</p>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">1</div>
                      </div>
                      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center order-3">
                        <span className="text-6xl">🥉</span>
                        <h3 className="text-lg font-bold text-white mt-2">{leaderboard[2]?.name || '-'}</h3>
                        <p className="text-slate-400">{leaderboard[2]?.percentage || 0}%</p>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">3</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {leaderboard.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        No leaderboard data available
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Rank</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Roll Number</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Score</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {leaderboard.map((student, idx) => (
                            <tr key={student._id} className="hover:bg-white/5 transition-all">
                              <td className="px-6 py-4">
                                <span className={`text-lg font-bold ${idx < 3 ? 'text-amber-400' : 'text-white'}`}>
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                              <td className="px-6 py-4 text-slate-400">{student.roll}</td>
                              <td className="px-6 py-4 text-white font-bold">{student.score || 0}</td>
                              <td className="px-6 py-4 text-slate-400">{student.percentage || 0}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name or roll..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      No students found
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudents.map((student) => (
                        <div key={student._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                              {student.name?.[0] || '?'}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{student.name || 'N/A'}</h3>
                              <p className="text-slate-400 text-sm">{student.roll || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-slate-400 text-sm">Branch</p>
                              <p className="text-white font-medium">{student.branch || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Year</p>
                              <p className="text-white font-medium">{student.year || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Score</p>
                              <p className="text-white font-bold">{student.percentage || 0}%</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Violations</p>
                              <p className={(student.violations || 0) > 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                                {student.violations || 0}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(student._id, 'Selected')}
                              className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(student._id, 'Not Selected')}
                              className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Selection Rate</h3>
                      <div className="h-48 flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-white">
                                {stats.totalStudents ? Math.round((stats.selectedStudents / stats.totalStudents) * 100) : 0}%
                              </p>
                              <p className="text-slate-400 text-sm">Selected</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Status Distribution</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Selected</span>
                            <span className="text-emerald-400">{stats.selectedStudents || 0}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.totalStudents ? (stats.selectedStudents / stats.totalStudents) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Rejected</span>
                            <span className="text-red-400">{stats.rejectedStudents || 0}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.totalStudents ? (stats.rejectedStudents / stats.totalStudents) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Pending</span>
                            <span className="text-blue-400">{stats.pendingStudents || 0}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.totalStudents ? (stats.pendingStudents / stats.totalStudents) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Selection Criteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Minimum Percentage</label>
                        <input 
                          type="number" 
                          defaultValue={60}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Top % Selection</label>
                        <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                          <option className="bg-slate-900">Top 20%</option>
                          <option className="bg-slate-900">Top 30%</option>
                          <option className="bg-slate-900">Top 40%</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Anti-Cheat Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-white font-medium">Auto Disqualify after 5 violations</p>
                          <p className="text-slate-400 text-sm">Automatically disqualify students with 5+ violations</p>
                        </div>
                        <button className="w-12 h-6 bg-violet-600 rounded-full relative">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-white font-medium">Tab Switch Detection</p>
                          <p className="text-slate-400 text-sm">Log violations when tab is switched</p>
                        </div>
                        <button className="w-12 h-6 bg-violet-600 rounded-full relative">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;