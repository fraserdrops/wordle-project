import React from "react";
import GuessRow from "./GuessRow";

const Grid = (props) => {
  const { guesses, maxGuesses, guessLength, wordTooShort, currentGuess } =
    props;
  const rows = [];
  const currentRowIndex = guesses.length;
  const emptyRows = maxGuesses - guesses.length - 1;
  const displayCurrentGuess = guesses.length < maxGuesses;
  const paddedCurrentGuess = currentGuess ? [...currentGuess] : undefined;
  if (currentGuess.length < guessLength) {
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
      {guesses.map((guess, index) => (
        <GuessRow guessLength={guessLength} guess={guess} key={index} />
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
