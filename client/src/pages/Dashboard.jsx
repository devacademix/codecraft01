import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">Ready to take your next exam?</p>
          </div>

          <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Start?</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Click the button below to join your exam. You will be redirected to the exam form.
            </p>

            <Link
              to="/exam"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-lg shadow-violet-500/30"
            >
              Join Exam
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
