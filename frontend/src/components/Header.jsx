import { Search, Moon, BellDot } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between border border-x-0 border-b border-t-0 border-gray-300/20 px-6 py-4">
      <div className="flex flex-row space-x-6">
        <img
          src="/images/8bit-star-1.png"
          alt="PeerPrep logo"
          className="h-10 w-10"
        />
        <h1 className="text-center text-3xl font-semibold text-white">
          PeerPrep
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-white" />
          <input
            type="text"
            placeholder="Type to Search..."
            className="rounded-full border border-gray-300/30 bg-transparent py-2 pl-10 pr-4 font-light text-white outline-none focus:outline-none"
          />
        </div>
        <button className="rounded-full border border-gray-300/30 p-2 hover:bg-white hover:text-black">
          <Moon />
        </button>
        <button className="rounded-full border border-gray-300/30 p-2 hover:bg-white hover:text-black">
          <BellDot />
        </button>
        <button className="flex flex-row items-center rounded-full border border-dashed border-gray-300 p-1">
          <img
            src="https://avatar.iran.liara.run/public/boy?username=[Alex]"
            alt="PeerPrep logo"
            className="h-9 w-9 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
