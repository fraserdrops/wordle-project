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

const DomainMachine = createMachine({
  context: {
    store: {},
    patches: {},
  },
  initial: "p1",
  states: {
    p1: {
      on: {
        NEXT: {
          target: "p2",
        },
        SUBMIT_GUESS: {
          target: "submittingGuess",
        },
        ADD_LETTER_TO_GUESS: {
          actions: [
            assign({
              patches: (ctx, event, b) => {
                // updateFraser("steve");
                console.log("adding letter to guess", event.letter);
                return addLetterToGuess(ctx.store, event.letter);
                // return "p1";
              },
            }),
          ],
        },
        START_RACE: {
          cond: (ctx, event, meta) => {
            console.log("meat", meta);
            // return true;
            return ctx.store.fraser === "cool";
          },
          // cond: () =>
          actions: [
            assign({
              patches: (ctx, event, b) => {
                // updateFraser("steve");
                console.log("ASSIGNING", b);

                return updateFraserPatches("steve");
                // return "p1";
              },
            }),
            (ctx, event, meta) => updateFraser("steve"),
            (ctx, event, b) => console.log("yoza", event, b),
          ],
        },
      },
    },
    p2: {
      on: {
        NEXT: {
          target: "p3",
        },
      },
    },
    p3: {},
    submittingGuess: {},
    addLetter: {},
  },
});

export default DomainMachine;
