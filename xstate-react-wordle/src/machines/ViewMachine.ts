import { assign, createMachine } from "xstate";
import { pure, send, sendParent } from "xstate/lib/actions";
import { createSwitchboard } from "../shared/switchboard";
import { isLetter } from "../shared/util";
import makeCreateEnumMachine from "./EnumMachine";
import { InvalidGuessInfo } from "./GameMachine";
import ToggleMachine from "./ToggleMachine";

export type Dialogs = "stats" | "help" | "settings";

type SavedView = {
  // darkMode: boolean;
  // highContrastMode: boolean;
};

const VIEW_LOCAL_STORAGE_KEY = "view";

export type ViewEventSchema =
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "TOGGLE_HIGH_CONTRAST_MODE" }
  | { type: "KEYPRESS"; key: string }
  | { type: "SHARE_RESULTS" }
  | { type: "SET_OPEN_DIALOG" }
  | { type: "OPEN_DIALOG"; dialog: Dialogs }
  | { type: "CLOSE_DIALOG" }
  | { type: "CLEAR_LOCAL_STORAGE" };

type ViewContext = SavedView & {
  invalidGuess: InvalidGuessInfo | undefined;
  congrats: string | undefined;
};

// turn the key display string into a real key code
function getKeyCodeFromKey(key: string): string {
  if (key === "DEL") {
    return "Delete";
  }

  if (key === "ENTER") {
    return "Enter";
  }

  if (key.toLocaleUpperCase() === "BACKSPACE") {
    return "Delete";
  }

  return key;
}

const keypressHandler = (ctx, event) => (callback, onReceive) => {
  onReceive((event) => {
    console.log("keypressHandler", event);
    const { key } = event;
    const keycode = getKeyCodeFromKey(key).toLocaleUpperCase();
    if (keycode === "ENTER") {
      callback({ type: "SUBMIT_GUESS", origin: "keypressHandler" });
    } else if (keycode === "DELETE") {
      callback({ type: "DELETE_LETTER", origin: "keypressHandler" });
    } else if (isLetter(keycode)) {
      callback({ type: "ADD_LETTER_TO_GUESS", letter: keycode, origin: "keypressHandler" });
    }
  });
};

const ViewMachine = createMachine(
  {
    tsTypes: {} as import("./ViewMachine.typegen").Typegen0,
    schema: {
      context: {} as ViewContext,
      events: {} as ViewEventSchema,
    },
    context: {
      invalidGuess: undefined,
      congrats: undefined,
      // todo: open dialog on app load
    },
    type: "parallel",
    on: {
      "*": {
        actions: ["switchboard"],
      },
    },
    invoke: [
      { id: "keypressHandler", src: keypressHandler },
      { id: "darkMode", src: ToggleMachine },
      { id: "highContrast", src: ToggleMachine },
      {
        id: "dialogs",
        src: makeCreateEnumMachine({
          vals: ["stats", "help", "settings", "closed"],
          initial: "closed",
        }),
      },
    ],
    states: {
      copiedToClipboard: {
        states: {
          visible: {
            tags: ["showCopiedToClipboard"],
          },
          hidden: {},
        },
      },
      round: {},
      guessResult: {
        states: {
          idle: {},
          revealing: {
            tags: ["revealGuessResult"],
          },
        },
      },
    },
  },
  {
    actions: {
      switchboard: createSwitchboard((ctx, event) => ({
        // '' = external event
        "": {
          KEYPRESS: { target: "keypressHandler", type: "KEYPRESS" },
          TOGGLE_DARK_MODE: { target: "darkMode", type: "TOGGLE" },
          TOGGLE_HIGH_CONTRAST_MODE: { target: "highContrast", type: "TOGGLE" },
          OPEN_DIALOG: {
            target: "dialogs",
            type: "CHANGE_ACTIVE_VAL",
            args: { val: event.dialog },
          },
          CLOSE_DIALOG: { target: "dialogs", type: "CHANGE_ACTIVE_VAL", args: { val: "closed" } },
          "*": { target: "out", type: event.type },
        },
        keypressHandler: {
          "*": { target: "out", type: event.type },
        },
      })),
    },
    guards: {},
  }
);

export function selectDarkModeFromView(state) {
  const darkModeComponent = state.children.darkMode;
  return selectDarkMode(darkModeComponent.state);
}

function selectDarkMode(state) {
  return state.matches("on");
}

export function selectHighContrastModeFromView(state) {
  const highContrastModeComponent = state.children.highContrast;
  return selectHighContrastMode(highContrastModeComponent.state);
}

function selectHighContrastMode(state) {
  return state.matches("on");
}

export function selectDialogFromView(state) {
  const dialogComponent = state.children.dialogs;
  return selectDialog(dialogComponent.state);
}
function selectDialog(state) {
  console.log(state.value);
  return state.value;
}

export default ViewMachine;
