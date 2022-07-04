import { assign, createMachine } from "xstate";

type ToggleEventSchema = { type: "CHANGE_ACTIVE_VAL"; val: string };

const makeCreateEnumMachine = ({ vals, initial }: { vals: Array<string>; initial: string }) => {
  const changeHandler = vals.map((val) => ({
    cond: (ctx: {}, event: ToggleEventSchema) => {
      return event.val === val;
    },
    target: val,
  }));

  const states = vals.reduce((acc, val) => {
    acc[val] = {};
    return acc;
  }, {} as Record<string, {}>);

  return createMachine(
    {
      tsTypes: {} as import("./EnumMachine.typegen").Typegen0,
      schema: {
        events: {} as ToggleEventSchema,
      },
      context: {},
      initial,
      on: {
        CHANGE_ACTIVE_VAL: changeHandler,
      },
      states,
    },
    {
      actions: {},
      guards: {},
    }
  );
};

export default makeCreateEnumMachine;
