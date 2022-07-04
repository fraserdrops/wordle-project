import { pure, send, sendParent } from "xstate/lib/actions";

export const createSwitchboard = (
  id,
  makeWires: (
    ctx,
    event
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
