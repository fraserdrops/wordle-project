import { IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import * as React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export default function BaseDialog(props: Props) {
  const { title, onClose, open, children } = props;

  return (
    <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", paddingBottom: 1 }}>
        {title}{" "}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box
        sx={{
          padding: 3,
          s: {
            paddingLeft: 5,
            paddingRight: 5,
          },

          xs: {
            paddingLeft: 3,
            paddingRight: 3,
          },
          textAlign: "center",
        }}
      >
        {children}
      </Box>
    </Dialog>
  );
}
