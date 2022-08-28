import { assign, createMachine } from "xstate";
import { pure, send, sendParent } from "xstate/lib/actions";
import { createSwitchboard, createCompoundComponent } from "../shared/switchboard";
import { isLetter } from "../shared/util";
import makeCreateEnumMachine from "./EnumMachine";
import { coreSelectors, InvalidGuessInfo } from "./GameMachine";
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
  | { type: "CLEAR_LOCAL_STORAGE" }
  | { type: "REVEAL_GUESS" };

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

type RevealGuessSchema = { type: "REVEAL_GUESS"; message: string } | { type: "__FLUSH_UPDATE__" };
const RevealGuess = createMachine(
  {
    id: "revealGuess",
    tsTypes: {} as import("./ViewMachine.typegen").Typegen0,
    schema: {
      events: {} as RevealGuessSchema,
      context: {} as { guessCounter: number },
    },
    context: {
      guessCounter: 0,
    },
    initial: "idle",
    on: {
      REVEAL_GUESS: { target: "active", internal: false, actions: ["incrementGuessCounter"] },
    },
    states: {
      active: {
        after: {
          2000: {
            target: "idle",
            actions: [sendParent("__FLUSH_UPDATE__")],
          },
        },
      },
      idle: {},
    },
  },
  {
    actions: {
      incrementGuessCounter: assign({ guessCounter: (ctx, event) => ctx.guessCounter + 1 }),
    },
    guards: {},
  }
);

// this doesn't
function selectGuessCount(state) {
  return state.context.guessCounter;
}
type InvalidGuessSchema = { type: "INVALID_GUESS"; message: string } | { type: "__FLUSH_UPDATE__" };

const InvalidGuessMachine = createMachine(
  {
    id: "invalidGuess",
    tsTypes: {} as import("./ViewMachine.typegen").Typegen1,
    schema: {
      events: {} as InvalidGuessSchema,
      context: {} as { message: string },
    },
    context: {
      message: "",
    },
    initial: "idle",
    on: {
      INVALID_GUESS: { target: "active", internal: false, actions: ["setMessage"] },
    },
    states: {
      active: {
        after: {
          2000: {
            target: "idle",
            actions: [sendParent("__FLUSH_UPDATE__")],
          },
        },
      },
      idle: {},
    },
  },
  {
    actions: {
      setMessage: assign({ message: (_, event) => event.message }),
    },
    guards: {},
  }
);

// states: {
//   copiedToClipboard: {
//     states: {
//       visible: {
//         tags: ["showCopiedToClipboard"],
//       },
//       hidden: {},
//     },
//   },
//   round: {},
//   guessResult: {
//     states: {
//       idle: {},
//       revealing: {
//         tags: ["revealGuessResult"],
//       },
//     },
//   },
// },

const ViewMachine = createCompoundComponent({
  id: "view",
  components: [
    { id: "keypressHandler", src: keypressHandler },
    { id: "darkMode", src: ToggleMachine },
    { id: "highContrast", src: ToggleMachine },
    { id: "invalidGuess", src: InvalidGuessMachine },
    {
      id: "dialogs",
      src: makeCreateEnumMachine({
        vals: ["stats", "help", "settings", "closed"],
        initial: "closed",
      }),
    },
    { id: "revealGuess", src: RevealGuess },
  ],
  makeWires: (ctx, event) => ({
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
      ADD_LETTER_TO_GUESS: { target: "core", type: "ADD_LETTER_TO_GUESS" },
      INVALID_GUESS: {
        target: "invalidGuess",
        type: "INVALID_GUESS",
      },
      INCORRECT_GUESS: {
        target: "revealGuess",
        type: "REVEAL_GUESS",
      },
      "*": { target: "out", type: event.type },
    },
    keypressHandler: {
      SUBMIT_GUESS: { target: "out", type: event.type },
      DELETE_LETTER: { target: "out", type: event.type },
      ADD_LETTER_TO_GUESS: { target: "out", type: event.type },
    },
  }),
});

export const viewSelectors = {
  darkMode: (state) => {
    const darkModeComponent = state.children.darkMode;
    return selectDarkMode(darkModeComponent.state);
  },
  highContrast: (state) => {
    const highContrastComponent = state.children.highContrast;
    return selectHighContrastMode(highContrastComponent.state);
  },
  dialog: (state) => {
    const dialogsComponent = state.children.dialogs;
    return selectDialog(dialogsComponent.state);
  },
  invalidGuessMessage: (state) => {
    const invalidGuessComponent = state.children.invalidGuess;
    return selectInvalidGuessMessage(invalidGuessComponent.state);
  },
  invalidGuessActive: (state) => {
    const invalidGuessComponent = state.children.invalidGuess;
    return selectInvalidGuessActive(invalidGuessComponent.state);
  },
  guesses: (state) => {
    // we want the view to select the guesses that it needs to display
    // and it needs to handle 'revealing' a guess that's just been submitted
    // the core model instantly commits this guess, but we don't want to commit it
    // until it's been revealed, hence the view lags behind the core model
    // essentially, we just keep a pointer to the last guess the view h
    const revealGuessComponent = state.children.revealGuess;
    const guessCount = selectGuessCount(revealGuessComponent.state);
    const coreGuesses = coreSelectors.guesses;
    return coreGuesses[guessCount];
  },
};

function selectDarkMode(state) {
  return state.matches("on");
}

function selectHighContrastMode(state) {
  return state.matches("on");
}

function selectDialog(state) {
  console.log(state.value);
  return state.value;
}

function selectInvalidGuessMessage(state) {
  return state.context.message;
}

function selectInvalidGuessActive(state) {
  return state.matches("active");
}

export default ViewMachine;
