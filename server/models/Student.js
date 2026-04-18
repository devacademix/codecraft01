const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  roll: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  programmingLanguage: {
    type: String
  },
  domain: {
    type: String
  },
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Selected', 'Not Selected', 'Pending'],
    default: 'Pending'
  },
  violations: {
    type: Number,
    default: 0
  },
  section_scores: {
    aptitude: { type: Number, default: 0 },
    core: { type: Number, default: 0 },
    programming: { type: Number, default: 0 }
  },
  examStartTime: {
    type: Date
  },
  examEndTime: {
    type: Date
  },
  isDisqualified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

studentSchema.index({ roll: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ percentage: -1 });

module.exports = mongoose.model('Student', studentSchema);