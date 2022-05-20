import React from "react";
import { useAppDispatch } from "../app/hooks";
import { handleKeyPress } from "../features/game/gameSlice";
import KeyboardRow from "./KeyboardRow";

const rowKeyStrings = ["Q W E R T Y U I O P", "A S D F G H J K L", "ENTER Z X C V B N M DEL"];

type Props = {};

const Keyboard = (props: Props) => {
  const dispatch = useAppDispatch();
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
            handleKeyPress={(key: string) => dispatch(handleKeyPress({ key }))}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default Keyboard;
