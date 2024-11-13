import React from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function Output({ output, className = "" }) {
  const getStatusIcon = () => {
    switch (output.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <Loader className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  const getOutputClasses = () => {
    switch (output.type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "running":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className={`rounded-lg border border-gray-700/30 bg-gray-900/50 p-4`}>
      <div className="mb-2 flex items-center gap-2">
        {getStatusIcon()}
        <span className={`font-medium ${getOutputClasses()}`}>
          {output.type.charAt(0).toUpperCase() + output.type.slice(1)}
        </span>
      </div>
      <pre
        className={`${className} whitespace-pre-wrap font-mono text-sm text-gray-300 h-[9rem]`}
      >
        {output.content}
      </pre>
    </div>
  );
}
