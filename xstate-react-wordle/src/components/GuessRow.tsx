import React from "react";
import {
  getLetterStatusesFromGuess,
  Guess,
  InvalidGuessInfo,
  REVEAL_ANIMATION_TIME_PER_TILE,
} from "../machines/GameMachine";
import MessagePopup from "./MessagePopup";
import Tile from "./Tile";

type CompletedRowProps = {
  guess: Guess;
  targetWord: string;
};

export function CompletedGuessRow(props: CompletedRowProps) {
  const { guess, targetWord } = props;
  const guessStatuses = getLetterStatusesFromGuess(guess, targetWord);
  return (
    <GuessRowContainer>
      {guess.map((letter, index) => (
        <Tile
          letter={letter}
          key={index}
          status={guessStatuses[index]}
          revealDelay={index * REVEAL_ANIMATION_TIME_PER_TILE}
        />
      ))}
    </GuessRowContainer>
  );
}

type CurrentRowProps = {
  guessLength: number;
  guess: Guess;
  targetWord: string;
  revealGuessResult: boolean;
  invalidGuess: undefined | InvalidGuessInfo;
};

export function CurrentGuessRow(props: CurrentRowProps) {
  const { guess, targetWord, revealGuessResult, invalidGuess, guessLength } = props;
  const guessStatuses = getLetterStatusesFromGuess(guess, targetWord);
  let paddedGuess = [...guess];
  if (guess.length < guessLength) {
    while (paddedGuess.length < guessLength) {
      paddedGuess.push("");
    }
  } else {
    paddedGuess = guess;
  }

  return (
    <GuessRowContainer>
      {paddedGuess.map((letter, index) => (
        <Tile
          letter={letter}
          key={index}
          status={revealGuessResult ? guessStatuses[index] : "unknown"}
          revealDelay={index * REVEAL_ANIMATION_TIME_PER_TILE}
          isRevealing={revealGuessResult}
        />
      ))}

      {invalidGuess && (
        <div
          style={{
            position: "absolute",
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
    </GuessRowContainer>
  );
}

type EmptyRowProps = {
  guessLength: number;
};

export function EmptyGuessRow(props: EmptyRowProps) {
  const { guessLength } = props;
  let letters = [];

  for (let i = 0; i < guessLength; i++) {
    letters.push("");
  }
  return (
    <GuessRowContainer>
      {letters.map((letter, index) => (
        <Tile
          letter={letter}
          key={index}
          status={"unknown"}
          revealDelay={index * REVEAL_ANIMATION_TIME_PER_TILE}
        />
      ))}
    </GuessRowContainer>
  );
}

function GuessRowContainer(props: { children: React.ReactNode; invalidGuess?: boolean }) {
  const { children, invalidGuess } = props;
  return (
    <div
      style={{ display: "flex", gap: 5, flexGrow: 1, position: "relative" }}
      className={invalidGuess ? "word-too-short" : ""}
    >
      {children}
    </div>
  );
}
