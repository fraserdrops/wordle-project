import React from "react";
import { useAppSelector } from "../app/hooks";
import { selectLetterStatuses } from "../features/game/gameSlice";

type Props = {
  handleKeyPress: (key: string) => Promise<void>;
  keys: Array<string>;
  padSides: boolean;
};

export default function KeyboardRow(props: Props) {
  const { keys, padSides, handleKeyPress } = props;
  const letterStatuses = useAppSelector(selectLetterStatuses);
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

        // these keys are at the end and need to be larger
        if (key === "ENTER" || key === "DEL") {
          flex = 1.5;
        }

        const statusClass = letterStatuses[key] || "unknown";
        return (
          <button
            onClick={() => handleKeyPress(key)}
            className={statusClass + " key"}
            key={key}
            style={{
              flex,
              border: "none",
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
}
