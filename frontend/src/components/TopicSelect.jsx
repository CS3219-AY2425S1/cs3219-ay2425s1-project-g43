import React from "react";

export default function TopicSelector({ topic, selectedTopic, setSelectedTopic }) {
  const toggleTopic = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topic);
    }
  };

  return (
    <div>
      <div className="text-L font-bold text-[#bcfe4d] mb-4">TOPIC</div>
      <div className="flex flex-wrap gap-2">
        {topic.map((topic) => (
          <button
            key={topic}
            className={`px-4 py-1 rounded-full text-sm text-black transition-colors ${
              selectedTopic === topic ? 'bg-[#bcfe4d]' : 'bg-[#DDDDDD] hover:bg-[#bcfe4d]'
            }`}	
            onClick={() => toggleTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
