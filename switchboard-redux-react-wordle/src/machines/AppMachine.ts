import { createCompoundComponent } from "../shared/switchboard";
import CoreComponent, { RoundFrequency } from "./GameMachine";
import ViewComponent, { ViewEventSchema } from "./ViewMachine";

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

console.log("componentes yo", ViewComponent, CoreComponent);
const AppMachine = createCompoundComponent({
  id: "app",
  components: [
    {
      id: "view",
      component: ViewComponent,
    },
    {
      id: "core",
      component: CoreComponent,
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

export default AppMachine;

export const [AppComponent, AppSelectors] = AppMachine;
