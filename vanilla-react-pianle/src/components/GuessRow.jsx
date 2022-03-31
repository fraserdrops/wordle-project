import React from "react";
import Tile from "./Tile";

const GuessRow = (props) => {
  const { guessLength, wordTooShort, guess } = props;
  let letters = [];
  console.log(guessLength);
  if (guess) {
    letters = guess;
  } else {
    for (let i = 0; i < guessLength; i++) {
      letters.push("");
    }
  }

  console.log(wordTooShort);
  return (
    <div
      style={{ display: "flex", gap: 5, flexGrow: 1, position: "relative" }}
      className={wordTooShort ? "word-too-short" : ""}
    >
      {wordTooShort && <WordTooShortPopup />}

      {letters.map((letter, index) => (
        <Tile letter={letter} key={index} />
      ))}
    </div>
  );
};

function WordTooShortPopup() {
  return (
    <div
      style={{
        position: "absolute",
        // top: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "black",
          color: "white",
          zIndex: 10,
          height: 30,
          borderRadius: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            padding: 5,
          }}
        >
          Word too short
        </p>
      </div>
    </div>
  );
}

export default GuessRow;
