import React from "react";

export default function TopicSelector({ topics, selectedTopics, setSelectedTopics }) {
  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <div>
      <div className="text-L font-bold text-[#bcfe4d] mb-4">TOPIC</div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            className={`px-4 py-1 rounded-full text-sm text-black transition-colors ${
              selectedTopics.includes(topic) ? 'bg-[#bcfe4d]' : 'bg-[#DDDDDD] hover:bg-[#bcfe4d]'
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
