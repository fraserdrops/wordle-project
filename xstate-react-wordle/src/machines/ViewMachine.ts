import { assign, createMachine } from "xstate";

type ViewEventSchema =
  | { type: "SUBMIT_GUESS" }
  | { type: "DELETE_LETTER" }
  | { type: "ADD_LETTER_TO_GUESS"; letter: string }
  | { type: "INCORRECT_GUESS" }
  | { type: "CORRECT_GUESS" }
  | { type: "SHARE_RESULTS" };

type ViewContext = {};
const ViewMachine = createMachine(
  {
    tsTypes: {} as import("./ViewMachine.typegen").Typegen0,
    schema: {
      context: {} as ViewContext,
      events: {} as ViewEventSchema,
    },
    context: {},
    type: "parallel",
    states: {
      copiedToClipboard: {
        states: {
          visible: {
            tags: ["showCopiedToClipboard"],
          },
          hidden: {},
        },
      },
      round: {},
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
    actions: {},
    guards: {},
  }
);

export default ViewMachine;
