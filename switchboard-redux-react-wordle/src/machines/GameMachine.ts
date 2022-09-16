// @ts-nocheck

import { assign, createMachine, StateFrom } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { WORDS } from "../constants/wordList";
import { AppModel } from "../main";
// import { AppModel } from "../main";
import { Component, createCompoundComponent } from "../shared/switchboard";
import { AppSelectors } from "./AppMachine";
import ToggleMachine from "./ToggleMachine";

export type GameStatus = "playing" | "won" | "lost";

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

type SavedGameState = {
  guesses: Guesses;
  dateString: string;
  roundFrequency: RoundFrequency;
  targetWord: string;
};

interface GameState {
  guesses: Guesses;
  maxGuesses: number;
  guessLength: number;
  currentGuess: Guess;
  targetWord: string;
  roundFrequency: RoundFrequency;
}

type CorrectLetterStatus = "correct";

export type LetterStatus = "absent" | "present" | CorrectLetterStatus | "unknown";

export type Guess = Array<string>;

type Guesses = Array<Guess>;

export type InvalidGuessInfo = { message: string };

export const REVEAL_ANIMATION_TIME_PER_TILE = 0.35;

type MissingLetterInfo = {
  lettersMissing: boolean;
  correctLetters: Array<DiscoveredLetter>;
  presentLetters: Array<DiscoveredLetter>;
};

