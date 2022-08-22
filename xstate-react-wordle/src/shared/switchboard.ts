import { AnyStateMachine, createMachine, StateMachine } from "xstate";
import { pure, send, sendParent } from "xstate/lib/actions";

export const createSwitchboard = (
  id: string,
  makeWires: (
    ctx: any,
    event: any
  ) => Record<string, Record<string, { target: string; type: string; args?: {} }>>
) =>
  pure((ctx, event: { type: string; origin?: string }) => {
    const wires = makeWires(ctx, event);
    const { origin = "" } = event;
    const { target, type, args = {} } = wires[origin][event.type] ?? wires[origin]["*"];

    if (target === "out") {
      console.log("switchboard out", id, event);

      return sendParent({ ...event, type, origin: id, ...args });
    }

    console.log("switchboard to", id, target, event);

    return send({ ...event, type, origin: "", ...args }, { to: target });
  });

type Components = Array<{ id: string; src: AnyStateMachine }>;
type InvokedServices = Array<{ id: string; src: AnyStateMachine }>;

export const createCompoundComponent = ({
  id,
  components,
  makeWires,
}: {
  id: string;
  components: Components;
  makeWires: (
    ctx: any,
    event: any
  ) => Record<string, Record<string, { target: string; type: string; args?: {} }>>;
}): AnyStateMachine => {
  const servicesToInvoke = mapComponentsToInvoked(components);
  return createMachine(
    {
      id,
      tsTypes: {} as import("./switchboard.typegen").Typegen0,
      on: {
        "*": {
          actions: ["switchboard"],
        },
      },
      invoke: servicesToInvoke,
    },
    {
      actions: {
        // @ts-ignore
        switchboard: createSwitchboard(id, makeWires),
      },
    }
  );
};

function mapComponentsToInvoked(components: Components): InvokedServices {
  return components;
}
