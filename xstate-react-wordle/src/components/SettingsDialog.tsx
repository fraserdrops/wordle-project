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
import { useActor, useSelector } from "@xstate/react";
import * as React from "react";
import { StateFrom } from "xstate";
import { RoundFrequency, selectHardModeCanBeChanged } from "../machines/GameMachine";
import { ActorContext } from "../main";
import { WORD_LENGTH } from "../shared/constants";
import BaseDialog from "./BaseDialog";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsDialog(props: Props) {
  const { onClose, open } = props;
  const actorContext = React.useContext(ActorContext);
  const hardModeCanBeChanged = useSelector(actorContext.gameActorRef, selectHardModeCanBeChanged);
  const [viewState, viewSend] = useActor(actorContext.viewActorRef);
  const [gameState, gameSend] = useActor(actorContext.gameActorRef);

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
          checked={gameState.hasTag("hardMode")}
          handleChange={() => gameSend({ type: "TOGGLE_HARD_MODE" })}
          disabled={!hardModeCanBeChanged}
        />
      </Box>
      <Divider variant="middle" />
      <Box sx={{ marginBottom: 2, marginTop: 2 }}>
        <SettingsToggleSection
          label="Dark Mode"
          details=""
          checked={viewState.hasTag("darkMode")}
          handleChange={() => viewSend({ type: "TOGGLE_DARK_MODE" })}
        />
      </Box>
      <Divider variant="middle" />
      <Box sx={{ marginBottom: 2, marginTop: 2 }}>
        <SettingsToggleSection
          label="High Contrast Mode"
          details="For improved color vision"
          checked={viewState.hasTag("highContrastMode")}
          handleChange={() => viewSend({ type: "TOGGLE_HIGH_CONTRAST_MODE" })}
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
  const actorContext = React.useContext(ActorContext);
  const [gameState, gameSend] = useActor(actorContext.gameActorRef);
  const [viewState, viewSend] = useActor(actorContext.viewActorRef);
  const { roundFrequency } = gameState.context;
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
    gameSend({ type: "NEW_ROUND_CUSTOM_WORD", word: customWord.toUpperCase() });
  };

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    gameSend({
      type: "UPDATE_ROUND_FREQUENCY",
      roundFrequency: (event.target as HTMLInputElement).value as RoundFrequency,
    });
  };

  return (
    <section>
      <h4>Debug</h4>
      <Button
        onClick={() => {
          gameSend({ type: "CLEAR_LOCAL_STORAGE" });
          viewSend({ type: "CLEAR_LOCAL_STORAGE" });
        }}
      >
        Clear storage
      </Button>
      <Button onClick={() => gameSend({ type: "NEW_ROUND_RANDOM_WORD" })}>Random Word</Button>
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
