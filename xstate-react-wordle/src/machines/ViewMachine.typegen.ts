// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
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
  matchesStates:
    | "copiedToClipboard"
    | "copiedToClipboard.visible"
    | "copiedToClipboard.hidden"
    | "round"
    | "guessResult"
    | "guessResult.idle"
    | "guessResult.revealing"
    | {
        copiedToClipboard?: "visible" | "hidden";
        guessResult?: "idle" | "revealing";
      };
  tags: "showCopiedToClipboard" | "revealGuessResult";
}
