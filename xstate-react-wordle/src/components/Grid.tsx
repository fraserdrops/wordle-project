import React from "react";
import { useAppSelector } from "../app/hooks";
import { CompletedGuessRow, CurrentGuessRow, EmptyGuessRow } from "./GuessRow";
import MessagePopup from "./MessagePopup";

export default function Grid() {
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
  } = useAppSelector((state) => state.gameState);

  const emptyRows = Math.max(maxGuesses - guesses.length - 1, 0);
  const displayCurrentGuess = guesses.length < maxGuesses && currentGuess;

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
        <CompletedGuessRow guess={guess} key={index} targetWord={targetWord} />
      ))}
      {displayCurrentGuess && (
        <CurrentGuessRow
          guessLength={guessLength}
          invalidGuess={invalidGuess}
          guess={currentGuess}
          targetWord={targetWord}
          revealGuessResult={revealGuessResult}
        />
      )}
      {new Array(emptyRows).fill(0).map((_, index) => (
        <EmptyGuessRow guessLength={guessLength} key={index} />
      ))}
    </div>
  );
}

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
