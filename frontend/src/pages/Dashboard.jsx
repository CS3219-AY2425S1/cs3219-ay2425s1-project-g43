import React from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Questions from "../components/Questions";
import ProgressOverview from "../components/ProgressOverview";
import Welcome from "../components/Welcome";
import History from "../components/History";
import MonthlyProgress from "../components/MonthlyProgress";
import { ToastContainer } from "react-toastify";

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
    date: "2024-09-18",
    peerName: "Jane Smith",
    topics: ["Dynamic Programming", "Recursion"],
    result: "Failed",
  },
  {
    id: 3,
    date: "2024-09-18",
    peerName: "Sarah James",
    topics: ["Dynamic Programming", "Recursion"],
    result: "Success",
  },
  {
    id: 4,
    date: "2024-09-18",
    peerName: "Robert Wu",
    topics: ["Dynamic Programming", "Recursion"],
    result: "Success",
  },
];

const suggestedQuestion = {
  title: "Binary Search Tree Insertion",
  category: "Data Structures",
};

export default function Dashboard() {
  return (
    <div className="max-h-screen">
      <ToastContainer />
      <div className="overflow-hidden">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4">
            <div className="flex space-x-2">
              <Welcome userName="Alex" suggestedQuestion={suggestedQuestion} />
              <Questions />

              <Calendar />
            </div>
            <div className="mt-2 flex space-x-2">
              <MonthlyProgress
                monthlyPracticeData={[
                  5, 12, 8, 14, 10, 9, 7, 11, 15, 9, 13, 10,
                ]}
                startMonth={2}
              />
              <ProgressOverview dataPoints={[10, 20, 15, 30, 40, 35, 50]} />
              <History sessions={peerSessions} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
