import React from "react";

type Props = {
  letter: string;
};

const Key = (props: Props) => {
  const { letter } = props;
  return <button>{letter}</button>;
};

export default Key;
