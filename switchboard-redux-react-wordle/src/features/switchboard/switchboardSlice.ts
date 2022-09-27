import { createSlice } from "@reduxjs/toolkit";
import { interpret, Interpreter } from "xstate";
import { AppDispatch, GetState } from "../../app/store";
import AppMachine, { AppEventSchema } from "../../machines/AppMachine";
import { inspect } from "@xstate/inspect";

inspect({
  // options
  // url: 'https://stately.ai/viz?inspect', // (default)
  iframe: false, // open in new window
});

const service = interpret(AppMachine, { devTools: true }).onTransition((state) => {
  console.log(state.value);
});

service.start();

interface SwitchboardSlice {
  appComponent: typeof service;
}

const initialState: SwitchboardSlice = {
  appComponent: service,
};

export const switchboardSlice = createSlice({
  name: "switchboard",
  initialState: initialState,
  reducers: {
    updateStats: () => {},
  },
});

export default switchboardSlice.reducer;

export const appSend =
  (event: AppEventSchema) => async (dispatch: AppDispatch, getState: GetState) => {
    const { appComponent } = getState().switchboardState;
    console.log("SEND EVENT", event, appComponent);
    appComponent.send(event);
  };
