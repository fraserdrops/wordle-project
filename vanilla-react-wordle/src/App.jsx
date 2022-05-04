import { useState, useEffect, useReducer } from "react";
import "./App.css";
import Grid from "./components/Grid";
import HeaderBar from "./components/HeaderBar";
import Keyboard from "./components/Keyboard";
import produce, { enablePatches, applyPatches } from "immer";
import DomainMachine from "./machine";

enablePatches();

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
      stateNode: DomainMachine.initialState,
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

function model(state, event) {
  switch (event.type) {
    case "UPDATE_STATE": {
      return event.newState;
    }

    default: {
      return state;
    }
  }
}

// takes the current app state and the view event, and returns a domain event
// view states:
// - game
//  - regular
//  - wordToShort
//  - revealing words
// - settings
// - info
function viewController(state, viewEvent) {
  const { finite, extended } = state;
  let domainEvent = undefined;

  const nextState = produce(state, (draft) => {
    switch (finite.view.value) {
      case "game": {
        switch (viewEvent.type) {
          case "KEY_EVENT": {
            if (viewEvent.keyValue === "Enter") {
              domainEvent = { type: "SUBMIT_GUESS" };
            } else if (viewEvent.keyValue === "Delete") {
              domainEvent = { type: "DELETE_LETTER" };
            } else {
              domainEvent = {
                type: "ADD_LETTER_TO_GUESS",
                letter: viewEvent.keyValue,
              };
            }

            break;
          }

          case "OPEN_SETTINGS": {
            draft.finite.value = "settings";
            break;
          }
          default: {
          }
        }
        break;
      }
      case "wordTooShort": {
        // block all user actions? or just key events?
        // lets just block all actions for now
        break;
      }
      default: {
      }
    }
  });

  return [nextState, domainEvent];
}

// core states:
// - game
//  - regular
//  - wordToShort
//  - revealing words
// - settings
// - info
function domainController(state, event) {
  const { finite, extended } = state;
  console.log("domain machine", DomainMachine, DomainMachine.initialState);
  const current = finite.core.stateNode || DomainMachine.initialState;
  current.context.store = state;
  current.context.patches = [];
  const nextStateNode = DomainMachine.transition(finite.core.stateNode, event);
  const nextState = applyPatches(state, nextStateNode.context.patches);
  console.log("nextState", nextState);

  // const nextState = produce(state, (draft) => {
  //   draft.finite.core.stateNode = next;

  //   const { currentGuess } = extended;
  //   switch (event.type) {
  //     case "SUBMIT_GUESS": {
  //       // too short?
  //       // else check word'
  //       // guess correct / incorrect
  //       return;
  //     }
  //     case "DELETE_LETTER": {
  //       draft.extended.currentGuess.splice(
  //         0,
  //         draft.extended.currentGuess.length - 1
  //       );
  //       break;
  //     }
  //     case "ADD_LETTER_TO_GUESS": {
  //       if (currentGuess.length < WORD_LENGTH) {
  //         draft.extended.currentGuess.push(event.letter);
  //       }
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // });
  return [nextState];
}

const createController = (sendToModel) => (state, event) => {
  const viewEvent = event;
  console.log(viewEvent);
  const [stateWithViewUpdates, domainEvent] = viewController(state, event);
  console.log("DOMAIN EVENT", domainEvent);
  console.log("stateWithViewUpdates", stateWithViewUpdates);
  if (domainEvent) {
    const [newState] = domainController(stateWithViewUpdates, domainEvent);
    sendToModel({ type: "UPDATE_STATE", newState });
  } else {
    sendToModel({ type: "UPDATE_STATE" });
  }
};

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
function App() {
  const [correct, setCorrect] = useState(false);
  const [modelState, modelSend] = useReducer(model, initialState);
  const { currentGuess, guesses, wordTooShort } = modelState.extended;
  const controller = createController(modelSend);
  const handleKeyPress = (keyValue) => {
    // send({ type: "KEY_EVENT", keyValue });
    controller(modelState, { type: "KEY_EVENT", keyValue });
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
