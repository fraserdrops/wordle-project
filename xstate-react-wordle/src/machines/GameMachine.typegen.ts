// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    addCurrentGuessToGuesses: "SUBMIT_GUESS";
    deleteLetter: "DELETE_LETTER";
    addLetterToGuess: "ADD_LETTER_TO_GUESS";
  };
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
  eventsCausingServices: {};
  eventsCausingGuards: {
    correctWord: "SUBMIT_GUESS";
    maxWordSizeNotReached: "ADD_LETTER_TO_GUESS";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "round"
    | "round.playing"
    | "round.playing.idle"
    | "round.playing.checkingValidGuess"
    | "round.playing.checkingCorrectWord"
    | "round.roundComplete"
    | "round.roundComplete.won"
    | "round.roundComplete.lost"
    | {
        round?:
          | "playing"
          | "roundComplete"
          | {
              playing?: "idle" | "checkingValidGuess" | "checkingCorrectWord";
              roundComplete?: "won" | "lost";
            };
      };
  tags: "roundComplete" | "won" | "lost";
}
export interface Typegen1 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    switchboard: "*";
  };
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
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: undefined;
  tags: never;
}
