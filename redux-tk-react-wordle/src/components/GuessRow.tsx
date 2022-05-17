import React from "react";
import {
  getLetterStatusFromGuess,
  InvalidGuessInfo,
  LetterStatus,
  REVEAL_ANIMATION_TIME_PER_TILE,
} from "../features/guesses/guessSlice";
import MessagePopup from "./MessagePopup";
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
      {invalidGuess && (
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
          <MessagePopup message={invalidGuess.message} />
        </div>
      )}

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

export default GuessRow;
