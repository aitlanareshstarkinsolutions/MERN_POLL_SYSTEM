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
          <svg
            width="20"
            height="20"
            viewBox="0 0 39 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.625 0H7.875C6.58207 0 5.34209 0.513615 4.42785 1.42785C3.51361 2.34209 3 3.58207 3 4.875V21.125C3 22.4179 3.51361 23.6579 4.42785 24.5721C5.34209 25.4864 6.58207 26 7.875 26H26.7087L32.7213 32.0288C32.8731 32.1794 33.0532 32.2985 33.2512 32.3794C33.4491 32.4603 33.6611 32.5012 33.875 32.5C34.0882 32.5055 34.2996 32.461 34.4925 32.37C34.7893 32.2481 35.0433 32.0411 35.2226 31.775C35.4019 31.509 35.4984 31.1958 35.5 30.875V4.875C35.5 3.58207 34.9864 2.34209 34.0721 1.42785C33.1579 0.513615 31.9179 0 30.625 0ZM32.25 26.9588L28.5287 23.2213C28.3769 23.0706 28.1968 22.9515 27.9988 22.8706C27.8009 22.7898 27.5889 22.7488 27.375 22.75H7.875C7.44402 22.75 7.0307 22.5788 6.72595 22.274C6.42121 21.9693 6.25 21.556 6.25 21.125V4.875C6.25 4.44402 6.42121 4.0307 6.72595 3.72595C7.0307 3.42121 7.44402 3.25 7.875 3.25H30.625C31.056 3.25 31.4693 3.42121 31.774 3.72595C32.0788 4.0307 32.25 4.44402 32.25 4.875V26.9588Z"
              fill="white"
            />
          </svg>
        </button>
      )}

      {/* Chat box panel */}
      {open && (
        <div className="h-[40vh] fixed bottom-6 right-6 w-full bg-white border rounded-lg shadow-lg flex flex-col overflow-hidden">
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
                {messages?.map((m, i) => (
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
                {participants?.map((p) => (
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
