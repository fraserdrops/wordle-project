import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GuessState {
  guesses: Array<Array<string>>;
  maxGuesses: number;
  guessLength: number;
  wordTooShort: boolean;
  currentGuess: Array<string>;
}

const initialState: GuessState = {
  currentGuess: [],
  maxGuesses: 5,
  guessLength: 5,
  wordTooShort: true,
  guesses: [],
};

export const guessSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addLetterToWord: (state, action: PayloadAction<{ letter: string }>) => {
      state.currentGuess.push(action.payload.letter);
    },
    deleteLetterFromWord: (state) => {
      if (state.currentGuess.length > 0) {
        state.currentGuess.slice(0, -1);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addLetterToWord } = guessSlice.actions;

export default guessSlice.reducer;
