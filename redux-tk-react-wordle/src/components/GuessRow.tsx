import React from "react";
import {
  getLetterStatusFromGuess,
  InvalidGuessInfo,
  LetterStatus,
  REVEAL_ANIMATION_TIME_PER_TILE,
} from "../features/guesses/guessSlice";
import Tile from "./Tile";

type Props = {
  guessLength: number;
  guess?: Array<string>;
  targetWord: string;
  isCurrentGuess: boolean;
  revealGuessResult: boolean;
  invalidGuess: undefined | InvalidGuessInfo;
};

const GuessRow = (props: Props) => {
  const { guessLength, invalidGuess, guess, targetWord, isCurrentGuess, revealGuessResult } = props;
  let letters = [];
  if (guess) {
    letters = guess;
  } else {
    for (let i = 0; i < guessLength; i++) {
      letters.push("");
    }
  }

  return (
    <div
      style={{ display: "flex", gap: 5, flexGrow: 1, position: "relative" }}
      className={invalidGuess ? "word-too-short" : ""}
    >
      {invalidGuess && <InvalidGuessPopup message={invalidGuess.message} />}

      {letters.map((letter, index) => (
        <Tile
          letter={letter}
          key={index}
          status={
            (isCurrentGuess && !revealGuessResult) || !guess
              ? "unknown"
              : getLetterStatusFromGuess(targetWord, letter, index)
          }
          isRevealing={revealGuessResult}
          revealDelay={index * REVEAL_ANIMATION_TIME_PER_TILE}
        />
      ))}
    </div>
  );
};

type InvalidPopupType = {
  message: string;
};
function InvalidGuessPopup(props: InvalidPopupType) {
  const { message } = props;
  return (
    <div
      style={{
        position: "absolute",
        // top: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "black",
          color: "white",
          zIndex: 10,
          height: 30,
          borderRadius: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            padding: 5,
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default GuessRow;
