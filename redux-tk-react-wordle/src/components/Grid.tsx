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

const Grid = (props: {}) => {
  const {
    guesses,
    maxGuesses,
    guessLength,
    invalidGuess,
    currentGuess,
    targetWord,
    revealGuessResult,
  } = useAppSelector((state) => state.appState);

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
          isCurrentGuess={false}
          targetWord={targetWord}
        />
      ))}
      {displayCurrentGuess && (
        // TODO: GuessRow could be split into CompletedGuessRow, CurrentGuessRow,
        // and EmptyGuessRow. This would mean less conditional logic inside one big component
        <GuessRow
          guessLength={guessLength}
          invalidGuess={invalidGuess}
          guess={paddedCurrentGuess}
          isCurrentGuess
          targetWord={targetWord}
          revealGuessResult={revealGuessResult}
        />
      )}
      {new Array(emptyRows).fill(0).map((_, index) => (
        <GuessRow
          guessLength={guessLength}
          // wordTooShort={wordTooShort && index === currentRowIndex}
          key={index}
          isCurrentGuess={false}
          targetWord={targetWord}
        />
      ))}
    </div>
  );
};

export default Grid;
