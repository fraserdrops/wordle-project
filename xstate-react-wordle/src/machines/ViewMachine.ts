import { assign, createMachine } from "xstate";
import { InvalidGuessInfo } from "./GameMachine";

export type Dialogs = "stats" | "help" | "settings";

type SavedView = {
  // darkMode: boolean;
  // highContrastMode: boolean;
};

type ViewState = {
  openDialog: Dialogs | false;
};

const VIEW_LOCAL_STORAGE_KEY = "view";

type ViewEventSchema =
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
    },
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
      darkMode: {
        initial: "disabled",
        states: {
          enabled: {
            tags: ["darkMode"],
            on: {
              TOGGLE_HIGH_CONTRAST_MODE: "disabled",
            },
          },
          disabled: {
            on: {
              TOGGLE_HIGH_CONTRAST_MODE: "enabled",
            },
          },
        },
      },
      highContrastMode: {
        initial: "disabled",
        states: {
          enabled: {
            tags: ["highContrastMode"],
          },
          disabled: {},
        },
      },
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
      setDialog: assign({ openDialog: (ctx, event) => event.dialog }),
      clearOpenDialog: assign({ openDialog: () => false }),
    },
    guards: {},
  }
);

export default ViewMachine;
