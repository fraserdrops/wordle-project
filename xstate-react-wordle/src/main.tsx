import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { createContext } from "react";
import { useInterpret, useSelector } from "@xstate/react";
import { ActorRefFrom, StateFrom } from "xstate";
import ViewMachine from "./machines/ViewMachine";
import GameMachine from "./machines/GameMachine";
import StatsMachine from "./machines/StatsMachine";
import AppMachine from "./machines/AppMachine";

interface ActorContextType {
  viewActorRef: ActorRefFrom<typeof ViewMachine>;
  gameActorRef: ActorRefFrom<typeof GameMachine>;
  statsActorRef: ActorRefFrom<typeof StatsMachine>;
  appActorRef: ActorRefFrom<typeof AppMachine>;
}

export const ActorContext = createContext(
  // Typed this way to avoid TS errors,
  // looks odd I know
  {} as ActorContextType
);

const makeSelectActorRef = (key: string) => (state: StateFrom<typeof AppMachine>) => {
  return state.children[key];
};

export const ViewActorProvider = (props: { children: React.ReactNode }) => {
  const appActorRef = useInterpret(AppMachine);

  const viewActorRef = useSelector(appActorRef, makeSelectActorRef("view"));
  const gameActorRef = useSelector(appActorRef, makeSelectActorRef("game"));
  const statsActorRef = useInterpret(StatsMachine);

  return (
    <ActorContext.Provider value={{ viewActorRef, gameActorRef, statsActorRef, appActorRef }}>
      {props.children}
    </ActorContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ViewActorProvider>
    <App />
  </ViewActorProvider>
  // </React.StrictMode>
);
