import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ArtisButton from "../buttons/button";

const ConfirmCollabDialog = props => {
  const { handleClose, open, onAccept, approveText = "approve" } = props;
    const closeModal = () => {
        handleClose()
    }
  return (
    <div>
      <Dialog
        open={open}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          textAlign: "center",
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
        {`Do you want to ${approveText} this collaboration?`}
        </DialogTitle>
        <DialogActions>
          <ArtisButton
            name="Cancel"
            onClick={closeModal}
            id="cancel"
            sx={{
              fontSize: "1.5rem",
            }}
            textColor="black"
          />
          <ArtisButton
            name="Confirm"
            type="submit"
            onClick={onAccept}
            id="approveRejectApproval"
            sx={{
              fontSize: "1.5rem",
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmCollabDialog
