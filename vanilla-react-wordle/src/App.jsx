import { useState, useEffect, useReducer } from "react";
import "./App.css";
import Grid from "./components/Grid";
import HeaderBar from "./components/HeaderBar";
import Keyboard from "./components/Keyboard";

const getKeyDisplayFromKeyValue = (keyValue) => {
  return keyValue.toUpperCase();
};

const isLetter = (keyValue) => {
  return keyValue.length === 1 && /[a-zA-Z]/.test(keyValue);
};

const initialState = {
  finite: {
    view: {
      value: "game", // game | settings | stats
    },
    core: {
      value: "guessing", //  guessing | checkingWord
    },
  },
  extended: {
    targetWord: "LIVER",
    currentGuess: [],
    guesses: [],
    wordTooShort: false,
  },
};

function reducer(state, event) {
  // this sort of direct access to state is undesirable
  // ideally it'd be getter/setter only
  const { finite, extended } = state;
  const { wordTooShort, currentGuess, targetWord, guesses } = state.extended;
  switch (event.type) {
    case "KEY_EVENT":
      const { keyValue } = event;
      const newExtendedState = { ...state.extended };
      console.log("current guess", currentGuess);
      if (wordTooShort) {
        // do nothing while we are animating
        return state;
      }

      if (keyValue === "Enter") {
        console.log(currentGuess.length);
        if (currentGuess.length === WORD_LENGTH) {
          // submit
          if (currentGuess.join("") === targetWord) {
            // correct
            newExtendedState.correct = true;
          } else {
            // incorrect
            if (guesses.length + 1 === MAX_GUESSES) {
              // game over
            }
          }

          newExtendedState.guesses = [
            ...newExtendedState.guesses,
            currentGuess,
          ];
        } else {
          // too short
          newExtendedState.wordTooShort = true;

          // how do I set this timeout here?
          // setTimeout(() => {
          //   setWordTooShort(false);
          // }, 1000);
        }
      } else if (keyValue === "Delete") {
        if (currentGuess.length > 0) {
          let newGuess = [...newExtendedState.currentGuess];
          newGuess = [...newGuess.splice(0, newGuess.length - 1)];
          newExtendedState.currentGuess = newGuess;
        }
      } else if (isLetter(keyValue)) {
        if (currentGuess.length < WORD_LENGTH) {
          const newGuess = [
            ...newExtendedState.currentGuess,
            getKeyDisplayFromKeyValue(keyValue),
          ];
          newExtendedState.currentGuess = newGuess;
        }
      }
      return { finite, extended: newExtendedState };
    case "DISABLE_WORD_TOO_SHORT":
      return { ...state, wordTooShort: "false" };
    default:
      throw new Error();
  }
}

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

function App() {
  const [correct, setCorrect] = useState(false);
  const [state, send] = useReducer(reducer, initialState);
  const { currentGuess, guesses, wordTooShort } = state.extended;
  const handleKeyPress = (keyValue) => {
    send({ type: "KEY_EVENT", keyValue });
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => handleKeyPress(e.key));
    return () => {
      window.removeEventListener("keydown");
    };
  }, []);

  console.log(currentGuess);
  return (
    <div className="App">
      <HeaderBar />
      {correct && <p>You are correct!</p>}
      <div
        style={{
          width: "100%",
          height: "calc(100vh - var(--header-bar-height) - 1px)",
          margin: "0 auto",
          display: "flex",
          // justifyContent: "center",
          flexDirection: "column",
          maxWidth: 500,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: "1",
            margin: "0 auto",
            width: "calc(min(350px, 100vw)",
          }}
        >
          <div style={{ width: "95%" }}>
            <Grid
              guesses={guesses}
              guessLength={WORD_LENGTH}
              maxGuesses={MAX_GUESSES}
              wordTooShort={wordTooShort}
              currentGuess={currentGuess}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            width: "calc(min(500px, 95vw)",
          }}
        >
          <Keyboard handleKeyPress={handleKeyPress} />
        </div>
      </div>
    </div>
  );
}

export default App;
