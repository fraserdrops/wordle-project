import { useSelector } from "@xstate/react";
import { useContext } from "react";
import { selectLetterStatuses } from "../machines/GameMachine";
import { ActorContext } from "../main";
import KeyboardRow from "./KeyboardRow";

const rowKeyStrings = ["Q W E R T Y U I O P", "A S D F G H J K L", "ENTER Z X C V B N M DEL"];

type Props = {};

const Keyboard = (props: Props) => {
  const actorContext = useContext(ActorContext);
  const letterStatuses = useSelector(actorContext.gameActorRef, selectLetterStatuses);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      {rowKeyStrings.map((rowKeys, index) => {
        return (
          <KeyboardRow
            keys={rowKeys.split(" ")}
            padSides={index === 1}
            handleKeyPress={(key: string) =>
              actorContext.viewActorRef.send({ type: "KEY_PRESS", key })
            }
            key={index}
            letterStatuses={letterStatuses}
          />
        );
      })}
    </div>
  );
};

export default Keyboard;
