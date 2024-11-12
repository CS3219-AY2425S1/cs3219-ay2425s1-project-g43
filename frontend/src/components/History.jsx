import { useNavigate } from "react-router-dom";

const History = ({ sessions }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-lime-300 to-lime-500 p-6 text-black">
      <h2 className="mb-1 text-xl font-bold text-black">Peer Sessions</h2>
      <p className="text-md mb-4 font-medium text-gray-800">
        Your recent peer learning sessions
      </p>
      <div className="h-[16rem] space-y-2 overflow-y-auto">
        {sessions.length > 0 ? (
          sessions.map((session) => {
            return (
              <div
                key={session._id}
                className="flex items-start justify-between rounded-xl bg-black p-4"
                onClick={() => {
                  navigate("/history/" + session._id);
                }}
              >
                <div>
                  <p className="text-sm text-gray-400">
                    Date: {new Date(session.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Question: {session.question.title}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-lg font-medium text-gray-900">
            No past sessions available.
          </p>
        )}
      </div>
    </div>
  );
};

export default History;
