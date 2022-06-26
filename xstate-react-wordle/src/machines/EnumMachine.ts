import { assign, createMachine } from "xstate";

type ToggleEventSchema = { type: "CHANGE_ACTIVE_VAL"; val: string };

const makeCreateEnumMachine = ({ vals, initial }: { vals: Array<string>; initial: string }) => {
  const changeHandler = vals.map((val) => ({
    cond: (ctx: {}, event: ToggleEventSchema) => {
      console.log(val, event.val);
      return event.val === val;
    },
    target: val,
  }));

  const change = [
    {
      cond: (ctx: {}, event: ToggleEventSchema) => {
        console.log("settings", event.val);
        return event.val === "settings";
      },
      target: "settings",
    },
  ];
  const states = vals.reduce((acc, val) => {
    acc[val] = {};
    return acc;
  }, {} as Record<string, {}>);
  console.log(states);
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
