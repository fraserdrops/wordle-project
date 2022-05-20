import { Box, Divider, FormControlLabel, FormGroup, Switch } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectHardModeCanBeChanged, toggleHardMode } from "../features/game/gameSlice";
import { toggleDarkMode, toggleHighContrastMode } from "../features/view/viewSlice";
import BaseDialog from "./BaseDialog";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsDialog(props: Props) {
  const { onClose, open } = props;
  const { hardMode } = useAppSelector((state) => state.gameState);
  const { darkMode, highContrastMode } = useAppSelector((state) => state.viewState);
  const dispatch = useAppDispatch();
  const hardModeCanBeChanged = useAppSelector(selectHardModeCanBeChanged);

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseDialog onClose={handleClose} open={open} title={"SETTINGS"}>
      <Box sx={{ marginBottom: 2 }}>
        <SettingsToggleSection
          label="Hard Mode"
          details={
            hardModeCanBeChanged
              ? "Any revealed hints must be used in subsequent guesses"
              : "Hard mode can only be enabled at the start of a round"
          }
          checked={hardMode}
          handleChange={() => dispatch(toggleHardMode())}
          disabled={!hardModeCanBeChanged}
        />
      </Box>
      <Divider variant="middle" />
      <Box sx={{ marginBottom: 2, marginTop: 2 }}>
        <SettingsToggleSection
          label="Dark Mode"
          details=""
          checked={darkMode}
          handleChange={() => dispatch(toggleDarkMode())}
        />
      </Box>
      <Divider variant="middle" />
      <Box sx={{ marginBottom: 2, marginTop: 2 }}>
        <SettingsToggleSection
          label="High Contrast Mode"
          details="For improved color vision"
          checked={highContrastMode}
          handleChange={() => dispatch(toggleHighContrastMode())}
        />
      </Box>
    </BaseDialog>
  );
}

type ToggleSectionProps = {
  // open: boolean;
  // onClose: () => void;
  label: string;
  details: string;
  checked: boolean;
  disabled?: boolean;
  handleChange: (isChecked: boolean) => void;
};

function SettingsToggleSection(props: ToggleSectionProps) {
  const { label, details, checked, handleChange, disabled } = props;

  return (
    <section>
      <div>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                disabled={disabled}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(event.target.checked);
                }}
              />
            }
            label={label}
          />
        </FormGroup>
        <p style={{ margin: 0, textAlign: "left", fontSize: 14 }}>{details}</p>
      </div>
    </section>
  );
}
