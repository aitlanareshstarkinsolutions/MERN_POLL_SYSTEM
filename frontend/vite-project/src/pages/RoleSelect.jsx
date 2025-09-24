import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect({ setRole }) {
  const navigate = useNavigate();

  const choose = (r) => {
    setRole(r);
    navigate("/enter-name");
  };

  return (
    <div className="flex justify-center min-h-screen pt-10 bg-white">
      <div className="max-w-custom w-full px-4 flex flex-col items-center">
        <div className="mt-5 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple1 to-purple2 inline-block">
          Intervue Poll
        </div>

        <h1 className="text-4xl font-bold mt-6 text-center">
          Welcome to the <span className="font-extrabold">Live Polling System</span>
        </h1>
        <p className="text-muted mt-2 text-center mb-8">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className="flex gap-6 justify-center w-full mb-8">
          <div
            className="flex-1 min-w-[260px] p-6 rounded-xl border-2 border-purple-200 shadow-md cursor-pointer hover:shadow-lg transition-all"
            onClick={() => choose("student")}
          >
            <h3 className="text-xl font-semibold mb-2">I'm a Student</h3>
            <p className="text-muted text-sm">
              Submit answers and participate in live polls
            </p>
          </div>

          <div
            className="flex-1 min-w-[260px] p-6 rounded-xl border-2 border-purple-200 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => choose("teacher")}
          >
            <h3 className="text-xl font-semibold mb-2">I'm a Teacher</h3>
            <p className="text-muted text-sm">
              Create polls and view real-time results
            </p>
          </div>
        </div>

        <button
          className="mt-6 px-10 py-4 text-lg text-white rounded-full bg-gradient-to-r from-purple1 to-purple2 hover:opacity-90 transition"
          onClick={() => choose("student")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
