import { Box } from "@mui/material";
import { useActor, useSelector } from "@xstate/react";
import * as React from "react";
import { selectGameStats } from "../machines/StatsMachine";
import { ActorContext } from "../main";
import BaseDialog from "./BaseDialog";
import StatsChart from "./StatsChart";
import StatsNumerical from "./StatsNumerical";
import StatsRoundComplete from "./StatsRoundComplete";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function StatsDialog(props: Props) {
  const { onClose, open } = props;
  const actorContext = React.useContext(ActorContext);
  const { gamesPlayed, winRatio, currentStreak, longestStreak, guessDistribution } = useSelector(
    actorContext.statsActorRef,
    selectGameStats
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseDialog onClose={handleClose} open={open} title={"STATISTICS"}>
      <section>
        <StatsNumerical {...{ gamesPlayed, winRatio, currentStreak, longestStreak }} />
      </section>
      <section>
        <h4>Guess Distribution</h4>
        <StatsChart guessDistribution={guessDistribution} />
      </section>
      <Box sx={{ marginBottom: 2 }} />
      <section>
        <StatsRoundComplete />
      </section>
    </BaseDialog>
  );
}
