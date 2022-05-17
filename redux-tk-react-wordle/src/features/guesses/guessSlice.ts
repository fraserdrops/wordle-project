import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, GetState, RootState } from "../../app/store";
import { WORDS } from "../../constants/wordList";
import { shareStatus } from "../../shared/shareResults";
import { dispatchUpdateStats } from "../stats/statsSlice";
import { MAX_GUESSES } from "../../shared/constants";
import { setOpenDialog } from "../view/viewSlice";

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  guesses: Array<Guess>;
  maxGuesses: number;
  guessLength: number;
  currentGuess: Guess;
  targetWord: string;
  correct: boolean;
  revealGuessResult: boolean;
  hardMode: boolean;
  invalidGuess: InvalidGuessInfo | undefined;
  congrats: string | undefined;
  gameStatus: GameStatus;
}
type CorrectLetterStatus = "correct";

export type LetterStatus = "absent" | "present" | CorrectLetterStatus | "unknown";

export type Guess = Array<string>;

export type InvalidGuessInfo = { message: string };

type MissingLetterInfo = {
  lettersMissing: boolean;
  correctLetters: Array<DiscoveredLetter>;
  presentLetters: Array<DiscoveredLetter>;
};

export const REVEAL_ANIMATION_TIME_PER_TILE = 0.35;

export type DiscoveredLetter = { status: LetterStatus; guessIndex: number; letter: string };

export type DiscoveredLetters = Record<
  string,
  { status: LetterStatus; guessIndex: number; letter: string }
>;

const initialState: GameState = {
  currentGuess: [],
  maxGuesses: MAX_GUESSES,
  guessLength: 5,
  invalidGuess: undefined,
  guesses: [
    "TEARS".split(""),
    "TEARS".split(""),
    "TEARS".split(""),
    "TEARS".split(""),
    "TEARS".split(""),
  ],
  targetWord: "REACT",
  correct: false,
  revealGuessResult: false,
  hardMode: true,
  congrats: undefined,
  gameStatus: "playing",
};

export const guessSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addLetterToWord: (state, action: PayloadAction<{ letter: string }>) => {
      state.currentGuess.push(action.payload.letter);
    },
    deleteLetterFromWord: (state) => {
      console.log("state.currentGuess", state.currentGuess, state.currentGuess.length);
      if (state.currentGuess.length > 0) {
        state.currentGuess.pop();
      }
    },
    setInvalidGuess: (state, action: PayloadAction<{ invalidGuess: InvalidGuessInfo }>) => {
      state.invalidGuess = action.payload.invalidGuess;
    },
    clearInvalidGuess: (state) => (state.invalidGuess = undefined),
    addGuess: (state, action: PayloadAction<{ guess: Guess }>) => {
      state.guesses.push(action.payload.guess);
      state.currentGuess = [];
    },
    setCorrect: (state) => {
      state.correct = true;
    },
    revealGuessResult: (state) => {
      state.revealGuessResult = true;
    },
    endGuessReveal: (state) => {
      state.revealGuessResult = false;
    },
    setCongratsMessage: (state, action: PayloadAction<{ message: string }>) => {
      state.congrats = action.payload.message;
    },
    clearCongratsMessage: (state) => {
      state.congrats = undefined;
    },
    setGameStatus: (state, action: PayloadAction<{ status: GameStatus }>) => {
      state.gameStatus = action.payload.status;
    },
  },
});

const getKeyDisplayFromKeyValue = (keyValue: string) => {
  return keyValue.toUpperCase();
};

const isLetter = (keyValue: string) => {
  return keyValue.length === 1 && /[a-zA-Z]/.test(keyValue);
};

export const WORD_LENGTH = 5;

// Action creators are generated for each case reducer function
const {
  addLetterToWord,
  deleteLetterFromWord,
  addGuess,
  setCorrect,
  revealGuessResult,
  endGuessReveal,
  setInvalidGuess,
  clearInvalidGuess,
  setCongratsMessage,
  clearCongratsMessage,
  setGameStatus,
} = guessSlice.actions;

