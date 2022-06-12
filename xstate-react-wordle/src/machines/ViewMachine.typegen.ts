// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {};
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
    | "hardMode"
    | "hardMode.enabled"
    | "hardMode.disabled"
    | {
        copiedToClipboard?: "visible" | "hidden";
        hardMode?: "enabled" | "disabled";
      };
  tags: "showCopiedToClipboard";
}
