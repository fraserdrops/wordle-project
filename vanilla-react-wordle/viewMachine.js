import { actions, assign, createMachine, sendParent } from "xstate";
import { produceWithPatches, enablePatches } from "immer";
const { choose, raise } = actions;

const store = {
  fraser: "cool",
};

const updateFraser = (payload) => {
  console.log("updateing Fraser");
  store.fraser = payload;
};

const updateFraserPatches = (payload) => {
  const [nextState, patches, inversePatches] = produceWithPatches(
    store,
    (draft) => {
      draft.fraser = payload;
    }
  );

  return patches;
};

const addLetterToGuess = (store, letter) => {
  const [nextState, patches, inversePatches] = produceWithPatches(
    store,
    (draft) => {
      draft.extended.currentGuess.push(letter);
    }
  );

  return patches;
};

const ViewMachine = createMachine({
  context: {
    store: {},
    patches: {},
  },
  initial: "game",
  states: {
    game: {
      states: {},
      on: {
        ADD_LETTER_TO_GUESS: {
          actions: [
            assign({
              patches: (ctx, event, b) => {
                // updateFraser("steve");
                console.log("adding letter to guess", event.letter, ctx);
                return addLetterToGuess(ctx.store, event.letter);
                // return "p1";
              },
            }),
          ],
        },
      },
    },
    settings: {
      on: {},
    },
  },
});

export default ViewMachine;
