// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    addCurrentGuessToGuesses: "SUBMIT_GUESS";
    addLetterToGuess: "ADD_LETTER_TO_GUESS";
    deleteLetter: "DELETE_LETTER";
    emitEventIncorrectGuess: "INCORRECT_GUESS" | "SUBMIT_GUESS";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    correctWord: "SUBMIT_GUESS";
    maxWordSizeNotReached: "ADD_LETTER_TO_GUESS";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "round"
    | "round.playing"
    | "round.playing.checkingCorrectWord"
    | "round.playing.checkingValidGuess"
    | "round.playing.idle"
    | "round.roundComplete"
    | "round.roundComplete.lost"
    | "round.roundComplete.won"
    | {
        round?:
          | "playing"
          | "roundComplete"
          | {
              playing?: "checkingCorrectWord" | "checkingValidGuess" | "idle";
              roundComplete?: "lost" | "won";
            };
      };
  tags: "lost" | "roundComplete" | "won";
}
