import React from "react";
import KeyboardRow from "./KeyboardRow";

const rowKeyStrings = [
  "Q W E R T Y U I O P",
  "A S D F G H J K L",
  "ENTER Z X C V B N M DEL",
];

// turn the key display string into a real key code
const getKeyCodeFromKey = (key) => {
  if (key === "DEL") {
    return "Delete";
  }

  if (key === "ENTER") {
    return "Enter";
  }

  return key;
};

const Keyboard = (props) => {
  const { handleKeyPress } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      {rowKeyStrings.map((rowKeys, index) => {
        return (
          <KeyboardRow
            keys={rowKeys.split(" ")}
            padSides={index === 1}
            handleKeyPress={(key) => handleKeyPress(getKeyCodeFromKey(key))}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default Keyboard;
