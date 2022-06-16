import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { createContext } from "react";
import { useInterpret } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import ViewMachine from "./machines/ViewMachine";
import GameMachine from "./machines/GameMachine";

interface ActorContextType {
  viewActorRef: ActorRefFrom<typeof ViewMachine>;
  gameActorRef: ActorRefFrom<typeof GameMachine>;
}

export const ActorContext = createContext(
  // Typed this way to avoid TS errors,
  // looks odd I know
  {} as ActorContextType
);

export const ViewActorProvider = (props: { children: React.ReactNode }) => {
  const viewActorRef = useInterpret(ViewMachine);
  const gameActorRef = useInterpret(GameMachine);

  return (
    <ActorContext.Provider value={{ viewActorRef, gameActorRef }}>
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
