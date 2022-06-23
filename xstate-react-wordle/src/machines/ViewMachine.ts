import { assign, createMachine } from "xstate";
import { pure, send, sendParent } from "xstate/lib/actions";
import { InvalidGuessInfo } from "./GameMachine";
import ToggleMachine from "./ToggleMachine";

export type Dialogs = "stats" | "help" | "settings";

type SavedView = {
  // darkMode: boolean;
  // highContrastMode: boolean;
};

type ViewState = {
  openDialog: Dialogs | false;
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
  openDialog: Dialogs | false;
};

const keypressHandler = (ctx, event) => (callback, onReceive) => {
  onReceive((event) => {
    console.log("keypressHandler", event);
    const { key } = event;
    if (key === "Enter") {
      callback({ type: "SUBMIT_GUESS", origin: "keypressHandler" });
    } else if (key === "Del") {
      callback({ type: "DELETE_LETTER", origin: "keypressHandler" });
    } else {
      callback({ type: "ADD_LETTER_TO_GUESS", letter: key, origin: "keypressHandler" });
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
      openDialog: false,
    },
    type: "parallel",
    on: {
      OPEN_DIALOG: {
        actions: ["setDialog"],
      },
      CLOSE_DIALOG: {
        actions: ["clearOpenDialog"],
      },
      "*": {
        actions: ["switchboard"],
      },
    },
    invoke: [
      { id: "keypressHandler", src: keypressHandler },
      { id: "darkMode", src: ToggleMachine },
      { id: "highContrast", src: ToggleMachine },
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
      switchboard: pure((ctx, event: { type: string; origin?: string }) => {
        console.log("switchboard", event);
        const lookup: Record<string, Record<string, { target: string; type: string }>> = {
          // '' = external event
          "": {
            KEYPRESS: { target: "keypressHandler", type: "KEYPRESS" },
            TOGGLE_DARK_MODE: { target: "darkMode", type: "TOGGLE" },
            TOGGLE_HIGH_CONTRAST_MODE: { target: "highContrast", type: "TOGGLE" },
            "*": { target: "out", type: event.type },
          },
          keypressHandler: {
            "*": { target: "out", type: event.type },
          },
        };
        const { origin = "" } = event;
        const { target, type } = lookup[origin][event.type] ?? lookup[origin]["*"];

        if (target === "out") {
          return sendParent({ ...event, type, origin: "view" });
        }

        return send({ ...event, type, origin: "" }, { to: target });
      }),
      setDialog: assign({ openDialog: (ctx, event) => event.dialog }),
      clearOpenDialog: assign({ openDialog: () => false }),
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
  console.log(highContrastModeComponent, highContrastModeComponent.state);
  return selectHighContrastMode(highContrastModeComponent.state);
}

function selectHighContrastMode(state) {
  return state.matches("on");
}

export default ViewMachine;
