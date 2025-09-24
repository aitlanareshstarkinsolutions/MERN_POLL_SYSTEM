import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import socket from "../socket";
import ChatBox from "../components/ChatBox";

export default function StudentResult() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data);
    };
    fetch();

    socket.emit("joinPoll", id);
    socket.on("pollUpdated", (p) => setPoll(p));

    return () => {
      socket.off("pollUpdated");
      socket.emit("leavePoll", id);
    };
  }, [id]);

  if (!poll) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const totalVotes = poll.options.reduce((acc, o) => acc + (o.votes || 0), 0);

  return (
    <div className="w-full">
      <div className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Question header */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Question 1</h2>
        </div>

        {/* Question Card */}
        <div className="rounded-md border border-purple-400 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold px-5 py-3">
            {poll.question}
          </div>

          <div className="flex flex-col p-4 gap-3">
            {poll.options.map((opt, idx) => {
              const percentage =
                totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              return (
                <div
                  key={idx}
                  className="relative flex items-center gap-4 p-3 rounded-md border border-gray-200 bg-gray-100 overflow-hidden"
                >
                  {/* Progress bar background */}
                  <div
                    className="absolute top-0 left-0 h-full bg-purple-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>

                  {/* Option content */}
                  <div className="relative z-10 flex items-center gap-4 w-full">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold bg-purple-500 text-white">
                      {idx + 1}
                    </div>
                    <div className="flex-1">{opt.text}</div>
                    <div className="font-semibold">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Waiting message */}
        <p className="text-center font-semibold text-lg">
          Wait for the teacher to ask a new question..
        </p>

        {/* Chatbox bubble */}
        <div className="fixed bottom-6 right-6">
          <ChatBox pollId={id} />
        </div>
      </div>
    </div>
  );
}
