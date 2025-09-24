const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/participantController");

// Register a participant
router.post("/", ctrl.registerParticipant);

// Get all participants (optionally by pollId)
router.get("/", ctrl.getParticipants);

// Kick/remove a participant
router.delete("/:id", ctrl.removeParticipant);

module.exports = router;
