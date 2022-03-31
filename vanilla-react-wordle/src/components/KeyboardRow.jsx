import React from "react";
import Key from "./Key";

const KeyboardRow = (props) => {
  const { keys, padSides, handleKeyPress } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        height: "58px",
        borderRadius: "4px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {padSides && <div style={{ flex: 0.38 }} />}
      {keys.map((key) => {
        let flex = 1;
        if (key === "ENTER" || key === "DEL") {
          flex = 1.5;
        }
        return (
          <button
            onClick={() => handleKeyPress(key)}
            key={key}
            style={{
              flex,
              border: "none",
              background: "#e3e3e3",
              padding: 0,
              fontSize: 16,
            }}
          >
            {key}
          </button>
        );
      })}
      {padSides && <div style={{ flex: 0.38 }} />}
    </div>
  );
};

export default KeyboardRow;
