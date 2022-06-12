import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { createContext } from "react";
import { useInterpret } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import ViewMachine from "./machines/ViewMachine";

interface ViewActorContextType {
  viewActorRef: ActorRefFrom<typeof ViewMachine>;
}

export const ViewActorContext = createContext(
  // Typed this way to avoid TS errors,
  // looks odd I know
  {} as ViewActorContextType
);

export const ViewActorProvider = (props: { children: React.ReactNode }) => {
  const viewActorRef = useInterpret(ViewMachine);

  return (
    <ViewActorContext.Provider value={{ viewActorRef }}>{props.children}</ViewActorContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ViewActorProvider>
    <App />
  </ViewActorProvider>
  // </React.StrictMode>
);
