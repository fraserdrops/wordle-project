import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, GetState, RootState } from "../../app/store";

export interface GuessState {
  guesses: Array<Guess>;
  maxGuesses: number;
  guessLength: number;
  wordTooShort: boolean;
  currentGuess: Guess;
  targetWord: string;
}

export type LetterStatus = "absent" | "present" | "correct" | "unknown";

export type Guess = Array<string>;

const initialState: GuessState = {
  currentGuess: [],
  maxGuesses: 5,
  guessLength: 5,
  wordTooShort: false,
  guesses: [],
  targetWord: "REACT",
};

export const guessSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addLetterToWord: (state, action: PayloadAction<{ letter: string }>) => {
      state.currentGuess.push(action.payload.letter);
    },
    deleteLetterFromWord: (state) => {
      console.log(
        "state.currentGuess",
        state.currentGuess,
        state.currentGuess.length
      );
      if (state.currentGuess.length > 0) {
        state.currentGuess.pop();
      }
    },
    setWordTooShort: (
      state,
      action: PayloadAction<{ wordTooShort: boolean }>
    ) => {
      state.wordTooShort = action.payload.wordTooShort;
    },
    addGuess: (state, action: PayloadAction<{ guess: Guess }>) => {
      state.guesses.push(action.payload.guess);
      state.currentGuess = [];
    },
  },
});

const getKeyDisplayFromKeyValue = (keyValue: string) => {
  return keyValue.toUpperCase();
};

const isLetter = (keyValue: string) => {
  return keyValue.length === 1 && /[a-zA-Z]/.test(keyValue);
};

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Action creators are generated for each case reducer function
const { addLetterToWord, deleteLetterFromWord, setWordTooShort, addGuess } =
  guessSlice.actions;

const submitGuess = () => async (dispatch: AppDispatch, getState: GetState) => {
  const { currentGuess, targetWord, guesses } = getState().appState;
  dispatch(addGuess({ guess: currentGuess }));
  // submit
  if (currentGuess.join("") === targetWord) {
    // dispatch()
    // correct
  } else {
    // incorrect
    if (guesses.length + 1 === MAX_GUESSES) {
      // game over
    }
  }
};

export const handleKeyPress =
  ({ keyValue }: { keyValue: string }) =>
  async (dispatch: AppDispatch, getState: GetState) => {
    const { wordTooShort, currentGuess, targetWord, guesses } =
      getState().appState;
    if (wordTooShort) {
      // do nothing while we are animating
      return;
    }

    if (keyValue === "Enter") {
      if (currentGuess.length === WORD_LENGTH) {
        dispatch(submitGuess());
        // submit
        if (currentGuess.join("") === targetWord) {
          // correct
        } else {
          // incorrect
          if (guesses.length + 1 === MAX_GUESSES) {
            // game over
          }
        }

        // newExtendedState.guesses = [...newExtendedState.guesses, currentGuess];
      } else {
        // word is too short
        dispatch(setWordTooShort({ wordTooShort: true }));
        setTimeout(() => {
          dispatch(setWordTooShort({ wordTooShort: false }));
        }, 1200);
      }
    } else if (keyValue === "Delete") {
      if (currentGuess.length > 0) {
        dispatch(deleteLetterFromWord());
      }
    } else if (isLetter(keyValue)) {
      if (currentGuess.length < WORD_LENGTH) {
        dispatch(addLetterToWord({ letter: keyValue }));
      }
    }
  };

export default guessSlice.reducer;
