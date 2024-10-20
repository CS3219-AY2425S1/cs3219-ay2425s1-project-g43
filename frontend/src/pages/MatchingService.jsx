import React, { useState } from "react";
import TopicSelect from "../components/TopicSelect";
import LevelSelect from "../components/LevelSelect";
import WaitTimeSelect from "../components/WaitTimeSelect";
import PeerPrep from "./PeerPrep";
import { useNavigate } from "react-router-dom";

export default function MatchingService() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedWaitTime, setSelectedWaitTime] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const topics = [
    "Data Structures",
    "Array",
    "Hash Table",
    "String",
    "Sorting",
    "Depth-First Search",
    "Breadth-First Search",
    "Bit Manipulation",
    "Tree",
    "Database",
    "Matrix",
    "Simulation",
    "Enumeration",
    "Backtracking",
    "Prefix Sum",
    "Sliding Window",
    "Linked List",
    "Binary Search",
  ];

  const levels = ["Easy", "Medium", "Hard"];
  const waitTimes = ["30s", "1min", "2mins", "5mins"];

  const handleStartMatching = () => {
    if (selectedTopics.length === 0) {
      setError("Please select at least one topic.");
      return;
    }
    if (!selectedLevel) {
      setError("Please select a difficulty level.");
      return;
    }
    if (!selectedWaitTime) {
      setError("Please select a wait time.");
      return;
    }

    setError("");

    const waitTimeInSeconds = convertWaitTimeToSeconds(selectedWaitTime);

    navigate("/finding-a-peer", {
      state: {
        selectedTopics,
        selectedLevel,
        waitTimeInSeconds,
      },
    });
  };

  const convertWaitTimeToSeconds = (waitTime) => {
    switch (waitTime) {
      case "30s":
        return 30;
      case "1min":
        return 60;
      case "2mins":
        return 120;
      case "5mins":
        return 300;
      default:
        return 600;
    }
  };

  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto">
        <div className="flex gap-x-4">
          <div className="w-1/2 rounded-lg border border-[#333333] bg-[#111111] p-6">
            <TopicSelect
              topics={topics}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
            />
          </div>
          <div className="w-1/2 flex-1 rounded-lg border border-[#333333] bg-[#111111] p-6">
            <LevelSelect
              levels={levels}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
            />
            <WaitTimeSelect
              waitTimes={waitTimes}
              selectedWaitTime={selectedWaitTime}
              setSelectedWaitTime={setSelectedWaitTime}
            />
          </div>
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        <button
          onClick={handleStartMatching}
          className="float-right mt-3 rounded-full bg-[#bcfe4d] px-6 py-2 font-bold text-black transition-colors hover:bg-[#a6e636]"
        >
          START MATCHING
        </button>
      </main>
    </PeerPrep>
  );
}
