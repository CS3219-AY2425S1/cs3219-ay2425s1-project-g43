// src/utils/UserCursor.js
import * as monaco from "monaco-editor";

export function trackCursorPosition(editor, awareness, user) {
  editor.onDidChangeCursorPosition(() => {
    const position = editor.getPosition();
    if (position) {
      awareness.setLocalStateField("selection", {
        start: position,
        end: position,
        user,
      });
    }
  });
}

function addCursorStyles(clientId, color) {
  const styleId = `cursor-style-${clientId}`;
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = `
    .cursor-${clientId} {
      border-left: 2px solid ${color};
    }
    .remote-user-name-${clientId}::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: ${color};
      border-radius: 50%;
      margin-right: 4px;
    }
  `;
  document.head.appendChild(style);
}

export function updateRemoteCursors(editor, awareness) {
  const decorations = [];

  awareness.getStates().forEach((state, clientId) => {
    if (clientId === awareness.clientID) return;

    const { user, selection } = state;
    if (!user || !selection) return;

    const { start } = selection;
    const { name, color } = user;

    const cursorDecoration = {
      range: new monaco.Range(
        start.lineNumber,
        start.column,
        start.lineNumber,
        start.column,
      ),
      options: {
        className: `cursor-${clientId}`,
        inlineClassName: `cursor-${clientId}`,
      },
    };

    const nameDecoration = {
      range: new monaco.Range(
        start.lineNumber,
        start.column,
        start.lineNumber,
        start.column,
      ),
      options: {
        beforeContentClassName: `remote-user-name-${clientId}`,
        after: {
          content: ` ${name}`,
          color,
        },
      },
    };

    decorations.push(cursorDecoration, nameDecoration);
    addCursorStyles(clientId, color);
  });

  editor.deltaDecorations([], decorations);
}
