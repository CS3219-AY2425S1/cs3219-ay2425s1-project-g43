import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = ({ username }) => {
  const navigate = useNavigate();

  const goToMatchingService = () => {
    navigate("/matching-service");
  };

  return (
    <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-lime-100 to-lime-500 p-8 text-black shadow-lg">
      <h2 className="mb-4 text-5xl font-extrabold">
        Welcome {username ? username : "Back"}!
      </h2>
      <p className="text-xl font-medium text-gray-900">
        We are excited to see you again. Let’s get ready to continue your
        journey and achieve great things today.
      </p>

      <div className="mt-20">
        <p className="text-md font-semibold text-lime-900">
          Ready to tackle more challenges?{" "}
          <span className="text-black">Start practicing today!</span>
        </p>
      </div>

      {/* Start Practice Button */}
      <div className="mt-8">
        <button
          onClick={goToMatchingService}
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-lg font-bold text-lime-400 transition duration-300 hover:bg-white hover:text-black"
        >
          Start a Peer Session
          <span className="ml-2 text-xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default Welcome;

