import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton } from "@mui/material";
import { Dialogs } from "../features/view/viewSlice";

type Props = {
  handleOpenDialog: (dialog: Dialogs) => void;
};

export default function HeaderBar(props: Props) {
  const { handleOpenDialog } = props;
  return (
    <div
      style={{
        height: "var(--header-bar-height)",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <div>
        <IconButton aria-label="help" onClick={() => handleOpenDialog("help")}>
          <HelpOutlineIcon />
        </IconButton>
        <IconButton
          aria-label="help"
          onClick={() =>
            window.location.assign(
              "https://github.com/fraserdrops/wordle-project/tree/pure/redux-tk-react-wordle"
            )
          }
        >
          <GitHubIcon />
        </IconButton>
      </div>
      <h2>Wordle Clone</h2>
      <div style={{ display: "flex" }}>
        <IconButton aria-label="stats" onClick={() => handleOpenDialog("stats")}>
          <BarChartIcon />
        </IconButton>
        <IconButton aria-label="settings" onClick={() => handleOpenDialog("settings")}>
          <SettingsIcon />
        </IconButton>
      </div>
    </div>
  );
}
