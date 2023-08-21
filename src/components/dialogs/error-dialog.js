import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ArtisButton from "../buttons/button";

const ErrorDialog = props => {
  const { 
    open,
    handleClose,
    message 
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          textAlign: "center",
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          { message }
        </DialogTitle>
        <DialogActions>
          <ArtisButton
            name="Close"
            onClick={() => handleClose()}
            id="close"
            sx={{
              fontSize: "1.5rem",
            }}
            textColor="black"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ErrorDialog;