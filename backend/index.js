require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const pollRoutes = require("./routes/pollRoutes");
const Poll = require("./models/Poll");

const app = express();
const server = http.createServer(app);

// --- Config ---
app.use(express.json());

// ✅ Allow multiple frontend origins (React or Vite)
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://checkingpollingsystem.com",
];

// ✅ Apply CORS to Express
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// --- Socket.IO ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- Routes ---
app.use("/api/polls", pollRoutes);
const participantRoutes = require("./routes/participantRoutes");

// Mount routes
app.use("/api/participants", participantRoutes);
// --- Socket events ---
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("joinPoll", (pollId) => {
    socket.join(pollId);
  });

  socket.on("leavePoll", (pollId) => {
    socket.leave(pollId);
  });

  socket.on("submitAnswer", async ({ pollId, optionIndex }) => {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll || !poll.active) return;

      poll.options[optionIndex].votes += 1;
      await poll.save();

      io.to(pollId).emit("pollUpdated", poll);
      io.emit("pollListUpdated");
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("createPoll", async (poll) => {
    try {
      const newPoll = new Poll({
        question: poll.question,
        options: poll.options.map((o) => ({
          text: o.text,
          isCorrect: !!o.isCorrect,
        })),
        createdBy: poll.createdBy,
        durationSeconds: poll.durationSeconds || 60,
      });

      await newPoll.save();
      io.emit("pollCreated", newPoll);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("closePoll", async (pollId) => {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) return;

      poll.active = false;
      await poll.save();
      io.emit("pollClosed", poll);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("chatMessage", ({ pollId, author, text }) => {
    io.to(pollId).emit("chatMessage", { author, text, time: Date.now() });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// --- Connect DB and start server ---
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");

    const port = process.env.PORT || 5000;
    server.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ DB connection error", err);
  }
};

start();
