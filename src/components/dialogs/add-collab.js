import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ArtisButton from "../buttons/button";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const AddCollabDialog = props => {
  const { handleClose, open, fameConnections, allCollabs, setAllCollabs } = props;
  const [radioValue, setRadioValue] = React.useState(null)
  const closeModal = () => {
    handleClose()
  }

  const addCollab = () => {
    const selectedCollab = fameConnections.find(fame => fame.id === parseInt(radioValue, 10))
    if (selectedCollab) {
      setAllCollabs([...allCollabs, selectedCollab])
      setRadioValue(null)
    }
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
          <strong>SELECT A COLLABORATOR</strong>
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            mr: 2,
            ml: 2,
          }}
        >
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={radioValue}
              onChange={(e) => setRadioValue(e.target?.value)}
            >
              {fameConnections?.map(con => {
                const isSelected = allCollabs.find(collab => collab.id === con.id)
                if (!con.first_name || isSelected) return null
                return (
                  <div style={{ display: "flex", flexFlow: "row wrap", alignItems: "center", marginBottom: "5px" }}>
                    <FormControlLabel value={con.id} control={<Radio />} label={`${con.first_name} ${con.last_name}`} />
                  </div>
                )
              })}
            </RadioGroup>
          </FormControl>


        </DialogContent>
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
            name="Add"
            type="submit"
            onClick={addCollab}
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


export default AddCollabDialog
