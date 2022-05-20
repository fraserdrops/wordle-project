import { Box } from "@mui/material";
import * as React from "react";
import { useAppSelector } from "../app/hooks";
import { selectGameStats } from "../features/stats/statsSlice";
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
  const { gamesPlayed, winRatio, currentStreak, longestStreak, guessDistribution } =
    useAppSelector(selectGameStats);

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
