// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    setDialog: "OPEN_DIALOG";
    clearOpenDialog: "CLOSE_DIALOG";
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
    | "darkMode"
    | "darkMode.enabled"
    | "darkMode.disabled"
    | "highContrastMode"
    | "highContrastMode.enabled"
    | "highContrastMode.disabled"
    | "guessResult"
    | "guessResult.idle"
    | "guessResult.revealing"
    | {
        copiedToClipboard?: "visible" | "hidden";
        darkMode?: "enabled" | "disabled";
        highContrastMode?: "enabled" | "disabled";
        guessResult?: "idle" | "revealing";
      };
  tags:
    | "showCopiedToClipboard"
    | "darkMode"
    | "highContrastMode"
    | "revealGuessResult";
}
