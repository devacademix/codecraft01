const express = require('express');
const router = express.Router();

let students = [
  { id: 1, name: 'Arjun Singh Rathour', roll: '2404851530014', score: 92, percentage: 92, status: 'Selected', violations: 0, section_scores: { aptitude: 14, core: 13, programming: 15 } },
  { id: 2, name: 'Shiva Mishra', roll: '2404851530059', score: 88, percentage: 88, status: 'Selected', violations: 1, section_scores: { aptitude: 13, core: 12, programming: 14 } },
  { id: 3, name: 'Abhishek Singh', roll: '2404851549001', score: 85, percentage: 85, status: 'Selected', violations: 0, section_scores: { aptitude: 12, core: 13, programming: 13 } },
  { id: 4, name: 'Ashish Kumar Prajapati', roll: '2404851530017', score: 78, percentage: 78, status: 'Not Selected', violations: 3, section_scores: { aptitude: 11, core: 12, programming: 12 } },
  { id: 5, name: 'Swayam Gupta', roll: '2404851530065', score: 95, percentage: 95, status: 'Selected', violations: 0, section_scores: { aptitude: 15, core: 14, programming: 15 } },
  { id: 6, name: 'Rakshit Gupta', roll: '2304851540044', score: 72, percentage: 72, status: 'Not Selected', violations: 2, section_scores: { aptitude: 10, core: 11, programming: 11 } },
  { id: 7, name: 'Vikram Singh', roll: '2304851540055', score: 65, percentage: 65, status: 'Not Selected', violations: 5, section_scores: { aptitude: 9, core: 10, programming: 10 } },
  { id: 8, name: 'Priya Sharma', roll: '2404851520012', score: 91, percentage: 91, status: 'Selected', violations: 0, section_scores: { aptitude: 14, core: 13, programming: 14 } },
];

let violations = [];
let settings = {
  minPercentage: 60,
  topPercentSelection: 20,
  autoDisqualify: true,
  tabSwitchDetection: true,
  idleDetection: true,
  emailNotifications: true
};

router.get('/students', (req, res) => {
  res.json(students);
});

router.get('/leaderboard', (req, res) => {
  const sorted = [...students].sort((a, b) => b.score - a.score);
  const leaderboard = sorted.map((s, idx) => ({ ...s, rank: idx + 1 }));
  res.json(leaderboard);
});

router.get('/violations', (req, res) => {
  res.json(violations);
});

router.post('/update-status', (req, res) => {
  const { studentId, status } = req.body;
  const student = students.find(s => s.id === studentId);
  if (student) {
    student.status = status;
    res.json({ success: true, student });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

router.post('/update-score', (req, res) => {
  const { studentId, score, sectionScores } = req.body;
  const student = students.find(s => s.id === studentId);
  if (student) {
    if (score !== undefined) student.score = score;
    if (sectionScores) student.section_scores = sectionScores;
    student.percentage = Math.round((student.score / 45) * 100);
    res.json({ success: true, student });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

router.post('/send-email', (req, res) => {
  const { studentId, type } = req.body;
  console.log(`Sending ${type} email to student ${studentId}`);
  res.json({ success: true, message: `Email sent successfully` });
});

router.post('/send-bulk-email', (req, res) => {
  const { type } = req.body;
  console.log(`Sending bulk ${type} emails to all students`);
  res.json({ success: true, message: `Bulk emails queued for ${students.length} students` });
});

router.get('/settings', (req, res) => {
  res.json(settings);
});

router.post('/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json({ success: true, settings });
});

router.get('/stats', (req, res) => {
  const total = students.length;
  const selected = students.filter(s => s.status === 'Selected').length;
  const rejected = total - selected;
  const avgScore = Math.round(students.reduce((acc, s) => acc + s.percentage, 0) / total);
  const highest = Math.max(...students.map(s => s.percentage));
  const totalViolations = students.reduce((acc, s) => acc + s.violations, 0);
  
  res.json({
    totalStudents: total,
    selectedStudents: selected,
    rejectedStudents: rejected,
    averageScore: avgScore,
    highestScore: highest,
    totalViolations
  });
});

router.get('/ai-insights', (req, res) => {
  const topPerformers = students.filter(s => s.percentage >= 80 && s.violations === 0).length;
  const suggestedShortlist = students.filter(s => s.percentage >= 60).length;
  const riskyCandidates = students.filter(s => s.percentage >= 70 && s.violations >= 3).length;
  const needImprovement = students.filter(s => s.percentage < 60).length;
  
  res.json({
    topPerformers,
    suggestedShortlist,
    riskyCandidates,
    needImprovement,
    recommendations: {
      recommended: students.filter(s => s.percentage >= 70 && s.violations < 3).length,
      reviewRequired: students.filter(s => s.percentage >= 50 && s.percentage < 70).length,
      recommendedReject: students.filter(s => s.percentage < 50).length
    }
  });
});

module.exports = router;