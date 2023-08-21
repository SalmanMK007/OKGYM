import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ArtisButton from "../buttons/button";

export default function ConfirmDialog(props) {
  const { handleClose, open, handleConfirm, title, price, buyer } = props;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          textAlign: "center",
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          CONFIRM THE SALE OF
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            mr: 8,
            ml: 8,
          }}
        >
          <p
            style={{
              marginBottom: 0,
              fontSize: "2rem",
              fontFamily: "Bellefair, serif",
            }}
          >
            <em id="em_title">{title}</em>{" "}
          </p>
          <p
            style={{
              marginBottom: 0,
              marginTop: 0,
              fontSize: "1.3rem",
              fontFamily: "Bellefair, serif",
            }}
          >
            to
          </p>
          <p
            style={{
              marginBottom: 0,
              marginTop: 0,
              fontSize: "2rem",
              fontFamily: "Bellefair, serif",
            }}
          >
            {buyer}
          </p>
          <p
            style={{
              marginBottom: 0,
              marginTop: 0,
              fontSize: "1.3rem",
              fontFamily: "Bellefair, serif",
            }}
          >
            for
          </p>
          <p
            style={{
              marginTop: 0,
              fontFamily: "Bellefair, serif",
              fontSize: "2rem",
            }}
          >
            {price}
          </p>
          <br />
          <p style={{ fontSize: "1.3rem", fontFamily: "Bellefair, serif" }}>
            When you confirm the sale, a blockchain record will be created.
          </p>
        </DialogContent>
        <DialogActions>
          <ArtisButton
            name="Cancel"
            onClick={handleClose}
            id="cancel"
            sx={{
              fontSize: "1.5rem",
            }}
            textColor="black"
          />
          <ArtisButton
            name="Confirm Sale"
            type="submit"
            onClick={handleConfirm}
            id="confirm"
            sx={{
              fontSize: "1.5rem",
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
