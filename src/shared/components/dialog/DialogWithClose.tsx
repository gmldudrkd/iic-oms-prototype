"use clint";

import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

interface DialogWithCloseProps {
  isOpen: boolean;
  onClose: () => void;
  dialogTitle: string;
  dialogCalssName?: string;
  children: React.ReactNode;
}

export default function DialogWithClose({
  isOpen,
  onClose,
  dialogTitle,
  children,
  dialogCalssName,
}: DialogWithCloseProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        ".MuiPaper-elevation > .MuiToolbar-gutters": {
          backgroundColor: "#2196F3",
        },
      }}
    >
      <AppBar sx={{ position: "relative" }} className={dialogCalssName}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {dialogTitle}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
