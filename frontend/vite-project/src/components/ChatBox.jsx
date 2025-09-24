// add inside ChatBox.jsx
import React, { useEffect, useState } from "react";
import socket from "../socket";
import { getParticipants } from "../services/api";

export default function ChatBox({ pollId, role = "student" }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [participants, setParticipants] = useState([]);

  // --- Initial setup (chat + socket listeners)
  useEffect(() => {
    if (!pollId) return;

    socket.emit("joinChat", pollId);

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("participants", (list) => {
      setParticipants(list);
    });

    return () => {
      socket.emit("leaveChat", pollId);
      socket.off("chatMessage");
      socket.off("participants");
    };
  }, [pollId]);

  // --- Fetch participants when tab is switched
  useEffect(() => {
    if (tab === "participants" && pollId) {
      const fetchParticipants = async () => {
        try {
          const res = await getParticipants(pollId);
          setParticipants(res.data);
        } catch (err) {
          console.error("Failed to fetch participants:", err);
        }
      };
      fetchParticipants();
    }
  }, [tab, pollId]);

  // --- Chat message
  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chatMessage", { pollId, text: input });
    setInput("");
  };

  // --- Kick user (teacher only)
  const kickUser = async (userId) => {
    socket.emit("kickUser", { pollId, userId });

    // Refresh after kick
    try {
      const res = await getParticipants(pollId);
      setParticipants(res.data);
    } catch (err) {
      console.error("Failed to refresh participants:", err);
    }
  };

  return (
    <div>
      {/* Floating chat icon */}
      {!open && (
        <button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg fixed bottom-6 right-6"
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      )}

      {/* Chat box panel */}
      {open && (
        <div className="h-[40vh] fixed bottom-6 right-6 w-80 bg-white border rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Header Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setTab("chat")}
              className={`flex-1 py-2 font-semibold ${
                tab === "chat"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : ""
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setTab("participants")}
              className={`flex-1 py-2 font-semibold ${
                tab === "participants"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : ""
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {tab === "chat" && (
              <div className="flex flex-col gap-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[75%] px-3 py-2 rounded-lg ${
                      m.user === "me"
                        ? "self-end bg-purple-500 text-white"
                        : "self-start bg-gray-200 text-black"
                    }`}
                  >
                    <span className="block text-xs font-bold">
                      {m.username}
                    </span>
                    {m.text}
                  </div>
                ))}
              </div>
            )}

            {tab === "participants" && (
              <ul className="flex flex-col gap-2">
                {participants.map((p) => (
                  <li
                    key={p._id || p.id}
                    className="flex justify-between items-center border p-2 rounded-md"
                  >
                    <span>{p.name || p.username}</span>
                    {role === "teacher" && (
                      <button
                        onClick={() => kickUser(p._id || p.id)}
                        className="text-red-500 text-sm"
                      >
                        Kick
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chat input */}
          {tab === "chat" && (
            <div className="flex border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 outline-none"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 bg-purple-500 text-white"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
