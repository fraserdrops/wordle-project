import { assign, createMachine } from "xstate";
import { MAX_GUESSES } from "../shared/constants";
import { InvalidGuessInfo } from "./GameMachine";

export type Dialogs = "stats" | "help" | "settings";

type SavedView = {
  darkMode: boolean;
  highContrastMode: boolean;
};

const initialState: SavedStats = {
  guessDistribution: new Array(MAX_GUESSES).fill(0),
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  longestStreak: 0,
};

type GuessDistribution = Array<number>;

interface SavedStats {
  guessDistribution: GuessDistribution;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  longestStreak: number;
}

interface GameStats extends SavedStats {
  winRatio: number;
}

const STATS_LOCAL_STORAGE_KEY = "stats";

const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(STATS_LOCAL_STORAGE_KEY);
  return stats ? (JSON.parse(stats) as SavedStats) : null;
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
  | { type: "SHARE_RESULTS" }
  | { type: "CLEAR_LOCAL_STORAGE" };

type ViewContext = {
  invalidGuess: InvalidGuessInfo | undefined;
  congrats: string | undefined;
};
const StatsMachine = createMachine(
  {
    tsTypes: {} as import("./StatsMachine.typegen").Typegen0,
    schema: {
      context: {} as SavedStats,
      events: {} as ViewEventSchema,
    },
    context: {
      guessDistribution: new Array(MAX_GUESSES).fill(0),
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      longestStreak: 0,
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
    },
  },
  {
    actions: {},
    guards: {},
  }
);

export function selectGameStats(state: any): GameStats {
  const { gamesPlayed, gamesWon } = state.context;
  const winRatio = gamesWon / gamesPlayed || 0;
  return { winRatio, ...state.context };
}

export default StatsMachine;
