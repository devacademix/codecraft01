import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useWebcam = (examSession) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsStreaming(true);
      setIsCameraOn(true);
      setCameraError(null);

      if (socketRef.current && examSession?.roll) {
        socketRef.current.emit('video-stream-start', { roll: examSession.roll });
      }
      
      return true;
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(err.message || 'Camera not accessible');
      setIsCameraOn(false);
      return false;
    }
  }, [examSession?.roll]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsCameraOn(false);

    if (socketRef.current && examSession?.roll) {
      socketRef.current.emit('video-stream-stop', { roll: examSession.roll });
    }
  }, [examSession?.roll]);

  const initSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL);
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        if (examSession?.roll) {
          socketRef.current.emit('student-join', {
            name: examSession.studentName,
            roll: examSession.roll,
            violations: 0
          });
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return socketRef.current;
  }, [examSession?.roll, examSession?.studentName]);

  const reportViolation = useCallback((type) => {
    if (socketRef.current && examSession?.roll) {
      socketRef.current.emit('violation-detected', {
        roll: examSession.roll,
        type,
        timestamp: Date.now()
      });
    }
  }, [examSession?.roll]);

  const sendActivity = useCallback(() => {
    if (socketRef.current && examSession?.roll) {
      socketRef.current.emit('student-activity', {
        roll: examSession.roll
      });
    }
  }, [examSession?.roll]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    videoRef,
    isStreaming,
    cameraError,
    isCameraOn,
    startCamera,
    stopCamera,
    initSocket,
    reportViolation,
    sendActivity,
    socket: socketRef.current
  };
};

export default useWebcam;