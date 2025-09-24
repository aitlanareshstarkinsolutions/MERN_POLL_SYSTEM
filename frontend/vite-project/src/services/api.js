// src/services/apiService.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= Poll APIs ================= */

// Create a new poll
export const createPoll = (data) => API.post("/polls", data);

// Get all polls
export const getAllPolls = () => API.get("/polls");

// Get a specific poll by ID
export const getPoll = (id) => API.get(`/polls/${id}`);

// Submit answer to a poll
export const answerPoll = (id, optionIndex) =>
  API.post(`/polls/${id}/answer`, { optionIndex });

// Close a poll manually
export const closePoll = (id) => API.post(`/polls/${id}/close`);

/* ============== Participant APIs ============== */

// Register a participant
// Register participant
export const registerParticipant = (data) => API.post("/participants", data);

// Get all participants (optionally filter by pollId)
export const getParticipants = (pollId) =>
  API.get("/participants", { params: { pollId } });

// Remove (kick) a participant
export const removeParticipant = (id) => API.delete(`/participants/${id}`);

export default API;
