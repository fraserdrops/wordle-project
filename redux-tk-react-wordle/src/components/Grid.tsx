import React from "react";
import { useSelector } from "react-redux";
import GuessRow from "./GuessRow";
import { useAppSelector } from "../app/hooks";

type Props = {
  guesses: Array<Array<string>>;
  maxGuesses: number;
  guessLength: number;
  wordTooShort: boolean;
  currentGuess: Array<string>;
};

const Grid = (props: Props) => {
  const { guesses, maxGuesses, guessLength, wordTooShort, currentGuess } =
    useAppSelector((state) => state.appState);

  const rows = [];
  const currentRowIndex = guesses.length;
  const emptyRows = maxGuesses - guesses.length - 1;
  const displayCurrentGuess = guesses.length < maxGuesses;
  const paddedCurrentGuess = currentGuess ? [...currentGuess] : undefined;
  if (paddedCurrentGuess && currentGuess.length < guessLength) {
    while (paddedCurrentGuess.length < guessLength) {
      paddedCurrentGuess.push("");
    }
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        width: "100%",
      }}
    >
      {guesses.map((guess: Array<string>, index: number) => (
        <GuessRow
          guessLength={guessLength}
          guess={guess}
          key={index}
          wordTooShort={wordTooShort}
        />
      ))}
      {displayCurrentGuess && (
        <GuessRow
          guessLength={guessLength}
          wordTooShort={wordTooShort}
          guess={paddedCurrentGuess}
        />
      )}
      {new Array(emptyRows).fill(0).map((_, index) => (
        <GuessRow
          guessLength={guessLength}
          wordTooShort={wordTooShort && index === currentRowIndex}
          key={index}
        />
      ))}
    </div>
  );
};

export default Grid;