/**
 * Get status for each letter in a given guess
 * @param guess Guess to get letter statuses
 * @param targetWord current target word
 * @returns
 */
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
      targetWordNotFound[guessIndex] = "";
    }
  });

  guess.forEach((letter, guessIndex) => {
    if (targetWord[guessIndex] !== letter) {
      // this letter is correct
      const index = targetWordNotFound.findIndex((targetWordLetter) => targetWordLetter === letter);
      if (index >= 0) {
        // we've found this in the target word
        targetWordNotFound[guessIndex] = "";
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

export type LetterStatuses = Record<string, LetterStatus>;

/**
 * Returns the highest priority status that's been discovered for each letter
 * @param state redux state
 * @returns statuses for each letter
 */
function selectLetterStatuses(state: StateFrom<typeof GameMachine>) {
  const { guesses, targetWord } = state.context;
  const letterStatuses: LetterStatuses = {};

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

function shouldOverwriteStatus(previousStatus: LetterStatus, currentStatus: LetterStatus) {
  let statusOrder = ["unknown", "absent", "present", "correct"];
  let previousStatusPriority = statusOrder.indexOf(previousStatus);
  let currentStatusPriority = statusOrder.indexOf(currentStatus);
  return currentStatusPriority > previousStatusPriority;
}

type DiscoveredLetter = { status: LetterStatus; guessIndex: number; letter: string };

type DiscoveredLetters = Record<string, DiscoveredLetter>;

export type RoundFrequency = "24hr" | "1min";

const validateGuess = (ctx, event, meta) => (callback, onReceive) => {
  onReceive((event) => {
    const { currentGuess, guesses, targetWord } = AppSelectors.gameState(AppModel.state).context;
    const isHardMode = AppSelectors.hardMode(AppModel.state);
    const missingLetterInfo = guessContainsAllDiscoveredLetters(currentGuess, guesses, targetWord);

    let invalidGuess = false;
    let invalidGuessMessage = "";

    if (currentGuess.length < WORD_LENGTH) {
      invalidGuess = true;
      invalidGuessMessage = "Word too short";
    } else if (!WORDS.includes(currentGuess.join("").toLocaleLowerCase())) {
      invalidGuess = true;
      invalidGuessMessage = "Not in word list";
    } else if (isHardMode && missingLetterInfo.lettersMissing) {
      invalidGuess = true;
      invalidGuessMessage = getGuessDiscoveredLettersErrorMesaage(missingLetterInfo);
    }

    if (invalidGuess) {
      callback({ type: "INVALID_GUESS", message: invalidGuessMessage, origin: "validateGuess" });
    } else {
      callback({ type: "VALID_GUESS", origin: "validateGuess" });
    }
  });
};

const ValidateGuessComponent: Component = [validateGuess];

const GameMachine = createMachine(
  {
    id: "gameStatus",
    tsTypes: {} as import("./GameMachine.typegen").Typegen0,
    schema: {
      context: {} as GameState,
      events: {} as
        | { type: "SUBMIT_GUESS" }
        | { type: "DELETE_LETTER" }
        | { type: "ADD_LETTER_TO_GUESS"; letter: string }
        | { type: "INCORRECT_GUESS" }
        | { type: "CORRECT_GUESS" }
        | { type: "NEW_ROUND_CUSTOM_WORD"; word: string }
        | { type: "UPDATE_ROUND_FREQUENCY"; roundFrequency: RoundFrequency }
        | { type: "NEW_ROUND_RANDOM_WORD" }
        | { type: "CLEAR_LOCAL_STORAGE" },
    },
    context: {
      guesses: [],
      maxGuesses: MAX_GUESSES,
      guessLength: WORD_LENGTH,
      currentGuess: [],
      targetWord: "REACT",
      roundFrequency: "24hr",
    },
    type: "parallel",
    states: {
      round: {
        initial: "playing",
        states: {
          playing: {
            on: {
              SUBMIT_GUESS: [
                {
                  cond: "correctWord",
                  target: "roundComplete",
                },
                {
                  actions: ["addCurrentGuessToGuesses", "emitEventIncorrectGuess"],
                },
              ],
              DELETE_LETTER: {
                actions: ["deleteLetter"],
              },
              ADD_LETTER_TO_GUESS: {
                cond: "maxWordSizeNotReached",
                actions: ["addLetterToGuess"],
              },
              INCORRECT_GUESS: {
                actions: ["emitEventIncorrectGuess"],
              },
              CORRECT_GUESS: {
                target: "#roundComplete.won",
              },
            },
            states: {
              idle: {},
              checkingValidGuess: {},
              checkingCorrectWord: {},
            },
          },
          roundComplete: {
            tags: ["roundComplete"],
            id: "roundComplete",
            states: {
              won: {
                tags: ["won"],
              },
              lost: {
                tags: ["lost"],
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      addLetterToGuess: assign({
        currentGuess: (ctx, event) => [...ctx.currentGuess, event.letter],
      }),
      deleteLetter: assign({
        currentGuess: (ctx) => {
          if (ctx.currentGuess.length > 0) {
            const newCurrentGuess = [...ctx.currentGuess];
            newCurrentGuess.pop();
            return newCurrentGuess;
          }
          return ctx.currentGuess;
        },
      }),
      addCurrentGuessToGuesses: assign({
        guesses: (ctx, event) => [...ctx.guesses, ctx.currentGuess],
        currentGuess: () => [],
      }),
      emitEventIncorrectGuess: sendParent({ type: "INCORRECT_GUESS" }),
    },
    guards: {
      maxWordSizeNotReached: (ctx) => {
        return ctx.currentGuess.length < WORD_LENGTH;
      },
      correctWord: (ctx) => {
        return ctx.currentGuess.join("").toUpperCase() === ctx.targetWord.toUpperCase();
      },
    },
  }
);

const GameStatusComponent: Component = [
  GameMachine,
  {
    gameState: (state) => state,
    letterStatuses: (state) => selectLetterStatuses(state),
    guesses: (state) => state.context.guesses,
    hardModeCanBeChanged: (state) =>
      state.context.guesses.length === 0 || state.hasTag("roundComplete"),
  },
];

const HardModeComponent: Component = [
  ToggleMachine,
  {
    hardMode: (state) => state.matches("on"),
  },
];

const CoreMachine = createCompoundComponent({
  id: "core",
  components: [
    { id: "gameStatus", component: GameStatusComponent },
    { id: "hardMode", component: HardModeComponent },
    { id: "validateGuess", component: ValidateGuessComponent },
  ],
  makeWires: (ctx, event) => ({
    // '' = external event
    "": {
      TOGGLE_HARD_MODE: { target: "hardMode", type: "TOGGLE" },
      ADD_LETTER_TO_GUESS: {
        target: "gameStatus",
        type: "ADD_LETTER_TO_GUESS",
      },
      DELETE_LETTER: {
        target: "gameStatus",
        type: "DELETE_LETTER",
      },
      SUBMIT_GUESS: {
        target: "validateGuess",
        type: "VALIDATE_GUESS",
      },
      "*": { target: "out", type: event.type },
    },
    validateGuess: {
      VALID_GUESS: {
        target: "gameStatus",
        type: "SUBMIT_GUESS",
      },
      INVALID_GUESS: {
        target: "out",
        type: "INVALID_GUESS",
      },
    },
    gameStatus: {
      INCORRECT_GUESS: {
        target: "out",
        type: "INCORRECT_GUESS",
      },
    },
  }),
});

export default CoreMachine;

// find all the correct letters
// find any letters that were discovered to be present, that havne't been found to be correct
// need to include duplicates, so check if it's correct if theres another of the same letter known to be present
function guessContainsAllDiscoveredLetters(guess: Guess, guesses: Guesses, targetWord: string) {
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
      targetWordNotFound[index] = "";
    }
  });

  previousGuess.forEach((letter, guessIndex) => {
    if (targetWord[guessIndex] !== letter) {
      // this letter is correct
      const index = targetWordNotFound.findIndex((targetWordLetter) => targetWordLetter === letter);
      if (index >= 0) {
        // we've found this in the target word
        targetWordNotFound[index] = "";
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
