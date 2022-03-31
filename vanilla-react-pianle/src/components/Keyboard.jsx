import React from "react";
import * as Tone from "tone";

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
async function key(url) {
  await Tone.start();
  new Audio(url).play();
  // synth.triggerAttackRelease("C4", "8n");
}

function Keyboard(props) {
  const sampler = new Tone.Sampler({
    urls: {
      C4: "C4.mp3",
      "D#4": "Ds4.mp3",
      "F#4": "Fs4.mp3",
      A4: "A4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination();

  Tone.loaded().then(() => {
    sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
  });

  const blackNotes2 = ["Db", "Eb"];
  const blackNotes3 = ["Gb", "Ab", "Bb"];
  const blackNotes = [...blackNotes2, ...blackNotes3];

  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];

  const isWhiteNote = (note) => {
    return whiteNotes.includes(note);
  };

  const isBlackEndGroupNote = (note) => {
    return note === blackNotes2[1] || note === blackNotes3[2];
  };
  const getNextNote = (note) => {
    const nextKeyMap = {
      C: "Db",
      Db: "D",
      D: "Eb",
      Eb: "E",
      E: "F",
      F: "Gb",
      Gb: "G",
      G: "Ab",
      Ab: "A",
      A: "Bb",
      Bb: "B",
      B: "C",
    };

    return nextKeyMap[note];
  };

  const groupKeys = (keys) => {
    const whiteKeys = [];
    const blackKeys = [];
    let blackGroup = [];
    keys.forEach((key) => {
      const { note } = key;
      if (isWhiteNote(note)) {
        whiteKeys.push(key);
      } else {
        blackGroup.push(key);
        if (isBlackEndGroupNote(note)) {
          blackKeys.push(blackGroup);
          blackGroup = [];
        }
      }
    });
  };

  const getNextKey = (key) => {
    const { note, octave } = key;
    const nextNote = getNextNote(note);
    let nextOctave = octave;
    if (nextNote === "C") {
      // C is the start of the next octave
      nextOctave += 1;
    }

    return { note: nextNote, octave: nextOctave };
  };

  const keysAreEqual = (keyA, keyB) => {
    return keyA.note === keyB.note && keyA.octave === keyB.octave;
  };

  const generateKeys = (lowerKey, upperKey) => {
    let keys = [lowerKey];
    let currentKey = lowerKey;
    while (!keysAreEqual(currentKey, upperKey)) {
      currentKey = getNextKey(currentKey);
      keys.push(currentKey);
    }
    return keys;
  };

  console.log(generateKeys({ note: "C", octave: 4 }, { note: "B", octave: 5 }));

  return (
    <div class="harmonium">
      <div class="white-keys">
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
        <WhiteKey />
      </div>
      <div class="black-keys">
        <div class="keys-2">
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-3">
          <BlackKey />
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-2">
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-3">
          <BlackKey />
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-2">
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-3">
          <BlackKey />
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-2">
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-3">
          <BlackKey />
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-2">
          <BlackKey />
          <BlackKey />
        </div>
        <div class="keys-3">
          <BlackKey />
          <BlackKey />
          <BlackKey />
        </div>
      </div>
    </div>
  );
}

function WhiteKey() {
  return (
    <div
      class="white"
      onMouseDown={() => key("https://barrycap.com/sounds/.wav")}
    />
  );
}

function BlackKey() {
  return (
    <div
      class="black"
      onMouseDown={() => key("https://barrycap.com/sounds/.wav")}
    />
  );
}

export default Keyboard;
