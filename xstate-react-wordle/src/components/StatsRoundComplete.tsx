import { Button, Divider } from "@mui/material";
import React, { useContext } from "react";
import Countdown from "react-countdown";
import ShareIcon from "@mui/icons-material/Share";
import MessagePopup from "./MessagePopup";
import { ActorContext } from "../main";
import { useSelector } from "@xstate/react";
import ViewMachine from "../machines/ViewMachine";
import { StateFrom, StateValueFrom } from "xstate";

type Props = {};

const getTomorrow = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};

const selectShowCopiedToClipboard = (state: StateFrom<typeof ViewMachine>) => {
  return state.hasTag("showCopiedToClipboard");
};

const StatsRoundComplete = (props: Props) => {
  const actorContext = useContext(ActorContext);
  const showCopiedToClipboard = useSelector(actorContext.viewActorRef, selectShowCopiedToClipboard);
  const tomorrow = getTomorrow();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
        <h4 style={{ margin: 0 }}>Next Wordle</h4>
        <Countdown className="next-round-countdown" date={tomorrow.valueOf()} daysInHours />
      </div>

      <Divider orientation="vertical" flexItem />
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{ width: "70%" }}
          endIcon={<ShareIcon />}
          onClick={() => actorContext.viewActorRef.send({ type: "SHARE_RESULTS" })}
        >
          Share
        </Button>
        {showCopiedToClipboard && (
          <div
            style={{
              position: "absolute",
              bottom: -15,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 5,
            }}
          >
            <MessagePopup message={"Copied to clipboard"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsRoundComplete;
