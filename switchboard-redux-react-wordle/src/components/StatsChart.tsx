import React from "react";

type Props = {
  guessDistribution: Array<number>;
};

const StatsChart = (props: Props) => {
  const { guessDistribution } = props;
  const maxGuessCount = Math.max(...guessDistribution);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {guessDistribution.map((guessCount, guessIndex) => {
        return (
          <StatsChartItem
            key={guessIndex + 1}
            numGuesses={guessIndex + 1}
            barPercentage={guessCount / maxGuessCount}
            guessCount={guessCount}
          />
        );
      })}
      <div></div>
    </div>
  );
};

export default StatsChart;

type StatsItemProps = {
  numGuesses: number;
  guessCount: number;
  barPercentage: number;
};

function StatsChartItem(props: StatsItemProps) {
  const { numGuesses, barPercentage, guessCount } = props;
  const barWidthPercentage = Boolean(barPercentage) ? Math.max(barPercentage * 100, 5) : 5;
  const labelRightPosition = 5;
  return (
    <div style={{ display: "flex", position: "relative", gap: 5 }}>
      <div>{numGuesses}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            width: `max(20px, ${barWidthPercentage + "%"})`,
            position: "relative",
            background: guessCount > 0 ? "#787c7e" : "grey",
            height: "100%",
            color: "white",
            lineHeight: "20px",
          }}
        >
          <div style={{ position: "absolute", right: labelRightPosition }}>{guessCount}</div>
        </div>
      </div>
    </div>
  );
}

type StatsChartBarProps = {
  percentage: number;
  label: string;
};

function StatsChartBar(props: StatsChartBarProps) {}
