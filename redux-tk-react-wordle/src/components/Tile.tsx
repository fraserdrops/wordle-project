import React from "react";
import { LetterStatus } from "../features/guesses/guessSlice";

type Props = {
  letter: string;
  status: LetterStatus;
  isRevealing?: boolean;
};

const Tile = (props: Props) => {
  const { letter, status, isRevealing } = props;
  let { color, backgroundColor } = getStylesFromStatus(status);
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        border: "2px solid #d3d6da",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "36px",
        fontWeight: "600",
        // derive these from the letter status
        color,
        backgroundColor,
      }}
    >
      {letter}
    </div>
  );
};

function getStylesFromStatus(status: LetterStatus) {
  let backgroundColor = "white";
  let color = "black";
  switch (status) {
    case "absent": {
      backgroundColor = "grey";
      color = "white";
      break;
    }
    case "correct": {
      backgroundColor = "green";
      color = "white";
      break;
    }
    case "present": {
      backgroundColor = "yellow";
      color = "white";
      break;
    }
  }
  return { color, backgroundColor };
}

export default Tile;
