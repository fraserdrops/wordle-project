// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.after(2000)#revealGuess.active": {
      type: "xstate.after(2000)#revealGuess.active";
    };
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
    incrementGuessCounter: "REVEAL_GUESS";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "active" | "idle";
  tags: never;
}
export interface Typegen1 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.after(2000)#invalidGuess.active": {
      type: "xstate.after(2000)#invalidGuess.active";
    };
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
    setMessage: "INVALID_GUESS";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "active" | "idle";
  tags: never;
}
