import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import socket from "../socket";
import ChatBox from "../components/ChatBox";

export default function StudentQuestion({ name }) {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data);
      setTimeLeft(res.data.durationSeconds);
    };
    fetch();

    socket.emit("joinPoll", id);
    socket.on("pollUpdated", (p) => setPoll(p));
    socket.on("pollClosed", (p) => setPoll(p));

    return () => {
      socket.off("pollUpdated");
      socket.emit("leavePoll", id);
    };
  }, [id]);

  useEffect(() => {
    if (!timeLeft || submitted || !poll?.active) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          socket.emit("closePoll", id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, poll, id]);

  const submit = () => {
  if (selected === null) return alert("Select option");
  socket.emit("submitAnswer", { pollId: id, optionIndex: selected });
  setSubmitted(true);
  
  // redirect to results page
  setTimeout(() => {
    window.location.href = `/student/result/${id}`;
  }, 500); // small delay
};


  if (!poll) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const isClosed = !poll.active || timeLeft === 0;

  return (
    <div className="w-full">
      <div className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Question header */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Question 1</h2>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱</span>
            <span className="font-semibold text-red-500">
              {String(timeLeft).padStart(2, "0")}s
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-md border border-gray-300 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold px-5 py-3">
            {poll.question}
          </div>

          <div className="flex flex-col p-4 gap-3">
            {poll.options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => !isClosed && setSelected(idx)}
                className={`flex items-center gap-4 p-3 rounded-md border cursor-pointer transition ${
                  selected === idx
                    ? "border-purple-500 bg-white"
                    : "border-gray-200 bg-gray-100"
                }`}
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                    selected === idx
                      ? "bg-purple-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">{opt.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            className={`px-6 py-3 text-lg rounded-full text-white font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition ${
              submitted || isClosed ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={submit}
            disabled={submitted || isClosed}
          >
            {submitted ? "Submitted" : isClosed ? "Time Up" : "Submit"}
          </button>
        </div>

        {/* Chatbox (bottom-right bubble) */}
        <div className="fixed bottom-6 right-6">
          <ChatBox pollId={id} />
        </div>
      </div>
    </div>
  );
}
