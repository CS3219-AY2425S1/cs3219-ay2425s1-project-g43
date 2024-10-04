const Welcome = ({ userName, suggestedQuestion }) => {
  return (
    <div className="w-full max-w-md rounded-3xl bg-lime-300 p-6 text-gray-900">
      <h2 className="mb-2 text-2xl font-bold">
        Welcome {userName ? userName : "Back"}!
      </h2>
      <p className="text-lg text-gray-800">
        We are excited to see you again. Let’s get ready to continue your
        journey and achieve great things today.
      </p>

      {/* Suggested Question to Practice */}
      {suggestedQuestion && (
        <div className="mt-4 rounded-xl bg-[#191919] p-4 text-white">
          <h3 className="text-lg font-semibold text-lime-300">
            Suggested Practice Question:
          </h3>
          <p className="text-md">
            Question:{" "}
            <span className="font-bold">{suggestedQuestion.title}</span>
          </p>
          <p className="text-sm text-gray-400">
            Category: {suggestedQuestion.category}
          </p>
        </div>
      )}

      {/* Encouraging Message */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-800">
          Ready to tackle more challenges? Start practicing today!
        </p>
      </div>

      {/* Start Practice Button */}
      <div className="mt-4">
        <button className="rounded-full bg-[#191919] px-4 py-2 text-white transition duration-300 hover:bg-gray-800">
          Start a Peer Session
        </button>
      </div>
    </div>
  );
};

export default Welcome;
