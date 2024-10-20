import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import MatchingServicePage from "./pages/MatchingService";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import ErrorPage from "./pages/ErrorPage"; // Assuming ErrorPage exists

export default function App() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}
