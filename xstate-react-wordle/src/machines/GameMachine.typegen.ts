// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
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
    guards: "wordTooShort";
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    wordTooShort: "SUBMIT_GUESS";
    hardModeCanBeChanged: "TOGGLE_HARD_MODE";
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
    | "hardMode"
    | "hardMode.enabled"
    | "hardMode.disabled"
    | {
        round?:
          | "playing"
          | "roundComplete"
          | {
              playing?: "idle" | "checkingValidGuess" | "checkingCorrectWord";
              roundComplete?: "won" | "lost";
            };
        hardMode?: "enabled" | "disabled";
      };
  tags: "roundComplete" | "won" | "lost" | "hardMode";
}
