import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { fetchCurrentUser } from "../services/UserService";

const PeerPrep = ({ children }) => {
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

  const fullname = user?.firstName + " " + user?.lastName

  return (
    <div>
      <div className="max-h-screen">
        <ToastContainer />
        <div className="flex h-screen flex-col overflow-hidden">
          <header className="sticky top-0 z-10 w-full">
            <Header name={fullname} username={user?.username} />
          </header>
          <div className="flex flex-1 overflow-hidden">
            <aside className="sticky top-0 z-50 h-full">
              <Sidebar />
            </aside>

            <main className="flex-1 overflow-auto rounded-3xl px-6 py-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerPrep;
