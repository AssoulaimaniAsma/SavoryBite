import React from "react";

export default function AlertBox({ title, message, onClose, onConfirm, confirmMode = false, loading = false }) {
  return (
    <div className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
      <div className="flex items-center">
        <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">{message}</div>

      <div className="flex space-x-2">
        {confirmMode ? (
          <>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5"
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-800 bg-transparent border border-gray-800 hover:bg-gray-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="text-green-800 border border-green-800 hover:bg-green-900 hover:text-white font-medium rounded-lg text-xs px-3 py-1.5"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
