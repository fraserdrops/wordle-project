import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, GetState, RootState } from "../../app/store";
import { MAX_GUESSES } from "../../shared/constants";

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

const initialState: SavedStats = {
  guessDistribution: new Array(MAX_GUESSES).fill(0),
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  longestStreak: 0,
};

const getInitialState = () => {
  saveStatsToLocalStorage({
    guessDistribution: [1, 2, 3, 4, 5],
    gamesPlayed: 10,
    gamesWon: 5,
    currentStreak: 2,
    longestStreak: 4,
  });
  return loadStatsFromLocalStorage() ?? initialState;
};

export const statsSlice = createSlice({
  name: "stats",
  initialState: getInitialState,
  reducers: {
    updateStats: (state, action: PayloadAction<{ incorrectGuesses: number }>) => {
      state.gamesPlayed += 1;
      const { incorrectGuesses } = action.payload;

      if (incorrectGuesses >= MAX_GUESSES) {
        // game lost
        state.currentStreak = 0;
      } else {
        state.guessDistribution[incorrectGuesses - 1] += 1;
        state.gamesWon += 1;
        state.currentStreak += 1;
        state.longestStreak = Math.max(state.currentStreak, state.longestStreak);
      }
      // returning in immer overrides the previous value
    },
  },
});

// Action creators are generated for each case reducer function
const { updateStats } = statsSlice.actions;

export default statsSlice.reducer;

export const saveStatsToLocalStorage = (stats: SavedStats) => {
  localStorage.setItem(STATS_LOCAL_STORAGE_KEY, JSON.stringify(stats));
};

export const dispatchSaveStatsToLocalStorage =
  () => async (dispatch: AppDispatch, getState: GetState) => {
    const stats = getState().statsState;
    saveStatsToLocalStorage(stats);
  };

export const dispatchUpdateStats =
  (incorrectGuesses: number) => async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(updateStats({ incorrectGuesses }));
    dispatch(dispatchSaveStatsToLocalStorage);
  };

export function selectGameStats(state: RootState): GameStats {
  const { gamesPlayed, gamesWon } = state.statsState;
  const winRatio = gamesWon / gamesPlayed || 0;
  return { winRatio, ...state.statsState };
}
