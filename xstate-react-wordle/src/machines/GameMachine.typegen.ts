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
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "round"
    | "round.playing"
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
          | { roundComplete?: "won" | "lost" };
        hardMode?: "enabled" | "disabled";
      };
  tags: never;
}
