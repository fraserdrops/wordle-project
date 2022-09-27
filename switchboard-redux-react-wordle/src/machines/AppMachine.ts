import { createCompoundComponent } from "../shared/switchboard";
import CoreMachine, {
  RoundFrequency,
  selectGameStateFromCore,
  selectHardModeCanBeChangedFromCore,
  selectHardModeFromCore,
  selectLetterStatusesFromCore,
} from "./GameMachine";
import ViewMachine, { ViewEventSchema, viewSelectors } from "./ViewMachine";

type SavedApp = {
  // darkMode: boolean;
  // highContrastMode: boolean;
};

type AppState = {};

const VIEW_LOCAL_STORAGE_KEY = "view";

export type AppEventSchema =
  | ViewEventSchema
  | {
      type: "UPDATE_ROUND_FREQUENCY";
      roundFrequency: RoundFrequency;
    }
  | { type: "NEW_ROUND_CUSTOM_WORD"; word: string }
  | { type: "NEW_ROUND_RANDOM_WORD" };
type AppContext = SavedApp & {};

const AppMachine = createCompoundComponent({
  id: "app",
  components: [
    {
      id: "view",
      src: ViewMachine,
    },
    {
      id: "core",
      src: CoreMachine,
    },
  ],
  makeWires: (ctx, event: AppEventSchema) => {
    return {
      // '' = external event
      "": {
        KEYPRESS: { target: "view" },
        TOGGLE_DARK_MODE: { target: "view" },
        TOGGLE_HIGH_CONTRAST_MODE: { target: "view" },
        TOGGLE_HARD_MODE: { target: "core" },
        OPEN_DIALOG: { target: "view" },
        CLOSE_DIALOG: { target: "view" },
        CLEAR_LOCAL_STORAGE: { target: "view" },
        NEW_ROUND_CUSTOM_WORD: { target: "core" },
        UPDATE_ROUND_FREQUENCY: { target: "core" },
        NEW_ROUND_RANDOM_WORD: { target: "core" },
        ADD_LETTER_TO_GUESS: { target: "core" },
      },
      view: {
        // "*": {target: "core"},
        SUBMIT_GUESS: { target: "core" },
        DELETE_LETTER: { target: "core" },
        ADD_LETTER_TO_GUESS: { target: "core" },
      },
      core: {
        INVALID_GUESS: { target: "view" },
        INCORRECT_GUESS: { target: "view" },
      },
    };
  },
});

// const AppMachine = createMachine(
//   {
//     id: "app",
//     tsTypes: {} as import("./AppMachine.typegen").Typegen0,
//     schema: {
//       context: {} as AppContext,
//       events: {} as AppEventSchema,
//     },
//     context: {},
//     invoke: [
//       {
//         id: "view",
//         src: ViewMachine,
//       },
//       {
//         id: "core",
//         src: CoreMachine,
//       },
//     ],
//     // type: "parallel",
//     on: {
//       "*": {
//         actions: ["switchboard"],
//       },
//     },
//   },
//   {
//     actions: {
//       switchboard: createSwitchboard("app", (ctx, event: AppEventSchema) => {
//         return {
//           // '' = external event
//           "": {
//             KEYPRESS: { target: "view" },
//             TOGGLE_DARK_MODE: { target: "view" },
//             TOGGLE_HIGH_CONTRAST_MODE: { target: "view" },
//             TOGGLE_HARD_MODE: { target: "core" },
//             OPEN_DIALOG: { target: "view" },
//             CLOSE_DIALOG: { target: "view" },
//             CLEAR_LOCAL_STORAGE: { target: "view" },
//             NEW_ROUND_CUSTOM_WORD: { target: "core" },
//             UPDATE_ROUND_FREQUENCY: { target: "core" },
//             NEW_ROUND_RANDOM_WORD: { target: "core" },
//             ADD_LETTER_TO_GUESS: { target: "core" },
//           },
//           view: {
//             // "*": {target: "core"},
//             SUBMIT_GUESS: { target: "core" },
//             DELETE_LETTER: { target: "core" },
//             ADD_LETTER_TO_GUESS: { target: "core" },
//           },
//           core: {
//             INVALID_GUESS: { target: "view" },
//             INCORRECT_GUESS: { target: "view" },
//           },
//         };
//       }),
//     },
//   }
// );

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
  return viewSelectors.darkMode(selectViewState(state));
}

export function selectHardMode(state) {
  return selectHardModeFromCore(selectCoreState(state));
}

export function selectHighContrastMode(state) {
  return viewSelectors.highContrast(selectViewState(state));
}

export function selectDialog(state) {
  return viewSelectors.dialog(selectViewState(state));
}

export function selectHardModeCanBeChanged(state) {
  return selectHardModeCanBeChangedFromCore(selectCoreState(state));
}

export function selectLetterStatuses(state) {
  return selectLetterStatusesFromCore(selectCoreState(state));
}

export function selectInvalidGuessMessage(state) {
  return viewSelectors.invalidGuessMessage(selectViewState(state));
}

export function selectInvalidGuessActive(state) {
  return viewSelectors.invalidGuessActive(selectViewState(state));
}

export default AppMachine;
