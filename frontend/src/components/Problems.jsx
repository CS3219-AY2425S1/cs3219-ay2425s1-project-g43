import React from "react";

export default function Problems({ problem }) {
  if (!problem) {
    console.log("Question not found");
    return <p>Loading problem...</p>;
  }

  return (
    <div className="flex h-[87vh] flex-col space-y-4 rounded-lg border border-gray-300/30 p-6">
      <div className="text-md mb-2 font-bold text-[#bcfe4d]">PROBLEM</div>

      {/* Header Section with Title and Complexity Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{problem.title}</h2>
        <span
          className={`rounded-full px-4 py-1 text-sm text-black ${
            problem.complexity === "Easy"
              ? "bg-green-400"
              : problem.complexity === "Medium"
                ? "bg-yellow-400"
                : "bg-red-400"
          }`}
        >
          {problem.complexity}
        </span>
      </div>
      <div className="h-[1px] bg-white/30"></div>

      {/* Scrollable Description Section */}
      <div
        className="flex-1 overflow-y-auto rounded-lg bg-[#1e1e1e]/40 px-3 py-2 text-sm font-light text-white"
        style={{ whiteSpace: "pre-line" }}
      >
        {problem.description}
      </div>
    </div>
  );
}
