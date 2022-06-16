import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton } from "@mui/material";
import { Dialogs } from "../machines/ViewMachine";
import { HOST_REPO } from "../shared/constants";

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
        <IconButton aria-label="help" onClick={() => window.location.assign(HOST_REPO)}>
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
