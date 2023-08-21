import {
  Box,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import * as React from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CollapsibleBody from "../../../collapsible";
import ArtisButton from "../../../buttons/button";
import { WorkService } from "../../../../api";

export default function Government(props) {
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [modalStyle, setModalStyle] = React.useState("add");
  const [deleteId, setDeleteId] = React.useState(0);
  const [updateId, setUpdateId] = React.useState(0);
  const [registWith, setRegistWith] = React.useState("");
  const [registNumber, setRegistNumber] = React.useState("");
  const [registDate, setRegistDate] = React.useState(new Date().toISOString().substring(0, 10));
  const [registData, setRegistData] = React.useState([]);
  const [addDisbled, setAddDisabled] = React.useState(true);
  const [updateDisbled, setUpdateDisabled] = React.useState(false);
  
  React.useEffect(() => {
    async function fetchData() {
      try {
        var response = await WorkService.getRegistrar(props.artis_code);
        if (response.hasOwnProperty("result")) setRegistData(response.result);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [props.artis_code]);
  React.useEffect(() => {
    if (
      registWith.length > 0 &&
      registNumber.length > 0 &&
      registDate.length > 0
    ) {
      setAddDisabled(false);
      setUpdateDisabled(false);
    } else {
      setAddDisabled(true);
      setUpdateDisabled(true);
    }
  }, [registWith, registNumber, registDate]);

  const createRegistrar = async () => {
    const body = {
      r_with: registWith,
      r_number: registNumber,
      r_date: registDate,
      artis_code: props.artis_code,
    };
    try {
      await WorkService.createRegistrar(body);
      var response = await WorkService.getRegistrar(props.artis_code);
      if (response.hasOwnProperty("result")) setRegistData(response.result);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRegister = async (id) => {
    try {
      await WorkService.deleteRegistrar(id);
      var setdata = [];
      for (var i = 0; i < registData.length; i++) {
        const data = registData[i];
        if (data.id !== id) {
          setdata.push(data);
        }
      }
      setRegistData(setdata);
      setOpenDelete(false);
    } catch (error) {
      console.error(error);
    }
  };
  const updateRegistrar = async () => {
    const body = {
      r_id: updateId,
      r_with: registWith,
      r_number: registNumber,
      r_date: registDate,
      artis_code: props.artis_code,
    };
    try {
      await WorkService.updateRegistrar(body);
      var response = await WorkService.getRegistrar(props.artis_code);
      if (response.hasOwnProperty("result")) setRegistData(response.result);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const ComponentContent = () => {
    return (
      <CollapsibleBody
        expanded={props.openId === "government-body"}
        id="government-body"
        title={"Outside Registration"}
        icon={<BusinessIcon />}
        handleClick={props.setOpenId}
        mainSx={{}}
      >
        <Box component="div" m={3}>
          <Box>
            {
              props.onEdit ? 
              `If you registered this work with tradition institution such as the US Copyright Office), you can add the registration information here. This information will be displayed on the work’s public
              pages, thus adding to its protection.` :
              `This work has also been registered with:`
            }
            
          </Box>
        </Box>
        {registData &&
          registData.map((data) => (
            <Box component="div" m={3} pl={7}>
              <Grid container direction="row">
                {
                  props.onEdit &&
                  <Grid item>
                    <Box>Registrar:</Box>
                  </Grid>
                }
                <Grid item>
                  <Box>&nbsp;{data.r_with}</Box>
                </Grid>
              </Grid>
              <Grid container direction="row">
                {
                  props.onEdit &&
                  <Grid item>
                    <Box>#:</Box>
                  </Grid>
                }
                <Grid item>
                  <Box>&nbsp;{data.r_number}</Box>
                </Grid>
              </Grid>
              <Grid container direction="row">
                {
                  props.onEdit &&
                  <Grid item>
                    <Box>Date:</Box>
                  </Grid>
                }
                <Grid item>
                  <Box>&nbsp;{data.r_date}</Box>
                </Grid>
              </Grid>
              {props.onCopyRight !== "collaborator_false" && (
                <Grid container direction="row" ml="-16px">
                  <Grid item>
                    <ArtisButton
                      name="edit"
                      onClick={async () => {
                        setUpdateId(data.id);
                        setRegistWith(data.r_with);
                        setRegistNumber(data.r_number);
                        setRegistDate(data.r_date);
                        setModalStyle("update");
                        setOpen(true);
                      }}
                      id="id_addgover"
                      sx={{
                        fontSize: "1.2rem",
                      }}
                      textColor="green"
                    />
                  </Grid>
                  <Grid item>
                    <ArtisButton
                      name="delete"
                      onClick={async () => {
                        setDeleteId(data.id);
                        setOpenDelete(true);
                      }}
                      id="id_addgover"
                      sx={{
                        fontSize: "1.2rem",
                      }}
                      textColor="red"
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          ))}
        {props.onCopyRight !== "collaborator_false" && (
          <Box>
            <Grid 
              container 
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <ArtisButton
                  name="Add Registration"
                  onClick={async () => {
                    setModalStyle("add");
                    setRegistWith("");
                    setRegistNumber("");
                    setOpen(true);
                  }}
                  id="id_addgover"
                  sx={{
                    fontSize: "1.5rem",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <div>
          <Dialog open={open} onClose={(e) => setOpen(false)}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="id_with"
                label="Registred with"
                fullWidth
                variant="standard"
                value={registWith}
                onChange={(e) => setRegistWith(e.target.value)}
              />
              <TextField
                margin="dense"
                id="id_number"
                label="Registration Number"
                fullWidth
                variant="standard"
                value={registNumber}
                onChange={(e) => setRegistNumber(e.target.value)}
              />
              <TextField
                type="date"
                value={registDate}
                fullWidth
                variant="standard"
                inputProps={{ min: "1970-01-01", max: "2040-01-01" }}
                onChange={(e) => setRegistDate(e.target.value)}
                sx={{
                  marginTop: "25px",
                }}
              />
            </DialogContent>
            <DialogActions>
              {modalStyle === "add" && (
                <Button
                  onClick={(e) => createRegistrar()}
                  disabled={addDisbled}
                >
                  Add
                </Button>
              )}
              {modalStyle === "update" && (
                <Button
                  onClick={(e) => updateRegistrar()}
                  disabled={updateDisbled}
                >
                  Update
                </Button>
              )}
              <Button
                onClick={(e) => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <Dialog open={openDelete} onClose={(e) => setOpenDelete(false)}>
          <DialogContent>
            <Box>Are you sure you want to delete this registration?</Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => deleteRegister(deleteId)}
              sx={{ color: "red" }}
            >
              Delete
            </Button>
            <Button
              onClick={(e) => {
                setOpenDelete(false);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </CollapsibleBody>
    );
  };

  return (
    <>
      {props.hidden && registData.length > 0 && ComponentContent()}
      {!props.hidden && ComponentContent()}
    </>
  );
}
