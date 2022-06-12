import { Box } from "@mui/material";
import * as React from "react";
import { HOST_REPO } from "../shared/constants";
import BaseDialog from "./BaseDialog";
import Tile from "./Tile";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function HelpDialog(props: Props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseDialog onClose={handleClose} open={open} title={"HOW TO PLAY"}>
      <section>
        <p style={{ marginTop: 0 }}>Guess the word in 6 tries.</p>
        <p>Each guess must be a valid five-letter word. Hit the enter button to submit.</p>
        <p>
          After each guess, the color of the tiles will change to show how close your guess was to
          the word.
        </p>
      </section>
      <section>
        <Box
          sx={{
            padding: "0 20px",
            xs: {
              padding: "0 10px",
            },
            maxWidth: 300,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", gap: 5, flexGrow: 1, position: "relative" }}>
            <Tile letter={"W"} status="correct" revealDelay={0} isRevealing />
            <Tile letter={"E"} status="unknown" revealDelay={0} />
            <Tile letter={"A"} status="unknown" revealDelay={0} />
            <Tile letter={"R"} status="unknown" revealDelay={0} />
            <Tile letter={"Y"} status="unknown" revealDelay={0} />
          </div>
        </Box>
        <p style={{ marginTop: 3 }}>The letter W is in the word and in the correct spot.</p>
      </section>
      <section>
        <Box
          sx={{
            padding: "0 20px",
            xs: {
              padding: "0 10px",
            },
            maxWidth: 300,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", gap: 5, flexGrow: 1, position: "relative" }}>
            <Tile letter="P" status="unknown" revealDelay={0} />
            <Tile letter="I" status="unknown" revealDelay={0} />
            <Tile letter="L" status="present" revealDelay={0} isRevealing />
            <Tile letter="O" status="unknown" revealDelay={0} />
            <Tile letter="T" status="unknown" revealDelay={0} />
          </div>
        </Box>
        <p style={{ marginTop: 3 }}>The letter L is in the word but in the wrong spot.</p>
      </section>
      <section>
        <Box
          sx={{
            padding: "0 20px",
            xs: {
              padding: "0 10px",
            },
            maxWidth: 300,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", gap: 5, flexGrow: 1, position: "relative" }}>
            <Tile letter="V" status="unknown" revealDelay={0} />
            <Tile letter="A" status="unknown" revealDelay={0} />
            <Tile letter="G" status="unknown" revealDelay={0} />
            <Tile letter="U" status="absent" revealDelay={0} isRevealing />
            <Tile letter="E" status="unknown" revealDelay={0} />
          </div>
        </Box>
        <p style={{ marginTop: 3 }}>The letter U is not in the word in any spot.</p>
      </section>
      <section>
        <p>
          This is an open-source clone of the Wordle game made for educational purposes.{" "}
          <a href="https://www.nytimes.com/games/wordle/index.html">Play the original</a>. This is
          the <a href={HOST_REPO}>React/Redux Toolkit implementation</a>.
        </p>
      </section>
    </BaseDialog>
  );
}
