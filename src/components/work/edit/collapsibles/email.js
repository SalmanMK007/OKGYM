import { useEffect, useState, Fragment, useRef } from "react";
import Box from "@mui/material/Box";
import WarningIcon from "@mui/icons-material/Warning";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography'
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";

import CollapsibleBody from "../../../collapsible";
import ArtisInput from "../../../inputs/textfield";
import ArtisButton from "../../../buttons/button";
import EmailConfirmDialog from "../../../dialogs/email-preview";
import InfoDialog from "../../../dialogs/info-dialog";

const validate = (email, name, evidence) => {
  if (email && email.includes("@") && name && evidence) return false;
  return true;
};

export default function Email(props) {
  const uploadRef = useRef();
  const recaptchaRef = useRef()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("")
  const [evidence, setEvidence] = useState(null)
  const [sizeError, setSizeError] = useState(null)
  const [sendCopy, setSendCopy] = useState(false);
  const [openWarning, setOpenWarning] = useState("");
  const [previousWarnings, setPreviousWarnings] = useState([]);

  useEffect(() => {
    getWarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  const toggleSendCopy = () => {
    setSendCopy(!sendCopy);
  };

  const getWarnings = async () => {
    try {
      const response = await props.getPreviousWarnings();
      if (response.warnings.length > 0) {
        setPreviousWarnings(response.warnings);
      }
    } catch (error) {
      console.error(error)
    }

  };

  const handleSendEmail = async () => {
    setModalOpen(false);
    const token = recaptchaRef.current.getValue();

    const formData = new FormData();
    const data = JSON.stringify({
      send_to_name: name,
      send_to_email: email,
      send_copy: sendCopy,
      address,
    })
    formData.append(`warning_data`, data);
    formData.append('evidence_photo', evidence)
    formData.append('recaptcha_token', JSON.stringify(token))
    const result = await props.handleWarningEmail(formData);
    if (result) setPreviousWarnings(result);
    setName("");
    setEmail("");
    setAddress("")
    setEvidence("")
    setSendCopy("");

    toast.success("Email sent successfully", {
      onClose: () => {
        setTimeout(() => {
          getWarnings();
        }, 10000);
      },
    });
  };

  const handleFileUpload = (event) => {
    if (event?.target && event.target?.files.length) {
      if (event.target.files[0].size > 10e6) {
        setSizeError("Please upload a file smaller than 10 MB")
      } else {
        setEvidence(event.target.files[0]);
        setSizeError(null)
      }
    }
  }
  return (
    <CollapsibleBody
      expanded={props.openId === "email-body"}
      id="email-body"
      title={"Email"}
      icon={<WarningIcon />}
      handleClick={props.setOpenId}
      mainSx={{
        alignItems: "center",
      }}
    >
      <Box component="form" ml={3} mr={3} mb={3}>
        
        {/* <br /> */}
        <div align="center" className="mt-3 mb-3">
             <iframe title="explainer" src="https://player.vimeo.com/video/773321745?h=86451d5e38" width="300" height="300" style={{boxShadow: '1px 2px 5px #AAAAAA',}}  allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
        {/* <br /> */}
        <Box
          component="div"
          sx={{
            display: "inline-block",
          }}
        >
          If someonw has used your creation without your okay, have Artis.app email them the Proof of Copyright Registration and demand they cease infringing or contact you to negotiate terms of use.
          <InfoDialog
            title="Email Unauthrorized Use"
            subtitle={`Along with emailing the Proof of Copyright Registration, Artis.app records this warning on the blockchain and includes the link in the email, warning the recipient that the blockchain record can be used as evidence in a court of law. Links to previous blockchain records of their violations are included in the email.`}
            style={{
              display: "inline-block",
            }}
            examples={[]}
          />
        </Box>
        <ArtisInput
          label="Name of person or organization"
          id="warning_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ArtisInput
          label="Their email"
          type="email"
          id="email_id"
          value={email}
          name="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <ArtisInput
          label="Their physical address (if available)"
          type="text"
          id="address_id"
          value={address}
          multiline
          name="Address"
          onChange={(e) => setAddress(e.target.value)}
        />

        <ArtisInput
          label="Upload evidence of their misuse"
          type="text"
          id="evidence_id"
          value={evidence ? evidence.name : ""}
          name="evidence"
          onClick={() => uploadRef.current.click()}
        />
        {sizeError && (
          <Typography>{sizeError}</Typography>
        )}
        <input
          id="upload_photo"
          type="file"
          ref={uploadRef}
          onChange={(e) => handleFileUpload(e)}
          hidden
        />

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => toggleSendCopy()}
                defaultChecked={false}
              />
            }
            label={
              <Box component="p" fontStyle="italic">
                Send copy of email to you?
              </Box>
            }
          />
        </FormGroup>
        <ArtisButton
          name="Preview Email"
          size="medium"
          sx={{
            fontSize: "1.5rem",
          }}
          onClick={() => setModalOpen(true)}
          disabled={validate(email, name, evidence)}
          type="button"
        />
        <EmailConfirmDialog
          recaptchaRef={recaptchaRef}
          artisCode={props?.artis_code}
          copyrightDate={props?.copyright_date}
          copyrightOwner={props?.copyright_owner}
          txHash={props?.tx_hash}
          title={props?.title}
          workCreator={props?.work_creator}
          handleClose={() => setModalOpen(false)}
          open={modalOpen}
          handleConfirm={handleSendEmail}
          info={{
            name,
            email,
            address,
          }}
        />
      </Box>
      <Box m={3}>
        <Box component="div" textAlign="center">
          {previousWarnings.map((warning) => (
            <Fragment key={warning?.tx_hash}>
              <Button
                key={warning?.tx_hash}
                onClick={() => setOpenWarning(warning?.tx_hash)}
              >
                <Box component="a">
                  {warning?.send_date} - {warning?.send_to_email}
                </Box>
              </Button>
              <Dialog
                open={openWarning === warning?.tx_hash}
                onClose={() => setOpenWarning("")}
                onBackdropClick={() => setOpenWarning("")}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle
                  id="alert-dialog-title"
                  sx={{ textAlign: "center", fontSize: "2.5rem" }}
                >
                  WARNING NOTICE SENT
                </DialogTitle>
                <DialogContent
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Recipient: {warning?.send_to_name}
                  <br />
                  <br />
                  Email: {warning?.send_to_email}
                  <br />
                  <br />
                  Date: {warning?.send_date}
                  <br />
                  <br />
                  {warning?.address &&
                    <>
                      Address: {warning.address}
                      <br />
                      <br />
                    </>
                  }
                  {warning?.evidence &&
                    <>
                      <a href={warning.evidence} target="_blank" rel="noreferrer" download>Download evidence</a>
                      <br />
                      <br />
                    </>
                  }
                  Recorded on blockchain here:
                  <br />
                  <br />
                  <a
                    style={{
                      width: "100%",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      target: "blank",
                      textOverflow: "ellipsis",
                    }}
                    href={`https://polygonscan.com/tx/${warning.tx_hash}`}
                  >
                    {" "}
                    https://polygonscan.com/tx/{warning.tx_hash}{" "}
                  </a>
                </DialogContent>
              </Dialog>
            </Fragment>
          ))}
        </Box>
      </Box>
    </CollapsibleBody>
  );
}
