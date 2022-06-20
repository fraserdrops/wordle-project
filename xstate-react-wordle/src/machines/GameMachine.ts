import { assign, createMachine, StateFrom } from "xstate";

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
  // revealGuessResult: boolean;
  // invalidGuess: InvalidGuessInfo | undefined;
  // congrats: string | undefined;
  // gameStatus: GameStatus;
  // roundFrequency: RoundFrequency;
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
export function selectLetterStatuses(state: StateFrom<typeof GameMachine>) {
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

const GameMachine = createMachine(
  {
    tsTypes: {} as import("./GameMachine.typegen").Typegen0,
    schema: {
      context: {} as GameState,
      events: {} as
        | { type: "SUBMIT_GUESS" }
        | { type: "DELETE_LETTER" }
        | { type: "ADD_LETTER_TO_GUESS"; letter: string }
        | { type: "INCORRECT_GUESS" }
        | { type: "CORRECT_GUESS" }
        | { type: "TOGGLE_HARD_MODE" }
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
                  cond: "wordTooShort",
                },
                {},
              ],
              DELETE_LETTER: {
                actions: ["deleteLetter"],
              },
              ADD_LETTER_TO_GUESS: {
                actions: ["addLetterToGuess"],
              },
              INCORRECT_GUESS: {},
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
      hardMode: {
        initial: "disabled",
        tags: ["hardMode"],
        states: {
          enabled: {
            on: {
              TOGGLE_HARD_MODE: {
                cond: "hardModeCanBeChanged",
                target: "disabled",
              },
            },
          },
          disabled: {},
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
    },
    guards: {
      hardModeCanBeChanged: (ctx, event, { state }) => {
        return selectHardModeCanBeChanged(state);
      },
    },
  }
);

// can't change hard mode during a round
export function selectHardModeCanBeChanged(state: any) {
  return state.context.guesses.length === 0 || state.hasTag("roundComplete");
}

export default GameMachine;
