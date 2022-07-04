import { useSelector } from "@xstate/react";
import { useContext } from "react";
import {
  selectGameState,
  selectInvalidGuessActive,
  selectInvalidGuessMessage,
  selectViewState,
} from "../machines/AppMachine";
import { ActorContext } from "../main";
import { CompletedGuessRow, CurrentGuessRow, EmptyGuessRow } from "./GuessRow";
import MessagePopup from "./MessagePopup";

export default function Grid() {
  const actorContext = useContext(ActorContext);
  const gameState = useSelector(actorContext.appActorRef, selectGameState);
  const viewState = useSelector(actorContext.appActorRef, selectViewState);
  const invalidGuessActive = useSelector(actorContext.appActorRef, selectInvalidGuessActive);
  const invalidGuessMessage = useSelector(actorContext.appActorRef, selectInvalidGuessMessage);
  const { guesses, maxGuesses, guessLength, currentGuess, targetWord } = gameState.context;
  const { invalidGuess, congrats } = viewState.context;

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
      {gameState.hasTag("lost") && <GameMessage message={targetWord} />}
      {gameState.hasTag("won") && congrats && <GameMessage message={congrats} />}
      {guesses.map((guess: Array<string>, index: number) => (
        <CompletedGuessRow guess={guess} key={index} targetWord={targetWord} />
      ))}
      {displayCurrentGuess && (
        <CurrentGuessRow
          guessLength={guessLength}
          invalidGuess={invalidGuessActive ? { message: invalidGuessMessage } : undefined}
          guess={currentGuess}
          targetWord={targetWord}
          revealGuessResult={viewState.hasTag("revealGuessResult")}
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
