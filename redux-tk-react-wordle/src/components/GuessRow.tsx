import React from "react";
import { LetterStatus } from "../features/guesses/guessSlice";
import Tile from "./Tile";

type Props = {
  guessLength: number;
  wordTooShort?: boolean;
  guess?: Array<string>;
  targetWord: string;
  isCurrentGuess: boolean;
};

const GuessRow = (props: Props) => {
  const { guessLength, wordTooShort, guess, targetWord, isCurrentGuess } =
    props;
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
      className={wordTooShort ? "word-too-short" : ""}
    >
      {wordTooShort && <WordTooShortPopup />}

      {letters.map((letter, index) => (
        <Tile
          letter={letter}
          key={index}
          status={
            isCurrentGuess || !guess
              ? "unknown"
              : getLetterStatus(targetWord, letter, index)
          }
          isRevealing={false}
        />
      ))}
    </div>
  );
};

function WordTooShortPopup() {
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
          Word too short
        </p>
      </div>
    </div>
  );
}

function getLetterStatus(
  targetWord: string,
  letter: string,
  index: number
): LetterStatus {
  if (targetWord.split("")[index] === letter) {
    return "correct";
  }

  if (targetWord.includes(letter)) {
    return "present";
  }

  return "absent";
}

export default GuessRow;
