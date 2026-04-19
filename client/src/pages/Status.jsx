import { useState } from 'react';
import { Search, CheckCircle, XCircle, Loader2, User, Mail, Code, GraduationCap, Calendar, Award, ArrowRight, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Status = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rollNumber.trim() || !studentName.trim()) {
      setError('Please enter both Roll Number and Student Name');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(
        `https://sheetdb.io/api/v1/ggsckycikjkgt/search?Roll%20Number=${encodeURIComponent(rollNumber.trim())}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.length > 0) {
        const student = response.data.find(
          s => (s['Student Name'] || s['Student Name '])?.toLowerCase().trim() === studentName.toLowerCase().trim()
        );
        
        if (student) {
          setResult(student);
        } else {
          setError('Roll Number found but Student Name does not match. Please check your details.');
        }
      } else {
        setError('Sorry, no record found. You are not selected.');
      }
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || err.message || 'Unable to verify. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRollNumber('');
    setStudentName('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-violet-500/20 to-transparent rounded-b-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!result ? (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-6">
                <Award className="size-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Selection{' '}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Result
                </span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Enter your credentials to check your admission status in the Codecraft Coding Club
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-1">
              <div className="bg-slate-900/80 rounded-2xl p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <User className="size-4 text-violet-400" />
                        Roll Number
                      </label>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g., 2404851530014"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <User className="size-4 text-violet-400" />
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g., Arjun Singh"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
                      <XCircle className="size-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Search className="size-5 group-hover:scale-110 transition-transform" />
                        <span>Check Result</span>
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                  Make sure to enter details exactly as during registration
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-6 text-slate-500 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-400" />
                Secure Verification
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-400" />
                Instant Results
              </span>
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-1">
              <div className="bg-slate-900/80 rounded-2xl p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mb-6 shadow-lg shadow-emerald-500/30 animate-pulse">
                    <CheckCircle className="size-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-xl text-emerald-400 font-medium">
                    {result['Student Name']?.trim()}, you are selected!
                  </p>
                  <p className="text-slate-400 mt-2">
                    Welcome to Codecraft Coding Club
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 text-violet-400 mb-2">
                      <User className="size-4" />
                      <span className="text-xs uppercase tracking-wider">Roll Number</span>
                    </div>
                    <p className="text-white font-bold text-lg">{result['Roll Number']}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 text-violet-400 mb-2">
                      <GraduationCap className="size-4" />
                      <span className="text-xs uppercase tracking-wider">Branch</span>
                    </div>
                    <p className="text-white font-bold text-lg">{result['Branch']}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 text-violet-400 mb-2">
                      <Calendar className="size-4" />
                      <span className="text-xs uppercase tracking-wider">Year</span>
                    </div>
                    <p className="text-white font-bold text-lg">{result['Year '] || result['Year']}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2 text-violet-400 mb-2">
                      <Code className="size-4" />
                      <span className="text-xs uppercase tracking-wider">Programming</span>
                    </div>
                    <p className="text-white font-bold text-lg">{result['Preferred Programming Language']?.trim() || result['Preferred Programming Language ']?.trim()}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 text-violet-400 mb-2">
                      <Award className="size-4" />
                      <span className="text-xs uppercase tracking-wider">Domain</span>
                    </div>
                    <p className="text-white font-bold text-lg">{result['Domain (Framework)']?.trim() || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all col-span-2">
                    <div className="flex items-center gap-2 text-violet-400 mb-2">
                      <Mail className="size-4" />
                      <span className="text-xs uppercase tracking-wider">Email</span>
                    </div>
                    <p className="text-white font-bold text-lg">{result['Email']}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="size-5" />
                    Check Another
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    Go to Home
                    <ArrowRight className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;