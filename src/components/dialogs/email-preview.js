import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ReCAPTCHA from "react-google-recaptcha";

import ArtisButton from "../buttons/button";

export default function EmailConfirmDialog(props) {
  const {
    handleClose,
    open,
    handleConfirm,
    txHash,
    title,
    artisCode,
    recaptchaRef,
    info,
  } = props;
  const [isCaptchaValid, setIsCaptchaValid] = React.useState(null)
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          PLEASE CONFIRM ARTIS.APP SHOULD SEND THIS EMAIL
        </DialogTitle>
        <DialogContent sx={{}}>
          <br />
          <p style={{ margin: 0 }}>
            <span style={{ color: "gray" }}>TO: </span>Reported Email:{" "}
            <span id="reported_email">{info.email}</span>
            <br />
            <span style={{ color: "gray" }}>FROM: </span>Blockchain@Artis.app
            <br />
            <span style={{ color: "gray" }}>SUBJECT: </span> VIOLATION NOTICE: {title}
          </p>
          <div>

            <br />
            NOTICE OF VIOLATION
            <br />
            <br />
            To: <span id="reported_name">{info.name}</span>
            <br />
            Address: <span style={{ whiteSpace: 'pre-wrap' }}>{info.address}</span>
            <br />
            <br />
            You are hereby notified that you have been flagged for violating the creative rights and/or copyright for the original work titled: {title}.
            <br />
            <br />
            A RECORD OF THIS VIOLATION AND OF THIS VIOLATION WARNING HAS BEEN PRESERVED ON THE BLOCKCHAIN HERE: https://polygonscan.com/tx/{txHash}{" "}

            <br />
            <br />
            This record may be used in a court of law as evidence of your violation and your intentional ignoring of notification of your violation through this email.
            <br />
            <br />
            To remedy this violation and prevent further action, you must immediately cease and desist your violation or contact the original work’s rights holder to reach an agreement to use their work.
            <br />
            <br />
            Details of the work you have violated and contact information for the rights holder, can be found on the work's Proof of Copyright here: https://artis.app/works/{artisCode}

            <br />
            <br />
            {" "}

          </div>
        </DialogContent>

        <div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center", marginTop: 10 }}>
          <ReCAPTCHA
            ref={recaptchaRef}
            onChange={(t) => setIsCaptchaValid(t)}
            sitekey="6LeIf2oiAAAAALiQ9INPZSVwXSeUf7gFMZzGjYgJ"
          />
        </div>

        <DialogActions>
          <ArtisButton
            name="SEND EMAIL"
            onClick={handleConfirm}
            id="confirm_warning"
            disabled={!isCaptchaValid}
            sx={{
              fontSize: "1.5rem",
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
