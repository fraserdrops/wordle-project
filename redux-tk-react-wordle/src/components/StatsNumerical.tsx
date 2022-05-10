import React from "react";

type Props = {
  gamesPlayed: number;
  winPercentage: number;
  currentWinStreak: number;
  largestWinStreak: number;
};

const StatsNumerical = (props: Props) => {
  const { gamesPlayed, winPercentage, currentWinStreak, largestWinStreak } = props;
  return (
    <div style={{ display: "flex" }}>
      <StatsNumericalItem stat={gamesPlayed} label="Played" />
      <StatsNumericalItem stat={winPercentage * 100} label="Win %" />
      <StatsNumericalItem stat={currentWinStreak} label="Current Streak" />
      <StatsNumericalItem stat={largestWinStreak} label="Max Streak" />
    </div>
  );
};

export default StatsNumerical;

type StatsItemProps = {
  stat: number;
  label: string;
};

function StatsNumericalItem(props: StatsItemProps) {
  const { stat, label } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ fontSize: 36 }}>{stat}</div>
      <div style={{ fontSize: 12 }}>{label}</div>
    </div>
  );
}
