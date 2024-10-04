const History = ({ sessions }) => {
  return (
    <div className="w-full max-w-xl rounded-3xl border border-gray-300/30 bg-[#191919] p-6 text-white">
      <h2 className="mb-4 text-lg font-semibold">Practice History</h2>
      <div className="h-[16rem] space-y-2 overflow-y-auto">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start justify-between rounded-lg bg-[#222222] p-4"
            >
              <div>
                <h3 className="text-md font-medium">
                  Peer: {session.peerName}
                </h3>
                <p className="text-sm text-gray-400">
                  Date: {new Date(session.date).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-400">
                  Topics: {session.topics.join(", ")}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  session.result === "Success"
                    ? "bg-lime-300 text-gray-900"
                    : "bg-red-500 text-white"
                }`}
              >
                {session.result}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No past sessions available.</p>
        )}
      </div>
    </div>
  );
};

export default History;
