import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import socket from "../socket";
import ChatBox from "../components/ChatBox";

export default function TeacherView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data);
    };
    fetchPoll();

    socket.emit("joinPoll", id);

    socket.on("pollUpdated", (p) => setPoll(p));
    socket.on("pollClosed", (p) => {
      if (p._id === id) setPoll(p);
    });

    return () => {
      socket.off("pollUpdated");
      socket.off("pollClosed");
      socket.emit("leavePoll", id);
    };
  }, [id]);

  const closePoll = async () => {
    socket.emit("closePoll", id);
    await API.post(`/polls/${id}/close`);
  };

  if (!poll)
    return (
      <div className="flex items-center justify-center h-screen">
        <h3 className="text-xl font-semibold text-gray-600">Loading poll...</h3>
      </div>
    );

  const totalVotes =
    poll?.options?.reduce((sum, o) => sum + (o.votes || 0), 0) || 1;

  return (
    <div className="w-full flex flex-col items-center py-10 px-4 bg-gray-50 min-h-screen">
      {/* Top bar with title + View history button */}
      <button
        className="flex  justify-end items-center gap-2 px-5 py-2 rounded-full bg-purple-500 text-white font-medium hover:opacity-90 transition"
        onClick={() => navigate("/history")}
      >
        <svg
          width="31"
          height="31"
          viewBox="0 0 31 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1_502)">
            <path
              d="M15.5 6.125C9.25 6.125 3.9125 10.0125 1.75 15.5C3.9125 20.9875 9.25 24.875 15.5 24.875C21.7563 24.875 27.0875 20.9875 29.25 15.5C27.0875 10.0125 21.7563 6.125 15.5 6.125ZM15.5 21.75C12.05 21.75 9.25 18.95 9.25 15.5C9.25 12.05 12.05 9.25 15.5 9.25C18.95 9.25 21.75 12.05 21.75 15.5C21.75 18.95 18.95 21.75 15.5 21.75ZM15.5 11.75C13.4312 11.75 11.75 13.4313 11.75 15.5C11.75 17.5688 13.4312 19.25 15.5 19.25C17.5688 19.25 19.25 17.5688 19.25 15.5C19.25 13.4313 17.5688 11.75 15.5 11.75Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_1_502">
              <rect
                width="30"
                height="30"
                fill="white"
                transform="translate(0.5 0.5)"
              />
            </clipPath>
          </defs>
        </svg>
        View Poll History
      </button>

      {/* Poll Card */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl overflow-hidden p-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Question</h2>
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white px-6 py-4 text-lg font-semibold">
          {poll.question}
        </div>

        <div className="p-6 space-y-4">
          {poll?.options?.map((opt, idx) => {
            const pct = Math.round((opt.votes / totalVotes) * 100);
            return (
              <div
                key={idx}
                className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 text-sm font-bold text-gray-700 bg-white rounded-full border border-gray-300">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {opt.text}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 text-white font-semibold hover:opacity-90 transition"
          onClick={() => navigate("/teacher/create")}
        >
          + Ask a new question
        </button>
      </div>

      <div className="mt-10 w-full max-w-2xl">
        <ChatBox pollId={id} />
      </div>
    </div>
  );
}