const submitGuess = () => async (dispatch: AppDispatch, getState: GetState) => {
  const state = getState();
  const { currentGuess, targetWord, guesses, hardMode } = state.appState;
  const discoveredLetters = selectLettersDiscovered(state);
  let invalidGuess = false;
  let invalidGuessMessage = "";

  // check all the cases the guess can be invalid

  // guess too short
  const missingLetterInfo = guessContainsAllDiscoveredLetters(currentGuess, discoveredLetters);
  if (currentGuess.length < WORD_LENGTH) {
    invalidGuess = true;
    invalidGuessMessage = "Word too short";
  } else if (!WORDS.includes(currentGuess.join("").toLocaleLowerCase())) {
    invalidGuess = true;
    invalidGuessMessage = "Not in word list";
  } else if (hardMode && missingLetterInfo.lettersMissing) {
    invalidGuess = true;
    invalidGuessMessage = getGuessDiscoveredLettersErrorMesaage(missingLetterInfo);
  }

  if (invalidGuess) {
    dispatch(reportInvalidGuess({ message: invalidGuessMessage }));
  } else {
    dispatch(revealGuessResult());
    setTimeout(() => {
      dispatch(endGuessReveal());
      if (currentGuess.join("") === targetWord) {
        dispatch(setGameStatus({ status: "won" }));
        dispatch(setCorrect());
        dispatch(dispatchUpdateStats(guesses.length));
        dispatch(setCongratsMessage({ message: getCongratsMessage(guesses.length) }));
        setTimeout(() => {
          dispatch(clearCongratsMessage());
          dispatch(setOpenDialog({ dialog: "stats" }));
        }, 4000);
        // dispatch()
        // correct
      } else {
        // incorrect
        if (guesses.length + 1 === MAX_GUESSES) {
          dispatch(dispatchUpdateStats(guesses.length + 1));
          dispatch(setGameStatus({ status: "lost" }));

          // game over
        }
      }
      dispatch(addGuess({ guess: currentGuess }));
    }, REVEAL_ANIMATION_TIME_PER_TILE * WORD_LENGTH * 1000);
    // dispatch(addGuess({ guess: currentGuess }));
    // submit
  }
};

export const shareResults = () => async (dispatch: AppDispatch, getState: GetState) => {
  const { guesses, targetWord, hardMode } = getState().appState;
  const guessStatuses = selectGuessStatuses(getState());
  console.log("sharing");
  shareStatus(guessStatuses, false, hardMode, false, false, 2, () => {});
};

function getCongratsMessage(incorrectGuesses: number) {
  const messages = ["Genius", "Amazing", "Great", "Good", "Nice", "Close one"];
  return messages[incorrectGuesses];
}
// check that every discovered letter is present in the guess
function guessContainsAllDiscoveredLetters(guess: Guess, discoveredLetters: DiscoveredLetters) {
  // we want to find what letters are known to be present, but the player hasn't included in the guess
  const presentLetters = Object.values(discoveredLetters).filter(
    ({ status }) => status === "present"
  );

  // remove letters from the array as we discovered they were included in the guess
  let presentLettersNotInGuess = [...presentLetters];
  guess.forEach((letter) => {
    const index = presentLettersNotInGuess.findIndex(
      (presentLetter) => presentLetter.letter === letter
    );
    if (index >= 0) {
      presentLettersNotInGuess.splice(index, 1);
    }
  });

  // we want to know what letters are known to be correct, but aren't included in the right position in the guess
  const correctLettersWithIndex = Object.values(discoveredLetters).filter(
    ({ status }) => status === "correct"
  );
  let correctLettersNotInGuess: Array<DiscoveredLetter> = [];
  correctLettersWithIndex.forEach((correctLetter) => {
    if (guess[correctLetter.guessIndex] !== correctLetter.letter) {
      correctLettersNotInGuess.push(correctLetter);
    }
  });

  const lettersMissing = correctLettersNotInGuess.length + presentLettersNotInGuess.length > 0;

  return {
    lettersMissing,
    correctLetters: correctLettersNotInGuess,
    presentLetters: presentLettersNotInGuess,
  };
}

