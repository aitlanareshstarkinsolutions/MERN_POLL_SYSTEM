import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PollHistory() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await API.get("/polls");
        setPolls(res.data);
      } catch (err) {
        console.error("Failed to fetch poll history", err);
      }
    };
    fetchPolls();
  }, []);

  return (
    <div className=" w-full flex flex-col items-center py-10 px-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            View <span className="text-purple-600">Poll History</span>
          </h1>
          <p className="text-gray-500">Past polls and results</p>
        </div>
        <button
          className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          onClick={() => navigate("/teacher/create")}
        >
          + New Poll
        </button>
      </div>

      {/* Poll list */}
      <div className="w-full max-w-3xl space-y-6">
        {polls.length === 0 ? (
          <p className="text-gray-500">No polls found.</p>
        ) : (
          polls?.map((p) => {
            const totalVotes =
              p?.options?.reduce((sum, o) => sum + (o.votes || 0), 0) || 1;

            return (
              <div
                key={p._id}
                className="bg-white shadow-md rounded-2xl overflow-hidden"
              >
                {/* Question */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white px-6 py-4 text-lg font-semibold">
                  {p.question}
                </div>

                {/* Options */}
                <div className="p-6 space-y-3">
                  {p?.options?.map((o, idx) => {
                    const pct = Math.round(((o.votes || 0) / totalVotes) * 100);
                    return (
                      <div
                        key={idx}
                        className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                      >
                        {/* Progress bar */}
                        <div
                          className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />

                        {/* Row */}
                        <div className="relative flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 text-sm font-bold text-gray-700 bg-white rounded-full border border-gray-300">
                              {idx + 1}
                            </span>
                            <span className="text-gray-800 font-medium">
                              {o.text}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-800">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View details button */}
                <div className="px-6 py-3 bg-gray-50 border-t text-right">
                  <Link
                    to={`/results/${p._id}`}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
