const PISTON_API_URL = "https://emkc.org/api/v2/piston";

export const executePistonCode = async (language, code) => {
  try {
    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*",
        files: [{ name: "main", content: code }],
      }),
    });

    if (!response.ok) throw new Error("Execution failed");

    const result = await response.json();
    if (result.compile?.stderr)
      return {
        success: false,
        error: result.compile.stderr,
        errorType: "compilation",
      };
    if (result.run?.stderr)
      return { success: false, error: result.run.stderr, errorType: "runtime" };

    return {
      success: true,
      output:
        result.run.output || "Program executed successfully with no output",
    };
  } catch (error) {
    return { success: false, error: error.message, errorType: "system" };
  }
};
