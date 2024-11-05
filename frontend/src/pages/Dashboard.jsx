import Calendar from "../components/Calendar";
import Questions from "../components/Questions";
import ProgressOverview from "../components/ProgressOverview";
import Welcome from "../components/Welcome";
import History from "../components/History";
import PeerPrep from "./PeerPrep";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/UserService";

const peerSessions = [
  {
    id: 1,
    date: "2024-09-21",
    peerName: "John Doe",
    topics: ["Arrays", "Sorting"],
    result: "Success",
  },
  {
    id: 2,
    date: "2024-09-21",
    peerName: "John Doe",
    topics: ["Arrays", "Sorting"],
    result: "Success",
  },
  {
    id: 3,
    date: "2024-09-21",
    peerName: "John Doe",
    topics: ["Arrays", "Sorting"],
    result: "Success",
  },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUser();
  }, []);

  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto rounded-3xl">
        <div className="flex space-x-5">
          <Welcome username={user?.firstName} />
          <ProgressOverview />
        </div>
        <div className="mt-5 flex space-x-5">
          <Questions isAdmin={false} />
          <History sessions={peerSessions} />
          <Calendar />
        </div>
      </main>
    </PeerPrep>
  );
}
