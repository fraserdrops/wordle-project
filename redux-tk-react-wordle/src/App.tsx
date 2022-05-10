import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Counter } from "./features/counter/Counter";
import HeaderBar from "./components/HeaderBar";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { handleKeyPress } from "./features/guesses/guessSlice";
import ShareResult from "./components/ShareResults";
import StatsDialog from "./components/StatsDialog";
import HelpDialog from "./components/HelpDialog";

export type Dialogs = "stats" | "help" | "settings";

function App() {
  const dispatch = useAppDispatch();
  const { correct } = useAppSelector((state) => state.appState);

  const [dialogOpen, setDialogOpen] = useState<Dialogs | false>(false);

  const handleOpenDialog = (dialogToOpen: "stats" | "help" | "settings") => {
    setDialogOpen(dialogToOpen);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => dispatch(handleKeyPress({ key: e.key }));

    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  return (
    <div className="App">
      <HeaderBar {...{ handleOpenDialog, handleCloseDialog }} />
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
            marginBottom: 10,
          }}
        >
          <Keyboard />
        </div>
        <ShareResult />
      </div>
      <HelpDialog open={dialogOpen === "help"} onClose={handleCloseDialog} />
      <StatsDialog open={dialogOpen === "stats"} onClose={handleCloseDialog} />
    </div>
  );
}

export default App;
