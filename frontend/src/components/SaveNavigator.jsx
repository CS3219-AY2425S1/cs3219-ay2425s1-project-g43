import React, { useState } from "react";

function SaveNavigator({ maxSave, setCurrentSave, currentSave }) {

  const goLeft = () => {
    if (currentSave > 1) setCurrentSave((prev) => prev - 1);
  };

  const goRight = () => {
    if (currentSave < maxSave) setCurrentSave((prev) => prev + 1);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={goLeft}
        disabled={currentSave === 1}
        className={`${
          currentSave === 1
            ? "pointer-events-none opacity-0"
            : "hover:bg-[#bcfe4d]"
        } flex h-10 w-10 transform items-center justify-center rounded-full bg-[#bcfe4d] font-bold text-black shadow-md transition duration-100 ease-in-out hover:scale-105`}
      >
        &lt;
      </button>
      <span className="mx-6 text-lg font-semibold">Save {currentSave}</span>
      <button
        onClick={goRight}
        disabled={currentSave === maxSave}
        className={`${
          currentSave === maxSave
            ? "pointer-events-none opacity-0"
            : "hover:bg-[#bcfe4d]"
        } flex h-10 w-10 transform items-center justify-center rounded-full bg-[#bcfe4d] font-bold text-black shadow-md transition duration-100 ease-in-out hover:scale-105`}
      >
        &gt;
      </button>
    </div>
  );
}

export default SaveNavigator;
