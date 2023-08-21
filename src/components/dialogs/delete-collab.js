import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ArtisButton from "../buttons/button";

const AddCollabDialog = props => {
  const { handleClose, open, deleteWorkAndCollab } = props;
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
        Delete this unregistered work?
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
            name="Delete"
            type="submit"
            onClick={deleteWorkAndCollab}
            id="deleteWork"
            sx={{
              fontSize: "1.5rem",
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddCollabDialog
