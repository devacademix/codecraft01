import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, AlertTriangle, XCircle, Eye, EyeOff, Clock, 
  Copy, Lock, Unlock, CheckCircle, X, RefreshCw, Video, VideoOff
} from 'lucide-react';
import axios from 'axios';
import { useWebcam } from '../hooks/useWebcam';
import warningSound from '../assest/dragon-studio-warning-warning-warning-386172.mp3';

const VIOLATION_THRESHOLDS = {
  WARNING: 2,
  FLAG: 5,
  DISQUALIFY: 10
};

const VIOLATION_TYPES = {
  TAB_SWITCH: 'TAB_SWITCH',
  FULLSCREEN_EXIT: 'FULLSCREEN_EXIT',
  MULTIPLE_TABS: 'MULTIPLE_TABS',
  COPY_ATTEMPT: 'COPY_ATTEMPT',
  PASTE_ATTEMPT: 'PASTE_ATTEMPT',
  RIGHT_CLICK: 'RIGHT_CLICK',
  IDLE_DETECTED: 'IDLE_DETECTED'
};

export const useProctoring = (examSession) => {
  const [violations, setViolations] = useState([]);
  const [status, setStatus] = useState('SAFE');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const lastActivityTime = useRef(Date.now());
  const idleCheckInterval = useRef(null);

  const logViolation = useCallback((type) => {
    const violation = {
      type,
      timestamp: new Date().toISOString(),
      sessionId: examSession?.sessionId
    };
    
    setViolations(prev => {
      const newViolations = [...prev, violation];
      
      const count = newViolations.length;
      if (count > VIOLATION_THRESHOLDS.DISQUALIFY) {
        setStatus('DISQUALIFIED');
      } else if (count > VIOLATION_THRESHOLDS.FLAG) {
        setStatus('FLAGGED');
      } else if (count > VIOLATION_THRESHOLDS.WARNING) {
        setStatus('WARNING');
      }
      
      return newViolations;
    });

    if (examSession?.studentName) {
      sendViolationToBackend(violation);
    }
    
    return violation;
  }, [examSession]);

  const sendViolationToBackend = async (violation) => {
    try {
      await axios.post('http://localhost:5000/api/violations', {
        studentName: examSession.studentName,
        rollNumber: examSession.rollNumber,
        type: violation.type,
        time: violation.timestamp
      });
    } catch (err) {
      console.error('Failed to send violation:', err);
    }
  };

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    lastActivityTime.current = Date.now();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation(VIOLATION_TYPES.TAB_SWITCH);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation(VIOLATION_TYPES.FULLSCREEN_EXIT);
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    const handleCopy = (e) => {
      e.preventDefault();
      logViolation(VIOLATION_TYPES.COPY_ATTEMPT);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      logViolation(VIOLATION_TYPES.PASTE_ATTEMPT);
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      logViolation(VIOLATION_TYPES.RIGHT_CLICK);
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
        logViolation(e.key === 'c' ? VIOLATION_TYPES.COPY_ATTEMPT : VIOLATION_TYPES.PASTE_ATTEMPT);
      }
    };

    idleCheckInterval.current = setInterval(() => {
      const idleTime = Date.now() - lastActivityTime.current;
      if (idleTime > 120000) {
        logViolation(VIOLATION_TYPES.IDLE_DETECTED);
        lastActivityTime.current = Date.now();
      }
    }, 30000);

    const updateActivity = () => {
      lastActivityTime.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      setIsMonitoring(false);
      clearInterval(idleCheckInterval.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, [logViolation]);

  return {
    violations,
    status,
    isMonitoring,
    startMonitoring,
    violationCount: violations.length
  };
};

