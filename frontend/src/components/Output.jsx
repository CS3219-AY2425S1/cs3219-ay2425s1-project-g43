const Output = ({ output }) => {
  const getOutputStyle = () => {
    switch (output.type) {
      case "error":
        return "text-red-500 font-medium";
      case "success":
        return "text-green-500";
      case "running":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase text-gray-400">
          Output
        </h3>
        <div className="h-px flex-1 bg-gray-800"></div>
      </div>
      <pre
        className={`max-h-[200px] h-[20rem] w-full overflow-y-auto rounded-lg bg-slate-800/30 p-4 font-mono text-sm ${getOutputStyle()}`}
        style={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        {output.content}
      </pre>
    </div>
  );
};

export default Output;
