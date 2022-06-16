import { assign, createMachine } from "xstate";
import { InvalidGuessInfo } from "./GameMachine";

export type Dialogs = "stats" | "help" | "settings";

type SavedView = {
  darkMode: boolean;
  highContrastMode: boolean;
};

type ViewState = SavedView & {
  openDialog: Dialogs | false;
  showCopiedToClipboard: boolean;
};

const VIEW_LOCAL_STORAGE_KEY = "view";

type ViewEventSchema =
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "TOGGLE_HIGH_CONTRAST_MODE" }
  | { type: "ADD_LETTER_TO_GUESS"; letter: string }
  | { type: "INCORRECT_GUESS" }
  | { type: "CORRECT_GUESS" }
  | { type: "SHARE_RESULTS" };

type ViewContext = {
  invalidGuess: InvalidGuessInfo | undefined;
  congrats: string | undefined;
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
    },
    type: "parallel",
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
    actions: {},
    guards: {},
  }
);

export default ViewMachine;
