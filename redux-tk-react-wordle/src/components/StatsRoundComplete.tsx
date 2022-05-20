import { Button, Divider } from "@mui/material";
import React from "react";
import Countdown from "react-countdown";
import { shareResults } from "../features/view/viewSlice";
import ShareIcon from "@mui/icons-material/Share";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import MessagePopup from "./MessagePopup";

type Props = {};

const getTomorrow = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};

const StatsRoundComplete = (props: Props) => {
  const dispatch = useAppDispatch();
  const { showCopiedToClipboard } = useAppSelector((state) => state.viewState);
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
          onClick={() => dispatch(shareResults())}
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
