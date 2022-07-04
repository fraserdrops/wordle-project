import { assign, createMachine } from "xstate";
import { pure, send } from "xstate/lib/actions";
import CoreMachine, {
  InvalidGuessInfo,
  RoundFrequency,
  selectGameStateFromCore,
  selectHardModeCanBeChangedFromCore,
  selectHardModeFromCore,
  selectLetterStatusesFromCore,
} from "./GameMachine";
import ViewMachine, {
  selectDarkModeFromView,
  selectDialogFromView,
  selectHighContrastModeFromView,
  ViewEventSchema,
  selectInvalidGuessMessageFromView,
  selectInvalidGuessActiveFromView,
} from "./ViewMachine";

type SavedApp = {
  // darkMode: boolean;
  // highContrastMode: boolean;
};

type AppState = {};

const VIEW_LOCAL_STORAGE_KEY = "view";

type AppEventSchema =
  | ViewEventSchema
  | {
      type: "UPDATE_ROUND_FREQUENCY";
      roundFrequency: RoundFrequency;
    }
  | { type: "NEW_ROUND_CUSTOM_WORD"; word: string }
  | { type: "NEW_ROUND_RANDOM_WORD" };
type AppContext = SavedApp & {};

const AppMachine = createMachine(
  {
    id: "app",
    tsTypes: {} as import("./AppMachine.typegen").Typegen0,
    schema: {
      context: {} as AppContext,
      events: {} as AppEventSchema,
    },
    context: {},
    invoke: [
      {
        id: "view",
        src: ViewMachine,
      },
      {
        id: "core",
        src: CoreMachine,
      },
    ],
    // type: "parallel",
    on: {
      "*": {
        actions: ["switchboard"],
      },
    },
  },
  {
    actions: {
      switchboard: pure((ctx, event: AppEventSchema) => {
        console.trace("switchboard", event);
        const lookup: Record<string, Record<string, string>> = {
          // '' = external event
          "": {
            KEYPRESS: "view",
            TOGGLE_DARK_MODE: "view",
            TOGGLE_HIGH_CONTRAST_MODE: "view",
            TOGGLE_HARD_MODE: "core",
            OPEN_DIALOG: "view",
            CLOSE_DIALOG: "view",
            CLEAR_LOCAL_STORAGE: "view",
            NEW_ROUND_CUSTOM_WORD: "core",
            UPDATE_ROUND_FREQUENCY: "core",
            NEW_ROUND_RANDOM_WORD: "core",
            ADD_LETTER_TO_GUESS: "core",
          },
          view: {
            // "*": "core",
            SUBMIT_GUESS: "core",
            DELETE_LETTER: "core",
            ADD_LETTER_TO_GUESS: "core",
          },
          core: {
            INVALID_GUESS: "view",
          },
        };
        const { origin = "" } = event;
        const target = lookup[origin][event.type] ?? lookup[origin]["*"];
        if (!target) {
          return [];
        }
        console.log("sending", { ...event, origin: "" }, "to", target);
        return send({ ...event, origin: "" }, { to: target });
      }),
    },
    guards: {},
  }
);

export function selectViewState(state) {
  return state.children["view"].state;
}

export function selectCoreState(state) {
  return state.children["core"].state;
}

export function selectGameState(state) {
  return selectGameStateFromCore(selectCoreState(state));
}

export function selectDarkMode(state) {
  return selectDarkModeFromView(selectViewState(state));
}

export function selectHardMode(state) {
  return selectHardModeFromCore(selectCoreState(state));
}

export function selectHighContrastMode(state) {
  return selectHighContrastModeFromView(selectViewState(state));
}

export function selectDialog(state) {
  return selectDialogFromView(selectViewState(state));
}

export function selectHardModeCanBeChanged(state) {
  return selectHardModeCanBeChangedFromCore(selectCoreState(state));
}

export function selectLetterStatuses(state) {
  return selectLetterStatusesFromCore(selectCoreState(state));
}

export function selectInvalidGuessMessage(state) {
  return selectInvalidGuessMessageFromView(selectViewState(state));
}

export function selectInvalidGuessActive(state) {
  console.log("selectInvalidGuessActiveFromView");
  return selectInvalidGuessActiveFromView(selectViewState(state));
}

export default AppMachine;
