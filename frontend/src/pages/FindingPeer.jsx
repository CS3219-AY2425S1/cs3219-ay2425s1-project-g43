import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import matchingService from "../services/MatchingService";

const FindingPeer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedTopics, selectedLevel, waitTimeInSeconds } =
    location.state || {};

  const [time, setTime] = useState(waitTimeInSeconds || 120);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      toast.info("No match found, redirecting to matching service...");
      toast.info("Please try again later...");

      // Wait for 3 seconds before navigating
      // Delay the navigation to ensure toast is visible
      setTimeout(() => {
        navigate("/matching-service");
      }, 3000);  // Wait for 3 seconds before navigating
    }

    return () => clearInterval(interval);
  }, [isActive, time, navigate]);

  const handleEndSession = () => {
    setIsActive(false);
    matchingService.disconnect();
    navigate("/matching-service");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const complexity = selectedLevel;
    const waitTime = time;

    matchingService
      .connect(token, selectedTopics.join(","), complexity, waitTime)
      .then(() => {
        toast.success("Connected to matching service");

        // When match is Found, call the onMatchFound event
        matchingService.onMatchFound((roomId) => {
          console.log("Match found, redirecting to room:", roomId);
          clearInterval();
          toast.success("Match found! Redirecting to the collaboration room...");
          
          // Delay the navigation to ensure toast is visible
          setTimeout(() => {
            navigate(`/room/${roomId}`);
          }, 3000);  // Wait for 3 seconds before navigating
        });
        
        //  When an error message is received, call the onError event
        matchingService.onError((err) => {
          toast.error(`Error: ${err.message}`);
        });
        
        // When the socket is disconnected, call the onDisconnect event
        matchingService.onDisconnect((reason) => {
          if (time > 0) {
            toast.warn(`Disconnected: ${reason}`);
          }
        });
      })
      .catch((err) => {
        toast.error(`Connection failed: ${err.message} Could not connect to matching service`);
      });
      
    return () => {
      matchingService.disconnect();
    };
  }, [selectedTopics, selectedLevel, navigate]);

  return (
    <div className="flex min-h-screen bg-black">
      <ToastContainer />
      <div className="m-6 flex h-[calc(100vh-3rem)] w-full flex-col items-center justify-center rounded-3xl border border-gray-300/30">
        <h1 className="mb-5 text-xl font-bold text-lime-400">
          Searching for a peer...
        </h1>
        <div className="mb-6 text-8xl font-bold text-white">
          {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
        </div>
        <div className="mb-4 flex space-x-1 text-sm text-gray-300">
          <h1 className="font-bold text-lime-400">Topics:</h1>
          <p>{selectedTopics?.join(", ")}</p>
        </div>
        <div className="mb-4 flex space-x-1 text-sm text-gray-300">
          <h1 className="font-bold text-lime-400">Level:</h1>
          <p>{selectedLevel}</p>
        </div>

        <button
          onClick={handleEndSession}
          className="rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600"
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default FindingPeer;
