import React from "react";
import { LetterStatus } from "../machines/GameMachine";

type Props = {
  letter: string;
  status: LetterStatus;
  isRevealing?: boolean;
  revealDelay: number;
};

const Tile = (props: Props) => {
  const { letter, status, isRevealing, revealDelay } = props;
  let tileClass = getClassFromStatus(letter, status) + " tile";
  const animationDelay = isRevealing ? revealDelay : 0;
  // if (letter !== "") {
  //   tileClass += " cell-fill-animation";
  // }

  if (isRevealing) {
    tileClass += " cell-reveal";
  }
  return (
    <div
      className={tileClass}
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "36px",
        fontWeight: "600",
        animationDelay: animationDelay + "s",
        borderWidth: 2,
        borderStyle: "solid",
      }}
    >
      <div className="tile-letter" style={{ animationDelay: animationDelay + "s" }}>
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
