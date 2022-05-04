import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Counter } from "./features/counter/Counter";
import HeaderBar from "./components/HeaderBar";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <HeaderBar />
      {/* {correct && <p>You are correct!</p>} */}
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
            // guesses={guesses}
            // guessLength={WORD_LENGTH}
            // maxGuesses={MAX_GUESSES}
            // wordTooShort={wordTooShort}
            // currentGuess={currentGuess}
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
          <Keyboard />
        </div>
      </div>
    </div>
  );
}

export default App;
