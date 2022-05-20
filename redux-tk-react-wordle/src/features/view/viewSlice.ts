import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, GetState } from "../../app/store";
import { shareStatus } from "../../shared/shareResults";
import { getLetterStatusesFromGuess } from "../game/gameSlice";

export type Dialogs = "stats" | "help" | "settings";

type ViewState = {
  openDialog: Dialogs | false;
  darkMode: boolean;
  highContrastMode: boolean;
  showCopiedToClipboard: boolean;
};
const initialState: ViewState = {
  openDialog: false,
  darkMode: false,
  highContrastMode: false,
  showCopiedToClipboard: false,
};

export const viewSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setOpenDialog: (state, action: PayloadAction<{ dialog: Dialogs }>) => {
      state.openDialog = action.payload.dialog;
    },
    closeDialog: (state) => {
      state.openDialog = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleHighContrastMode: (state) => {
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

// Action creators are generated for each case reducer function
export const {
  setOpenDialog,
  closeDialog,
  toggleDarkMode,
  toggleHighContrastMode,
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
  shareStatus(guessStatuses, false, hardMode, darkMode, highContrastMode, 2, () => {
    dispatch(showCopiedToClipboard());
    setTimeout(() => {
      dispatch(hideCopiedToClipboard());
    }, 2000);
  });
};
