import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Code2 className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">Code<span className="text-violet-400">CRFT</span></span>
              <span className="text-[10px] text-slate-400 -mt-1">by SRGI</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-slate-300 hidden sm:block">Welcome, {user.name}</span>
                <Link to="/dashboard" className="px-4 py-2 text-slate-300 hover:text-white transition">
                  Dashboard
                </Link>
                <Link to="/exam" className="px-4 py-2 text-slate-300 hover:text-white transition">
                  Exam
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition border border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white transition">
                  Login
                </Link>
                <Link to="/status" className="px-4 py-2 text-slate-300 hover:text-white transition">
                  Check Status
                </Link>
                <Link to="/leaderboard" className="px-4 py-2 text-slate-300 hover:text-white transition">
                  Leaderboard
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
