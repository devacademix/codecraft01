require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exam');
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/superAdmin');
const studentRoutes = require('./routes/student');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://codecraft01-delta.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: ["http://localhost:3000", "https://codecraft01-delta.vercel.app"]
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api', studentRoutes);

const activeStudents = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('student-join', (data) => {
    const studentData = {
      id: socket.id,
      name: data.name,
      roll: data.roll,
      status: 'Active',
      violations: data.violations || 0,
      isCameraOn: false,
      lastActiveTime: Date.now(),
      joinedAt: Date.now()
    };
    activeStudents.set(data.roll, studentData);
    io.emit('student-joined', studentData);
    io.emit('students-update', Array.from(activeStudents.values()));
  });

  socket.on('video-stream-start', (data) => {
    if (activeStudents.has(data.roll)) {
      const student = activeStudents.get(data.roll);
      student.isCameraOn = true;
      io.emit('video-stream', { roll: data.roll, status: 'active' });
    }
  });

  socket.on('video-stream-stop', (data) => {
    if (activeStudents.has(data.roll)) {
      const student = activeStudents.get(data.roll);
      student.isCameraOn = false;
      io.emit('video-stream', { roll: data.roll, status: 'stopped' });
    }
  });

  socket.on('violation-detected', (data) => {
    if (activeStudents.has(data.roll)) {
      const student = activeStudents.get(data.roll);
      student.violations = (student.violations || 0) + 1;
      student.lastActiveTime = Date.now();
      
      if (student.violations >= 5) {
        student.status = 'Disqualified';
      } else if (student.violations >= 3) {
        student.status = 'Suspicious';
      } else if (student.violations >= 1) {
        student.status = 'Warning';
      }
      
      io.emit('violation-update', {
        roll: data.roll,
        violations: student.violations,
        status: student.status,
        type: data.type
      });
    }
  });

  socket.on('student-activity', (data) => {
    if (activeStudents.has(data.roll)) {
      const student = activeStudents.get(data.roll);
      student.lastActiveTime = Date.now();
    }
  });

  socket.on('disconnect', () => {
    let removedStudent = null;
    for (const [roll, student] of activeStudents) {
      if (student.id === socket.id) {
        removedStudent = student;
        activeStudents.delete(roll);
        break;
      }
    }
    if (removedStudent) {
      io.emit('student-left', { roll: removedStudent.roll });
      io.emit('students-update', Array.from(activeStudents.values()));
    }
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/api/live-students', (req, res) => {
  res.json(Array.from(activeStudents.values()));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));