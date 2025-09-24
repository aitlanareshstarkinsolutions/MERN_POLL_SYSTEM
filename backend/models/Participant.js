const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["student", "teacher"], required: true },
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
    socketId: { type: String },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Participant", participantSchema);
