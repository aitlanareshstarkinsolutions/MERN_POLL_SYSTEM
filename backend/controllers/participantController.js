const mongoose = require("mongoose");
const Participant = require("../models/Participant");

/* =========================
   Register participant
   ========================= */
exports.registerParticipant = async (req, res) => {
  try {
    const { name, role, pollId, socketId } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: "Name and role are required" });
    }

    const participant = await Participant.create({
      name,
      role,
      pollId: pollId ? new mongoose.Types.ObjectId(pollId) : undefined,
      socketId,
    });

    return res.status(201).json(participant);
  } catch (err) {
    console.error("❌ Error registering participant:", err);
    return res.status(500).json({ error: "Failed to register participant" });
  }
};

/* =========================
   Get participants
   ========================= */
exports.getParticipants = async (req, res) => {
  try {
    const { pollId } = req.query;

    let query = {};
    if (pollId) {
      query.pollId = new mongoose.Types.ObjectId(pollId);
    }

    const participants = await Participant.find(query).lean();

    return res.json(participants);
  } catch (err) {
    console.error("❌ Error fetching participants:", err);
    return res.status(500).json({ error: "Failed to fetch participants" });
  }
};

/* =========================
   Remove participant (kick)
   ========================= */
exports.removeParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Participant.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Participant not found" });
    }

    return res.json({ message: "Participant removed" });
  } catch (err) {
    console.error("❌ Error removing participant:", err);
    return res.status(500).json({ error: "Failed to remove participant" });
  }
};
