import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Dialogs = "stats" | "help" | "settings";

type ViewState = {
  openDialog: Dialogs | false;
};
const initialState: ViewState = {
  openDialog: false,
};

export const viewSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setOpenDialog: (state, action: PayloadAction<{ dialog: Dialogs }>) => {
      state.openDialog = action.payload.dialog;
    },
    closeDialog: (state) => {
      state.openDialog = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOpenDialog, closeDialog } = viewSlice.actions;

export default viewSlice.reducer;
