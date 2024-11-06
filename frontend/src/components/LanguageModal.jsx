import React from "react";

export function Modal({ isOpen, onClose, onConfirm, newLanguage }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[425px] max-w-[90vw] rounded-lg border border-gray-700 bg-[#1e1e1e]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-200">
            Change Language
          </h2>
          <div className="mb-6 font-extralight">
            <p className="text-gray-400">
              Changing language will apply a new template. All your current
              changes will be lost.
            </p>
            <p className="mt-2 text-gray-400">Do you want to continue?</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-600 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-[#bcfe4d] px-4 py-2 text-black transition-colors hover:bg-[#a8eb38]"
            >
              Change to{" "}
              {newLanguage.charAt(0).toUpperCase() + newLanguage.slice(1)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
