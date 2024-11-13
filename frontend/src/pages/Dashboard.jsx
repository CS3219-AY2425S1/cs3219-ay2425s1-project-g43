import Calendar from "../components/Calendar";
import Questions from "../components/Questions";
import ProgressOverview from "../components/ProgressOverview";
import Welcome from "../components/Welcome";
import History from "../components/History";
import PeerPrep from "./PeerPrep";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/UserService";
import { fetchUserHistory } from "../services/UserHistory";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    const getUserHistory = async () => {
      try {
        const sessions = await fetchUserHistory();
        setSessions(sessions);
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
    getUserHistory();
  }, []);

  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto rounded-3xl">
        <div className="flex space-x-5">
          <Welcome username={user?.firstName} />
          <ProgressOverview />
        </div>
        <div className="mt-5 flex space-x-5">
          <Questions isAdmin={user?.isAdmin} />
          <History sessions={sessions} />
          <Calendar />
        </div>
      </main>
    </PeerPrep>
  );
}
