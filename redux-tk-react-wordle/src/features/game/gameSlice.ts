import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, GetState, RootState } from "../../app/store";
import { WORDS } from "../../constants/wordList";
import { MAX_GUESSES } from "../../shared/constants";
import { dispatchUpdateStats } from "../stats/statsSlice";
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

export type DiscoveredLetters = Record<string, DiscoveredLetter>;

const initialState: GameState = {
  currentGuess: [],
  maxGuesses: MAX_GUESSES,
  guessLength: 5,
  invalidGuess: undefined,
  guesses: [
    // "TEARS".split(""),
    // "TEARS".split(""),
    // "TEARS".split(""),
    // "TEARS".split(""),
    // "TEARS".split(""),
  ],
  targetWord: "REACT",
  correct: false,
  revealGuessResult: false,
  hardMode: true,
  congrats: undefined,
  gameStatus: "playing",
};

export const gameSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addLetterToWord: (state, action: PayloadAction<{ letter: string }>) => {
      state.currentGuess.push(action.payload.letter);
    },
    deleteLetterFromWord: (state) => {
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
    setHardMode: (state, action: PayloadAction<{ hardMode: boolean }>) => {
      state.hardMode = action.payload.hardMode;
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
  setHardMode,
} = gameSlice.actions;

const submitGuess = () => async (dispatch: AppDispatch, getState: GetState) => {
  const state = getState();
  const { currentGuess, targetWord, guesses, hardMode } = state.gameState;
  let invalidGuess = false;
  let invalidGuessMessage = "";

  // check all the cases the guess can be invalid

  // guess too short
  // const missingLetterInfo = guessContainsAllDiscoveredLetters(currentGuess, discoveredLetters);
  const missingLetterInfo = guessContainsAllDiscoveredLetters(currentGuess, guesses, targetWord);
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

function getCongratsMessage(incorrectGuesses: number) {
  const messages = ["Genius", "Amazing", "Great", "Good", "Nice", "Close one"];
  return messages[incorrectGuesses];
}

function getGuessDiscoveredLettersErrorMesaage(missingLetterInfo: MissingLetterInfo) {
  let errorMessage = "";
  if (missingLetterInfo.correctLetters.length > 0) {
    const { letter, guessIndex } = missingLetterInfo.correctLetters[0];
    return ordinal_suffix_of(guessIndex + 1) + " letter must be " + letter;
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
    const { currentGuess, invalidGuess, gameStatus } = getState().gameState;
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

export default gameSlice.reducer;

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

export function getLetterStatusesFromGuess(guess: Guess, targetWord: string) {
  const targetWordNotFound = targetWord.split("");
  const correctLetters: Array<DiscoveredLetter> = [];
  const presentLetters: Array<DiscoveredLetter> = [];
  const absentLetters = [];
  const guessLetterStatuses: Array<LetterStatus> = [];
  // find all the correct letters in the guess
  guess.forEach((letter, guessIndex) => {
    if (targetWord[guessIndex] === letter) {
      // this letter is correct
      correctLetters.push({ status: "correct", guessIndex, letter });
      guessLetterStatuses[guessIndex] = "correct";

      // we've found this in the target word
      targetWordNotFound.splice(guessIndex, 1);
    }
  });

  guess.forEach((letter, guessIndex) => {
    if (targetWord[guessIndex] !== letter) {
      // this letter is correct
      const index = targetWordNotFound.findIndex((targetWordLetter) => targetWordLetter === letter);
      if (index >= 0) {
        // we've found this in the target word
        targetWordNotFound.splice(index, 1);
        presentLetters.push({ status: "present", guessIndex, letter });
        guessLetterStatuses[guessIndex] = "present";
      } else {
        absentLetters.push({ status: "absent", guessIndex, letter });
        guessLetterStatuses[guessIndex] = "absent";
      }
    }
  });

  return guessLetterStatuses;
}

// find all the correct letters
// find any letters that were discovered to be present, that havne't been found to be correct
// need to include duplicates, so check if it's correct if theres another of the same letter known to be present
function guessContainsAllDiscoveredLetters(
  guess: Guess,
  guesses: Array<Guess>,
  targetWord: string
) {
  // const correctLetters: DiscoveredLetters = {};
  if (guesses.length === 0) {
    // no previous guesses
    return {};
  }
  const previousGuess = guesses[guesses.length - 1];

  const targetWordNotFound = targetWord.split("");
  const correctLetters: Array<DiscoveredLetter> = [];
  const presentLetters: Array<DiscoveredLetter> = [];
  const absentLetters = [];
  // find all the correct letters in the guess
  previousGuess.forEach((letter, index) => {
    if (targetWord[index] === letter) {
      // this letter is correct
      correctLetters.push({ status: "correct", guessIndex: index, letter });

      // we've found this in the target word
      targetWordNotFound[index] == "";
    }
  });

  previousGuess.forEach((letter, guessIndex) => {
    if (targetWord[guessIndex] !== letter) {
      // this letter is correct
      const index = targetWordNotFound.findIndex((targetWordLetter) => targetWordLetter === letter);
      if (index >= 0) {
        // we've found this in the target word
        targetWordNotFound[index] == "";
        presentLetters.push({ status: "present", guessIndex, letter });
      } else {
        absentLetters.push({ status: "absent", guessIndex, letter });
      }
    }
  });

  let correctLettersNotInGuess: Array<DiscoveredLetter> = [];
  let presentLettersNotInGuess: Array<DiscoveredLetter> = [];

  let guessLettersNotFound = [...guess];

  correctLetters.forEach((correctLetter) => {
    if (guess[correctLetter.guessIndex] !== correctLetter.letter) {
      correctLettersNotInGuess.push(correctLetter);
    } else {
      guessLettersNotFound[correctLetter.guessIndex] = "";
    }
  });

  presentLetters.forEach((presentLetter) => {
    const index = guessLettersNotFound.findIndex(
      (guessLetter) => guessLetter === presentLetter.letter
    );
    if (index >= 0) {
      // we've found this in the target word
      guessLettersNotFound[index] = "";
    } else {
      presentLettersNotInGuess.push(presentLetter);
    }
  });

  const lettersMissing = correctLettersNotInGuess.length + presentLettersNotInGuess.length > 0;
  return {
    lettersMissing,
    correctLetters: correctLettersNotInGuess,
    presentLetters: presentLettersNotInGuess,
  };
}

/**
 * Returns the highest priority status that's been discovered for each letter
 * @param state redux state
 * @returns statuses for each letter
 */
export function selectLetterStatuses(state: RootState) {
  const { guesses, targetWord } = state.gameState;
  const letterStatuses: Record<string, LetterStatus> = {};

  guesses.forEach((guess) => {
    const letterStatusesFromGuess = getLetterStatusesFromGuess(guess, targetWord);
    guess.forEach((letter, index) => {
      const statusFromGuess = letterStatusesFromGuess[index];
      const previousResult = letterStatuses[letter];
      if (!previousResult || shouldOverwriteStatus(previousResult, statusFromGuess)) {
        letterStatuses[letter] = statusFromGuess;
      }
    });
  });

  return letterStatuses;
}

export const toggleHardMode = () => async (dispatch: AppDispatch, getState: GetState) => {
  const state = getState();
  if (selectHardModeCanBeChanged(state)) {
    const { hardMode } = state.gameState;
    dispatch(setHardMode({ hardMode: !hardMode }));
  }
};

// can't change hard mode during a round
export function selectHardModeCanBeChanged(getState: RootState) {
  const { guesses, gameStatus } = getState.gameState;
  return guesses.length === 0 || gameStatus !== "playing";
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
