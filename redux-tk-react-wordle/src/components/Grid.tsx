import React from "react";
import { useSelector } from "react-redux";
import GuessRow from "./GuessRow";
import { useAppSelector } from "../app/hooks";
import MessagePopup from "./MessagePopup";

type Props = {
  guesses: Array<Array<string>>;
  maxGuesses: number;
  guessLength: number;
  wordTooShort: boolean;
  currentGuess: Array<string>;
  revealTargetWord: boolean;
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
    gameStatus,
    congrats,
  } = useAppSelector((state) => state.appState);

  const rows = [];
  const currentRowIndex = guesses.length;
  const emptyRows = Math.max(maxGuesses - guesses.length - 1, 0);
  const displayCurrentGuess = guesses.length < maxGuesses;
  const paddedCurrentGuess = currentGuess ? [...currentGuess] : undefined;
  console.log(emptyRows, displayCurrentGuess, guesses.length, maxGuesses);
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
        position: "relative",
      }}
    >
      {gameStatus === "lost" && <GameMessage message={targetWord} />}

      {gameStatus === "won" && congrats && <GameMessage message={congrats} />}

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

function GameMessage(props: { message: string }) {
  const { message } = props;
  return (
    <div
      style={{
        position: "absolute",
        top: 17,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MessagePopup message={message} />
    </div>
  );
}

export default Grid;
