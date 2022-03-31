import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Keyboard from "./components/Keyboard";
import Grid from "./components/Grid";
import HeaderBar from "./components/HeaderBar";

const WORD_LENGTH = 4;
const MAX_GUESSES = 6;

function App() {
  const [targetWord] = useState("HEART");
  const [count, setCount] = useState(0);
  const [currentGuess, setCurrentGuess] = useState(["C", "E", "G", "Eb"]);
  const [guesses, setGuesses] = useState([]);
  const [wordTooShort, setWordTooShort] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [correct, setCorrect] = useState(false);
  const handleKeyPress = (key) => {};

  return (
    <div className="App">
      <HeaderBar />
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
          {/* <div style={{ width: "95%" }}> */}
          <Grid
            guesses={guesses}
            guessLength={WORD_LENGTH}
            maxGuesses={MAX_GUESSES}
            wordTooShort={wordTooShort}
            currentGuess={currentGuess}
          />
          {/* </div> */}
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
