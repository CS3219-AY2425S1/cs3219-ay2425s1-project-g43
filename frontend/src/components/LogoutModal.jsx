import React from "react";

export default function LogoutModal({ isOpen, handleLogout, handleClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-lg transform rounded-2xl bg-black border border-gray-300/30 py-10 px-8 shadow-xl transition-all duration-300 ease-in-out">
        <h2 className="mb-4 text-center text-3xl font-medium text-white">
          Are you sure you want to log out?
        </h2>
        <p className="mb-6 text-center text-sm text-gray-300">
          You&apos;ll need to sign in again to access your account.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="rounded-lg bg-lime-300 px-6 py-2 font-semibold text-black transition-colors duration-200 hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-red-500 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
