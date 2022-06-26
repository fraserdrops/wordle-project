import { pure, send, sendParent } from "xstate/lib/actions";

export const createSwitchboard = (
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
      return sendParent({ ...event, type, origin: "view", ...args });
    }
    console.log("sending", { ...event, type, origin: "", ...args }, "to", target);

    return send({ ...event, type, origin: "", ...args }, { to: target });
  });
