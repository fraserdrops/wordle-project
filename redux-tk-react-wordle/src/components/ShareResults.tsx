import React from "react";
import { useAppDispatch } from "../app/hooks";
import { shareResults } from "../features/guesses/guessSlice";

type Props = {};

const ShareResult = (props: Props) => {
  const dispatch = useAppDispatch();
  return <button onClick={() => dispatch(shareResults())}>Share</button>;
};

export default ShareResult;
