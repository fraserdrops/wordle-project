import { useState, useEffect } from "react";
import logo from "./logo.svg";
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

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
function App() {
  const [targetWord] = useState("HEART");
  const [count, setCount] = useState(0);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [wordTooShort, setWordTooShort] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleKeyPress = (keyValue) => {
    console.log("current guess", currentGuess);
    if (wordTooShort) {
      // do nothing while we are animating
      return;
    }

    if (keyValue === "Enter") {
      console.log(currentGuess.length);
      if (currentGuess.length === WORD_LENGTH) {
        // submit
        if (currentGuess.join("") === targetWord) {
          // correct
          setCorrect(true);
        } else {
          // incorrect
          if (guesses.length + 1 === MAX_GUESSES) {
            // game over
          }
        }

        setGuesses((guesses) => [...guesses, currentGuess]);
        // setCurrentGuess([]);
      } else {
        // too short
        setWordTooShort(true);
        setTimeout(() => {
          setWordTooShort(false);
        }, 1000);
      }
    } else if (keyValue === "Delete") {
      if (currentGuess.length > 0) {
        setCurrentGuess((guess) => {
          const newGuess = [...guess];
          return [...newGuess.splice(0, guess.length - 1)];
        });
      }
    } else if (isLetter(keyValue)) {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((guess) => [
          ...guess,
          getKeyDisplayFromKeyValue(keyValue),
        ]);
      }
    }
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
