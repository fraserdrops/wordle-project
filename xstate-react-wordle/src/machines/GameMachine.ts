import { assign, createMachine } from "xstate";

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
  // revealGuessResult: boolean;
  // invalidGuess: InvalidGuessInfo | undefined;
  // congrats: string | undefined;
  // gameStatus: GameStatus;
  // roundFrequency: RoundFrequency;
}

type CorrectLetterStatus = "correct";

type LetterStatus = "absent" | "present" | CorrectLetterStatus | "unknown";

type Guess = Array<string>;

type Guesses = Array<Guess>;

type InvalidGuessInfo = { message: string };

type MissingLetterInfo = {
  lettersMissing: boolean;
  correctLetters: Array<DiscoveredLetter>;
  presentLetters: Array<DiscoveredLetter>;
};

const REVEAL_ANIMATION_TIME_PER_TILE = 0.35;

type DiscoveredLetter = { status: LetterStatus; guessIndex: number; letter: string };

type DiscoveredLetters = Record<string, DiscoveredLetter>;

type RoundFrequency = "24hr" | "1min";

const GameMachine = createMachine(
  {
    tsTypes: {} as import("./GameMachine.typegen").Typegen0,
    schema: {
      context: {} as GameState,
      events: {} as
        | { type: "SUBMIT_GUESS" }
        | { type: "DELETE_LETTER" }
        | { type: "ADD_LETTER_TO_GUESS"; letter: string },
    },
    context: {
      guesses: [],
      maxGuesses: MAX_GUESSES,
      guessLength: WORD_LENGTH,
      currentGuess: [],
      targetWord: "REACT",
    },
    type: "parallel",
    states: {
      round: {
        initial: "playing",
        states: {
          playing: {
            on: {
              SUBMIT_GUESS: {},
              DELETE_LETTER: {
                actions: ["deleteLetter"],
              },
              ADD_LETTER_TO_GUESS: {
                actions: ["addLetterToGuess"],
              },
            },
          },
          roundComplete: {
            states: {
              won: {},
              lost: {},
            },
          },
        },
      },
      hardMode: {
        initial: "disabled",
        states: {
          enabled: {},
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
  }
);

export default GameMachine;
