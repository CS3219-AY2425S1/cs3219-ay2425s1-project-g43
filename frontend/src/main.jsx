import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./globals.css";
import ErrorPage from "./error-page.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";
import Help from "./pages/Help.jsx";
import FindingPeer from "./pages/FindingPeer.jsx";
import MatchingService from "./pages/matchingService.jsx";
import Room from "./pages/Room.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/matching-service",
    element: <MatchingService />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: <Settings />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/help",
    element: <Help />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/finding-a-peer",
    element: <FindingPeer />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/room/{id}",
    element: <Room />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
