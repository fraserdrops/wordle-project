import { BubbleChart } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  newRoundWithCustomWord,
  newRoundWithRandomWord,
  RoundFrequency,
  selectHardModeCanBeChanged,
  toggleHardMode,
  updateRoundFrequency,
} from "../features/game/gameSlice";
import {
  clearLocalStorage,
  toggleDarkMode,
  toggleHighContrastMode,
} from "../features/view/viewSlice";
import { WORD_LENGTH } from "../shared/constants";
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
      <Box sx={{ marginBottom: 2, marginTop: 2 }}>
        <SettingsDebugSection />
      </Box>
    </BaseDialog>
  );
}

type ToggleSectionProps = {
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

function SettingsDebugSection(props: {}) {
  const dispatch = useAppDispatch();
  const { roundFrequency } = useAppSelector((state) => state.gameState);
  const [customWord, setCustomWord] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomWord(event.target.value);
    if (error && event.target.value.split("").length === WORD_LENGTH) {
      setError(false);
    }
  };

  const handleSubmit = () => {
    if (customWord?.length !== WORD_LENGTH) {
      setError(true);
      return;
    }
    dispatch(newRoundWithCustomWord({ word: customWord.toUpperCase() }));
  };

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateRoundFrequency((event.target as HTMLInputElement).value as RoundFrequency));
  };

  return (
    <section>
      <h4>Debug</h4>
      <Button onClick={() => dispatch(clearLocalStorage())}>Clear storage</Button>
      <Button onClick={() => dispatch(newRoundWithRandomWord())}>Random Word</Button>
      <TextField
        error={error}
        id="outlined-error-helper-text"
        // label="Error"
        helperText={`Must be ${WORD_LENGTH} chars`}
        placeholder="Custom word"
        onChange={handleChange}
        value={customWord}
      />
      <Button onClick={handleSubmit}>Set custom word</Button>
      <FormControl sx={{ m: 3 }} variant="standard">
        <FormLabel component="legend">Round frequency</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={roundFrequency}
          onChange={handleFrequencyChange}
        >
          <FormControlLabel value="24hr" control={<Radio />} label="24hr" />
          <FormControlLabel value="1min" control={<Radio />} label="1min" />
        </RadioGroup>
      </FormControl>
    </section>
  );
}
