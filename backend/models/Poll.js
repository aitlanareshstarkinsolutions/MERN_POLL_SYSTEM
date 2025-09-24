const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
  isCorrect: { type: Boolean, default: false }
});

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [OptionSchema],
  createdBy: { type: String },
  durationSeconds: { type: Number, default: 60 },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true } // active means currently live
});

module.exports = mongoose.model('Poll', PollSchema);
