import React from "react";

export default function LevelSelector({ levels, selectedLevel, setSelectedLevel }) {
  const toggleLevel = (level) => {
    if (selectedLevel === level) {
      setSelectedLevel(null); 
    } else {
      setSelectedLevel(level);
    }
  };

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-4">LEVEL</div>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            className={`px-4 py-1 rounded-full text-sm text-black transition-colors ${
              selectedLevel === level ? "bg-[#bcfe4d]" : "bg-[#DDDDDD] hover:bg-[#bcfe4d]"
            }`}
            onClick={() => toggleLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
