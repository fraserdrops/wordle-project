import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, GetState } from "../../app/store";
import { shareStatus } from "../../shared/shareResults";
import { getLetterStatusesFromGuess, getWordIndexForDate } from "../game/gameSlice";

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

const initialState: ViewState = {
  openDialog: false,
  // default to the user preferences
  darkMode: window.matchMedia("(prefers-color-scheme: dark)")?.matches ? true : false,
  highContrastMode: window.matchMedia("(prefers-contrast: more)")?.matches ? true : false,
  showCopiedToClipboard: false,
};

const loadViewFromLocalStorage = () => {
  const savedView = localStorage.getItem(VIEW_LOCAL_STORAGE_KEY);
  if (savedView) {
    return { ...initialState, ...JSON.parse(savedView) };
  }

  return null;
};

const getInitialState = () => {
  return loadViewFromLocalStorage() ?? initialState;
};

export const viewSlice = createSlice({
  name: "stats",
  initialState: getInitialState,
  reducers: {
    setOpenDialog: (state, action: PayloadAction<{ dialog: Dialogs }>) => {
      state.openDialog = action.payload.dialog;
    },
    closeDialog: (state) => {
      state.openDialog = false;
    },
    setToggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setToggleHighContrastMode: (state) => {
      state.highContrastMode = !state.highContrastMode;
    },
    showCopiedToClipboard: (state) => {
      state.showCopiedToClipboard = true;
    },
    hideCopiedToClipboard: (state) => {
      state.showCopiedToClipboard = false;
    },
  },
});

export const {
  setOpenDialog,
  closeDialog,
  setToggleDarkMode,
  setToggleHighContrastMode,
  showCopiedToClipboard,
  hideCopiedToClipboard,
} = viewSlice.actions;

export default viewSlice.reducer;

export const shareResults = () => async (dispatch: AppDispatch, getState: GetState) => {
  const { guesses, targetWord, hardMode } = getState().gameState;
  const { highContrastMode, darkMode } = getState().viewState;
  const guessStatuses = guesses.map((guess) => {
    return getLetterStatusesFromGuess(guess, targetWord);
  });
  shareStatus(
    guessStatuses,
    false,
    hardMode,
    darkMode,
    highContrastMode,
    getWordIndexForDate(new Date()),
    () => {
      dispatch(showCopiedToClipboard());
      setTimeout(() => {
        dispatch(hideCopiedToClipboard());
      }, 2000);
    }
  );
};

export const saveViewToLocalStorage = (viewState: SavedView) => {
  localStorage.setItem(VIEW_LOCAL_STORAGE_KEY, JSON.stringify(viewState));
};

export const saveViewState = () => async (dispatch: AppDispatch, getState: GetState) => {
  const { darkMode, highContrastMode } = getState().viewState;
  saveViewToLocalStorage({ darkMode, highContrastMode });
};

export const toggleDarkMode = () => async (dispatch: AppDispatch) => {
  dispatch(setToggleDarkMode());
  dispatch(saveViewState());
};

export const toggleHighContrastMode = () => async (dispatch: AppDispatch) => {
  dispatch(setToggleHighContrastMode());
  dispatch(saveViewState());
};

export const clearLocalStorage = () => async () => {
  localStorage.clear();
  location.reload();
};

export const openDialogOnAppLoad = () => async (dispatch: AppDispatch, getState: GetState) => {
  const state = getState();
  if (!state.statsState.gamesPlayed && !state.gameState.guesses.length) {
    // open help dialog if it's the players first time
    setTimeout(() => {
      dispatch(setOpenDialog({ dialog: "help" }));
    }, 300);
  } else if (state.gameState.gameStatus === "won" || state.gameState.gameStatus === "lost") {
    // open stats is the round is finished
    setTimeout(() => {
      dispatch(setOpenDialog({ dialog: "stats" }));
    }, 600);
  }
};
