import React from "react";

type Props = {
  gamesPlayed: number;
  winRatio: number;
  currentStreak: number;
  longestStreak: number;
};

export default function StatsNumerical(props: Props) {
  const { gamesPlayed, winRatio, currentStreak, longestStreak } = props;
  return (
    <div style={{ display: "flex" }}>
      <StatsNumericalItem stat={gamesPlayed} label="Played" />
      <StatsNumericalItem stat={Math.round(winRatio * 100)} label="Win %" />
      <StatsNumericalItem stat={currentStreak} label="Current Streak" />
      <StatsNumericalItem stat={longestStreak} label="Max Streak" />
    </div>
  );
}

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