const Exam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showDisqualifyModal, setShowDisqualifyModal] = useState(false);
  
  const [examSession, setExamSession] = useState(() => {
    const saved = localStorage.getItem('examSession');
    return saved ? JSON.parse(saved) : null;
  });

  const {
    violations,
    status,
    isMonitoring,
    startMonitoring,
    violationCount
  } = useProctoring(examSession);

  const {
    videoRef,
    isStreaming,
    cameraError,
    isCameraOn,
    startCamera,
    stopCamera,
    initSocket,
    reportViolation
  } = useWebcam(examSession);

  const playWarningSound = () => {
    const audio = new Audio(warningSound);
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  useEffect(() => {
    if (violationCount === 1 || violationCount === 2) {
      setWarningMessage(`Warning ${violationCount}/${VIOLATION_THRESHOLDS.WARNING}: Please follow exam rules!`);
      setShowWarning(true);
      playWarningSound();
      setTimeout(() => setShowWarning(false), 5000);
    } else if (violationCount >= 3 && violationCount < 5) {
      setWarningMessage(`Alert ${violationCount}: You have been flagged. Further violations may lead to disqualification.`);
      setShowWarning(true);
      playWarningSound();
    } else if (violationCount >= 5) {
      playWarningSound();
      setShowDisqualifyModal(true);
    }
  }, [violationCount]);

  const handleStartExam = async () => {
    const session = {
      sessionId: Date.now().toString(),
      studentName: user?.name || 'Student',
      rollNumber: user?.rollNumber || 'Unknown',
      startTime: new Date().toISOString(),
      status: 'ACTIVE'
    };
    
    localStorage.setItem('examSession', JSON.stringify(session));
    setExamSession(session);
    
    try {
      await axios.post('http://localhost:5000/api/exam/start', {
        studentName: session.studentName,
        rollNumber: session.rollNumber,
        startTime: session.startTime
      });
    } catch (err) {
      console.error('Failed to start exam session:', err);
    }

    const socket = initSocket();
    
    const cameraStarted = await startCamera();
    if (!cameraStarted && cameraError) {
      reportViolation('CAMERA_OFF');
    }

    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.log('Fullscreen request failed');
    }

    startMonitoring();
    setExamStarted(true);
  };

  const handleEndExam = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    localStorage.removeItem('examSession');
    navigate('/dashboard');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'SAFE': return 'text-emerald-400';
      case 'WARNING': return 'text-amber-400';
      case 'FLAGGED': return 'text-orange-400';
      case 'DISQUALIFIED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'SAFE': return 'bg-emerald-500/20 border-emerald-500/30';
      case 'WARNING': return 'bg-amber-500/20 border-amber-500/30';
      case 'FLAGGED': return 'bg-orange-500/20 border-orange-500/30';
      case 'DISQUALIFIED': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-6">
                <Shield className="size-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Online Examination</h1>
              <p className="text-slate-400">Codecraft Coding Club Entrance Exam</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="size-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Lock className="size-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Fullscreen Mode</h3>
                  <p className="text-slate-400 text-sm">Exam requires fullscreen during the test</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="size-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Proctoring Active</h3>
                  <p className="text-slate-400 text-sm">Tab switches and suspicious activity will be monitored</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="size-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="size-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Strict Rules</h3>
                  <p className="text-slate-400 text-sm">Copy/paste and right-click disabled during exam</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Unlock className="size-5" />
              Start Exam
            </button>

            <p className="text-center text-slate-500 text-sm mt-4">
              By starting, you agree to the exam rules and proctoring policies
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-violet-400" />
                <span className="text-white font-semibold">Proctored Exam</span>
              </div>
              <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 ${getStatusBg()}`}>
                {status === 'SAFE' ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {status === 'SAFE' ? 'Safe' : status === 'WARNING' ? 'Warning' : status === 'FLAGGED' ? 'Flagged' : 'Disqualified'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <AlertTriangle className={`size-4 ${violationCount > 0 ? 'text-amber-400' : ''}`} />
                <span className="text-sm">Violations: {violationCount}</span>
              </div>
            </div>
            
            <button
              onClick={handleEndExam}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2"
            >
              <X className="size-4" />
              End Exam
            </button>
          </div>
        </div>
      </div>

      {showWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex items-center gap-3 px-6 py-4 bg-amber-500/90 text-white rounded-xl shadow-lg">
            <AlertTriangle className="size-5" />
            <span className="font-medium">{warningMessage}</span>
          </div>
        </div>
      )}

      {showDisqualifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
              <XCircle className="size-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Disqualified</h2>
            <p className="text-slate-400 mb-6">
              You have been disqualified due to multiple violations. Your exam has been terminated.
            </p>
            <button
              onClick={() => {
                stopCamera();
                handleEndExam();
              }}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {isCameraOn && (
        <div className="fixed top-20 right-4 z-40 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-lg">
          <div className="relative w-40 h-32 rounded-xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-emerald-500/80 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs text-white font-medium">Live</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              {isCameraOn ? <Video className="size-3" /> : <VideoOff className="size-3" />}
              Camera {isCameraOn ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      )}

      {!isCameraOn && examStarted && (
        <div className="fixed top-20 right-4 z-40 bg-red-500/20 backdrop-blur-xl rounded-2xl border border-red-500/30 p-4">
          <div className="flex items-center gap-2 text-red-400">
            <VideoOff className="size-5" />
            <span className="text-sm font-medium">Camera Off</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Please enable camera</p>
        </div>
      )}

      <div className="pt-20">
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLScUZkO0ytL7pTsmqfn8mlYdF8O-Mn8wMT3eWlhh_X_zQ-oqDg/viewform?embedded=true" 
          className="w-full h-[calc(100vh-80px)] border-0"
          title="Exam Form"
        />
      </div>
    </div>
  );
};

export default Exam;