function getGuessDiscoveredLettersErrorMesaage(missingLetterInfo: MissingLetterInfo) {
  let errorMessage = "";
  if (missingLetterInfo.correctLetters.length > 0) {
    const { letter, guessIndex } = missingLetterInfo.correctLetters[0];
    return ordinal_suffix_of(guessIndex + 1) + " must be " + letter;
  }

  if (missingLetterInfo.presentLetters.length > 0) {
    const presentLetter = missingLetterInfo.presentLetters[0];
    return "Guess must contain " + presentLetter.letter;
  }

  return errorMessage;
}

const reportInvalidGuess =
  (invalidGuessInfo: InvalidGuessInfo) => async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setInvalidGuess({ invalidGuess: invalidGuessInfo }));
    setTimeout(() => {
      dispatch(clearInvalidGuess());
    }, 1200);
  };

export const handleKeyPress =
  ({ key }: { key: string }) =>
  async (dispatch: AppDispatch, getState: GetState) => {
    const { currentGuess, invalidGuess, gameStatus } = getState().appState;
    const keyValue = getKeyCodeFromKey(key).toLocaleUpperCase();

    if (gameStatus !== "playing") {
      return;
    }

    if (invalidGuess) {
      // do nothing while we are animating
      return;
    }

    if (keyValue === "ENTER") {
      dispatch(submitGuess());
    } else if (keyValue === "DELETE") {
      if (currentGuess.length > 0) {
        dispatch(deleteLetterFromWord());
      }
    } else if (isLetter(keyValue)) {
      if (currentGuess.length < WORD_LENGTH) {
        dispatch(addLetterToWord({ letter: keyValue }));
      }
    }
  };

// turn the key display string into a real key code
function getKeyCodeFromKey(key: string): string {
  if (key === "DEL") {
    return "Delete";
  }

  if (key === "ENTER") {
    return "Enter";
  }

  if (key.toLocaleUpperCase() === "BACKSPACE") {
    return "Delete";
  }

  return key;
}

export default guessSlice.reducer;

export function getLetterStatusFromGuess(
  targetWord: string,
  letter: string,
  index: number
): LetterStatus {
  if (targetWord.split("")[index] === letter) {
    return "correct";
  }

  if (targetWord.includes(letter)) {
    return "present";
  }

  return "absent";
}

export function selectLettersDiscovered(state: RootState) {
  const { guesses, targetWord } = state.appState;
  return getLettersDiscovered(guesses, targetWord);
}

function getLettersDiscovered(guesses: Array<Guess>, targetWord: string) {
  const lettersDiscovered: DiscoveredLetters = {};
  guesses.forEach((guess) => {
    guess.forEach((letter, index) => {
      const statusFromGuess = getLetterStatusFromGuess(targetWord, letter, index);
      const letterKey = letter + "_" + index;
      const previousResult = lettersDiscovered[letterKey];
      if (!previousResult || shouldOverwriteStatus(previousResult.status, statusFromGuess)) {
        lettersDiscovered[letterKey] = { status: statusFromGuess, guessIndex: index, letter };
      }
    });
  });

  return lettersDiscovered;
}

export function selectLetterStatuses(state: RootState) {
  const { guesses, targetWord } = state.appState;
  const lettersDiscovered = getLettersDiscovered(guesses, targetWord);
  const letterStatuses: Record<string, LetterStatus> = {};
  Object.values(lettersDiscovered).forEach((letterDiscovered) => {
    const { status, letter } = letterDiscovered;
    const previousResult = letterStatuses[letter];
    if (!previousResult || shouldOverwriteStatus(previousResult, status)) {
      letterStatuses[letter] = status;
    }
  });

  return letterStatuses;
}

export function selectGuessStatuses(state: RootState) {
  const { guesses, targetWord } = state.appState;
  return guesses.map((guess) => {
    return guess.map((letter, index) => {
      return getLetterStatusFromGuess(targetWord, letter, index);
    });
  });
}

// True we discover more information about a letter than we had before
function shouldOverwriteStatus(previousStatus: LetterStatus, currentStatus: LetterStatus) {
  let statusOrder = ["unknown", "absent", "present", "correct"];
  let previousStatusPriority = statusOrder.indexOf(previousStatus);
  let currentStatusPriority = statusOrder.indexOf(currentStatus);
  return currentStatusPriority > previousStatusPriority;
}

function ordinal_suffix_of(i: number) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}
