import React from "react";
import * as monaco from "monaco-editor";
import { themeOptions } from "../configs/monaco";

function ThemeSelector({ onThemeChange }) {
  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    monaco.editor.setTheme(selectedTheme);
    if (onThemeChange) onThemeChange(selectedTheme);
  };
  return (
    <select
      onChange={handleThemeChange}
      defaultValue="monokai"
      className="rounded-full border border-gray-300/30 bg-black px-2 py-2 text-center font-sans text-sm text-white focus:outline-none"
    >
      {themeOptions.map((theme) => (
        <option key={theme.value} value={theme.value}>
          {theme.label}
        </option>
      ))}
    </select>
  );
}

export default ThemeSelector;
