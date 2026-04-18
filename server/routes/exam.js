const express = require('express');
const router = express.Router();

let examSessions = [];
let violations = [];

router.post('/start', (req, res) => {
  const { studentName, rollNumber, startTime } = req.body;
  
  const session = {
    sessionId: Date.now().toString(),
    studentName,
    rollNumber,
    startTime,
    status: 'ACTIVE',
    violations: []
  };
  
  examSessions.push(session);
  
  res.json({ success: true, session });
});

router.post('/violation', (req, res) => {
  const { studentName, rollNumber, type, time } = req.body;
  
  const violation = {
    studentName,
    rollNumber,
    type,
    time
  };
  
  violations.push(violation);
  
  const sessionIndex = examSessions.findIndex(s => s.rollNumber === rollNumber);
  if (sessionIndex !== -1) {
    examSessions[sessionIndex].violations.push(violation);
    
    if (examSessions[sessionIndex].violations.length >= 10) {
      examSessions[sessionIndex].status = 'DISQUALIFIED';
    } else if (examSessions[sessionIndex].violations.length >= 5) {
      examSessions[sessionIndex].status = 'FLAGGED';
    } else if (examSessions[sessionIndex].violations.length >= 3) {
      examSessions[sessionIndex].status = 'WARNING';
    }
  }
  
  res.json({ success: true, violation });
});

router.get('/status/:rollNumber', (req, res) => {
  const { rollNumber } = req.params;
  const session = examSessions.find(s => s.rollNumber === rollNumber);
  
  if (!session) {
    return res.json({ status: 'NOT_STARTED' });
  }
  
  res.json({
    status: session.status,
    violations: session.violations.length,
    startTime: session.startTime
  });
});

router.get('/violations', (req, res) => {
  res.json(violations);
});

module.exports = router;