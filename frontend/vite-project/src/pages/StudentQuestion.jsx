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
    // Fetch poll data
    const fetch = async () => {
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data);
      setTimeLeft(res.data.durationSeconds);
    };
    fetch();

    // Join socket room
    socket.emit("joinPoll", id);

    // Socket listeners
    socket.on("pollUpdated", (p) => setPoll(p));
    socket.on("pollClosed", (p) => setPoll(p));

    return () => {
      socket.off("pollUpdated");
      socket.emit("leavePoll", id);
    };
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!timeLeft || submitted || !poll?.active) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          socket.emit("closePoll", id); // auto close poll
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
  };

  if (!poll) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const isClosed = !poll.active || timeLeft === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        Question 1
        <span className={`ml-2 ${timeLeft <= 5 ? "text-red-500" : "text-purple1"}`}>
          ⏱ {timeLeft}s
        </span>
      </h2>

      <div className="bg-white rounded-xl border border-purple-200 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple1 to-purple2 text-white font-semibold px-6 py-3">
          {poll.question}
        </div>

        <div className="flex flex-col p-4 gap-3">
          {poll.options.map((opt, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border ${
                selected === idx ? "border-purple1" : "border-gray-200"
              } hover:shadow-md transition`}
              onClick={() => !isClosed && setSelected(idx)}
            >
              <div className="min-w-[38px] h-10 flex items-center justify-center rounded-full bg-purple1 text-white font-bold">
                {idx + 1}
              </div>
              <div className="flex-1">{opt.text}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`px-10 py-3 text-lg rounded-full text-white bg-gradient-to-r from-purple1 to-purple2 hover:opacity-90 transition ${
          submitted || isClosed ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={submit}
        disabled={submitted || isClosed}
      >
        {submitted ? "Submitted" : isClosed ? "Time Up" : "Submit"}
      </button>

      <ChatBox pollId={id} />
    </div>
  );
}
