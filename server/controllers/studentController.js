const axios = require('axios');

const SHEETDB_API = 'https://sheetdb.io/api/v1/ggsckycikjkgt';

const fetchFromSheet = async () => {
  try {
    const response = await axios.get(SHEETDB_API);
    return response.data;
  } catch (err) {
    console.error('Error fetching from SheetDB:', err.message);
    return [];
  }
};

const getAllStudents = async (req, res) => {
  try {
    const data = await fetchFromSheet();
    const students = data.map((item, index) => ({
      _id: index.toString(),
      name: item['Student Name']?.trim() || item['Student Name ']?.trim() || '',
      roll: item['Roll Number'] || '',
      email: item['Email'] || '',
      branch: item['Branch'] || '',
      year: item['Year ']?.trim() || item['Year']?.trim() || '',
      phone: item['Mobile Number ']?.trim() || item['Mobile Number'] || '',
      programmingLanguage: item['Preferred Programming Language ']?.trim() || item['Preferred Programming Language'] || '',
      domain: item['Domain (Framework)']?.trim() || '',
      score: 0,
      percentage: 0,
      rank: 0,
      status: 'Pending',
      violations: 0,
      section_scores: { aptitude: 0, core: 0, programming: 0 },
      timestamp: item['Timestamp']
    }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const data = await fetchFromSheet();
    const studentsWithScores = data.filter(item => item['Score'] || item['Percentage']);
    
    const leaderboard = studentsWithScores
      .map((item, index) => ({
        _id: index.toString(),
        name: item['Student Name']?.trim() || '',
        roll: item['Roll Number'] || '',
        email: item['Email'] || '',
        branch: item['Branch'] || '',
        score: parseInt(item['Score']) || 0,
        percentage: parseInt(item['Percentage']) || 0,
        status: item['Status'] || 'Pending',
        rank: index + 1
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .map((s, idx) => ({ ...s, rank: idx + 1 }));
    
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const data = await fetchFromSheet();
    const totalStudents = data.length;
    const selectedStudents = data.filter(item => item['Status'] === 'Selected').length;
    const rejectedStudents = data.filter(item => item['Status'] === 'Not Selected').length;
    const pendingStudents = data.filter(item => item['Status'] !== 'Selected' && item['Status'] !== 'Not Selected').length;
    
    const scores = data.filter(item => item['Score']).map(item => parseInt(item['Score']));
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    
    const totalViolations = data.reduce((acc, item) => {
      const v = parseInt(item['Violations']) || 0;
      return acc + v;
    }, 0);

    res.json({
      totalStudents,
      selectedStudents,
      rejectedStudents,
      pendingStudents,
      averageScore: avgScore,
      highestScore,
      totalViolations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getViolations = async (req, res) => {
  try {
    const data = await fetchFromSheet();
    const violationsData = data
      .filter(item => parseInt(item['Violations']) > 0)
      .map((item, index) => ({
        id: index.toString(),
        name: item['Student Name']?.trim() || '',
        roll: item['Roll Number'] || '',
        violations: parseInt(item['Violations']) || 0,
        percentage: parseInt(item['Score']) || 0,
        status: (parseInt(item['Violations']) || 0) >= 5 ? 'Disqualified' : 
                (parseInt(item['Violations']) || 0) >= 3 ? 'Flagged' : 'Warning'
      }))
      .sort((a, b) => b.violations - a.violations);
    
    res.json(violationsData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrUpdateStudent = async (req, res) => {
  try {
    res.json({ success: true, message: 'Data fetched from SheetDB - use SheetDB portal to update data' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudentStatus = async (req, res) => {
  try {
    res.json({ success: false, message: 'Status update not supported - update directly in Google Sheet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudentScore = async (req, res) => {
  try {
    res.json({ success: false, message: 'Score update not supported - update directly in Google Sheet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    res.json({ success: false, message: 'Delete not supported - update directly in Google Sheet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStudents,
  getLeaderboard,
  getStats,
  getViolations,
  createOrUpdateStudent,
  updateStudentStatus,
  updateStudentScore,
  deleteStudent
};