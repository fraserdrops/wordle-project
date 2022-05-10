import React from "react";
import { LetterStatus } from "../features/guesses/guessSlice";

type Props = {
  letter: string;
  status: LetterStatus;
  isRevealing?: boolean;
  revealDelay: number;
};

const Tile = (props: Props) => {
  const { letter, status, isRevealing, revealDelay } = props;
  let tileClass = getClassFromStatus(letter, status) + " tile";
  isRevealing && console.log(tileClass, status);
  return (
    <div
      className={isRevealing ? "tile cell-reveal " + tileClass : tileClass}
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "36px",
        fontWeight: "600",
        animationDelay: revealDelay + "s",
        borderWidth: 2,
        borderStyle: "solid",
      }}
    >
      <div className="tile-letter" style={{ animationDelay: revealDelay + "s" }}>
        {letter}{" "}
      </div>
    </div>
  );
};

function getClassFromStatus(letter: string, status: LetterStatus) {
  if (!letter.length) {
    return "empty";
  }
  const map = {
    absent: "absent",
    correct: "correct",
    present: "present",
    unknown: "unknown",
  };
  return map[status];
}

export default Tile;
