import { Box } from "@mui/material";
import * as React from "react";
import BaseDialog from "./BaseDialog";
import StatsChart from "./StatsChart";
import StatsNumerical from "./StatsNumerical";
import Tile from "./Tile";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function StatsDialog(props: Props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const gamesPlayed = 20;
  const winPercentage = 0.75;
  const currentWinStreak = 5;
  const largestWinStreak = 10;

  const guessDistribution = [1, 1, 0, 3, 5, 10];

  return (
    <BaseDialog onClose={handleClose} open={open} title={"STATISTICS"}>
      <section>
        <StatsNumerical {...{ gamesPlayed, winPercentage, currentWinStreak, largestWinStreak }} />
      </section>
      <section>
        <h4>Guess Distribution</h4>
        <StatsChart guessDistribution={guessDistribution} />
      </section>
    </BaseDialog>
  );
}
