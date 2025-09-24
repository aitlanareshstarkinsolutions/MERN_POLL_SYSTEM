import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import socket from "../socket";

export default function TeacherCreate({ name, socket: sock }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { text: "Option 1", isCorrect: false },
    { text: "Option 2", isCorrect: false },
  ]);

  const updateOption = (i, text) => {
    const next = [...options];
    next[i].text = text;
    setOptions(next);
  };

  const addOption = () =>
    setOptions([
      ...options,
      { text: `Option ${options.length + 1}`, isCorrect: false },
    ]);

  const toggleCorrect = (i) => {
    const next = options?.map((o, idx) => ({
      ...o,
      isCorrect: idx === i ? !o.isCorrect : o.isCorrect,
    }));
    setOptions(next);
  };

  const createPoll = async () => {
    if (!question) return alert("Enter question");
    if (options.length < 2) return alert("Add 2+ options");
    const payload = {
      question,
      options,
      createdBy: name || "Teacher",
      durationSeconds: duration,
    };
    socket.emit("createPoll", payload);
    try {
      const res = await API.post("/polls", payload);
      navigate(`/teacher/view/${res.data._id}`);
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <span className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-full">
          ✦ Intervue Poll
        </span>
        <h1 className="mt-4 text-3xl font-bold">
          Let’s <span className="font-extrabold">Get Started</span>
        </h1>
        <p className="mt-2 text-gray-500 text-lg max-w-xl">
          You’ll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>
      </div>

      {/* Question + Duration */}
      <div className="flex flex-col gap-4 max-w-3xl">
        {/* Labels Row */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Enter your question</label>
          <div className="w-48 relative">
            <select
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={120}>120 seconds</option>
            </select>

            {/* Custom arrow */}
            <svg
              className="w-5 h-5 text-purple-600 absolute right-3 top-3 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12l-4-4h8l-4 4z" />
            </svg>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type your question..."
        />

        {/* Character counter */}
        <div className="text-sm text-gray-400">{question.length}/100</div>
      </div>

      {/* Options */}
      <div className="mt-10 max-w-3xl ">
        <h3 className="text-xl font-semibold">Edit Options</h3>
        {options?.map((o, i) => (
          <div
            key={i}
            className="flex items-center gap-4 mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold">
              {i + 1}
            </div>
            <input
              value={o.text}
              onChange={(e) => updateOption(i, e.target.value)}
              className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-gray-700">
                <input
                  type="radio"
                  checked={o.isCorrect}
                  onChange={() => toggleCorrect(i)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                Yes
              </label>
              <label className="flex items-center gap-1 text-gray-700">
                <input
                  type="radio"
                  checked={!o.isCorrect}
                  onChange={() => toggleCorrect(i)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                No
              </label>
            </div>
          </div>
        ))}
        <button
          className="mt-4 text-purple-600 font-medium  border-2 border-purple-600 px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={addOption}
        >
          + Add More option
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 border-t border-gray-300 pt-4 flex justify-end">
        <button
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90"
          onClick={createPoll}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}
