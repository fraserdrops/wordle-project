import React from "react";

type Props = {
  letter: string;
};

const Tile = (props: Props) => {
  const { letter } = props;
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        border: "2px solid #d3d6da",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "36px",
        fontWeight: "600",
      }}
    >
      {letter}
    </div>
  );
};

export default Tile;
