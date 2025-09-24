import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EnterName({ role, setName }) {
  const [val, setVal] = useState("");
  const navigate = useNavigate();

  const goNext = () => {
    if (!val) return alert("Enter your name");
    setName(val);

    if (role === "teacher") navigate("/teacher/create");
    else navigate("/student/wait");
  };

  return (
    <div className="flex justify-center min-h-screen pt-10 bg-white">
      <div className="max-w-custom w-full px-4 flex flex-col items-center">
        {/* Header */}
        <div className="mt-5 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple1 to-purple2 inline-block">
          Intervue Poll
        </div>
        <h1 className="text-4xl font-bold mt-6 text-center">
          Let's <strong>Get Started</strong>
        </h1>
        <p className="text-muted mt-2 text-center mb-8">
          If you're a student, you'll be able to submit answers and see how they compare with classmates.
        </p>

        {/* Input Box */}
        <div className="w-3/5 min-w-[320px] flex flex-col gap-2">
          <label className="text-dark font-medium">Enter your Name</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-light text-base focus:outline-none focus:ring-2 focus:ring-purple1"
            placeholder="Your name"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          <div className="flex justify-center mt-6">
            <button
              className="px-10 py-4 text-lg text-white rounded-full bg-gradient-to-r from-purple1 to-purple2 hover:opacity-90 transition"
              onClick={goNext}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
