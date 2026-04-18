const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getLeaderboard,
  getStats,
  getViolations,
  createOrUpdateStudent,
  updateStudentStatus,
  updateStudentScore,
  deleteStudent
} = require('../controllers/studentController');

router.get('/students', getAllStudents);
router.get('/leaderboard', getLeaderboard);
router.get('/stats', getStats);
router.get('/violations', getViolations);
router.post('/students', createOrUpdateStudent);
router.post('/update-status', updateStudentStatus);
router.post('/update-score', updateStudentScore);
router.delete('/students/:id', deleteStudent);

module.exports = router;