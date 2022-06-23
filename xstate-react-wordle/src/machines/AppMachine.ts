import { assign, createMachine } from "xstate";
import { pure, send } from "xstate/lib/actions";
import GameMachine, { InvalidGuessInfo } from "./GameMachine";
import ViewMachine, {
  selectDarkModeFromView,
  selectHighContrastModeFromView,
  ViewEventSchema,
} from "./ViewMachine";

// const Switchboard = (context, event) => (callback, onReceive) => {
//   const lookup = {
//     // '' = external event
//     "": {
//       KEYPRESS: 'view',
//       // added this line in the wiring
//       '*': 'someActor'
//     },
//     view: {
//       KEYPRESS: 'someActor'
//     },
//   };
//   const target = lookup[origin][event]
//   sendTo(target, event);
// };

type SavedApp = {
  // darkMode: boolean;
  // highContrastMode: boolean;
};

type AppState = {};

const VIEW_LOCAL_STORAGE_KEY = "view";

type AppEventSchema = ViewEventSchema;

type AppContext = SavedApp & {};

const AppMachine = createMachine(
  {
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
        id: "game",
        src: GameMachine,
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
        console.log("switchboard", event);
        const lookup: Record<string, Record<string, string>> = {
          // '' = external event
          "": {
            KEYPRESS: "view",
            TOGGLE_DARK_MODE: "view",
            TOGGLE_HIGH_CONTRAST_MODE: "view",
          },
          view: {
            "*": "game",
          },
        };
        const { origin = "" } = event;
        const target = lookup[origin][event.type] ?? lookup[origin]["*"];
        return send({ ...event, origin: "" }, { to: target });
      }),
    },
    guards: {},
  }
);

export function selectDarkMode(state) {
  return selectDarkModeFromView(state.children["view"].state);
}

export function selectHighContrastMode(state) {
  return selectHighContrastModeFromView(state.children["view"].state);
}

export default AppMachine;
