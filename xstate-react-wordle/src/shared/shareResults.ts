import { Guess, LetterStatus } from "../features/game/gameSlice";
import { MAX_GUESSES } from "./constants";

export const shareStatus = (
  guessStatuses: Array<Array<LetterStatus>>,
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  wordIndex: number,
  handleShareToClipboard: () => void
) => {
  const emojiGrid = generateEmojiGrid(guessStatuses, isDarkMode, isHighContrastMode);
  const textToShare =
    `Testle ${wordIndex} ${lost ? "X" : guessStatuses.length}/${MAX_GUESSES}${
      isHardMode ? "*" : ""
    }\n\n` + emojiGrid;

  const shareData = { text: textToShare };

  let shareSuccess = false;

  // try {
  //   if (attemptShare(shareData)) {
  //     navigator.share(shareData);
  //     shareSuccess = true;
  //   }
  // } catch (error) {
  //   shareSuccess = false;
  // }

  // if (!shareSuccess) {
  navigator.clipboard.writeText(textToShare);
  handleShareToClipboard();
  // }
};

export const generateEmojiGrid = (
  guessStatuses: Array<Array<LetterStatus>>,
  isDarkMode: boolean,
  isHighContrastMode: boolean
) => {
  return guessStatuses
    .map((singleGuessStatuses) => {
      return singleGuessStatuses
        .map((status) => {
          switch (status) {
            case "correct":
              return isHighContrastMode ? "🟧" : "🟩";
            case "present":
              return isHighContrastMode ? "🟦" : "🟨";
            default:
              return isDarkMode ? "⬛" : "⬜";
          }
        })
        .join("");
    })
    .join("\n");
};

const attemptShare = (shareData: object) => {
  return navigator.canShare && navigator.canShare(shareData) && navigator.share;
};
