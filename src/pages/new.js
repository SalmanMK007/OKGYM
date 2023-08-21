import * as React from "react";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import EXIF from "exif-js";
import heic2any from "heic2any";
import config from "../config";
import InfoDialog from "../components/dialogs/info-dialog";
import TagsInput from "../components/inputs/chips-new";
import DateInput from "../components/inputs/date-picker";
import { CollaboratorCard } from "../components/collaborator_card/collaboratorcard";

import WorkService from "../api/service";
import { useUser } from "../hooks/user";
import EmailInputs from "../components/inputs/emails";
import ArtisButton from "../components/buttons/button";
import ArtisFooter from "../components/footer";
import AddCollabDialog from "../components/dialogs/add-collab";
import UserService from "../api/auth";
import ErrorDialog from "../components/dialogs/error-dialog";

const getMediaUrl = (path) => `${config.url.S3_URL}/${path}`;

const FrameModal = ({
  open,
  handleClose,
  setWorkIcon,
  setValues,
  frames = [],
  defaultSelected = "",
}) => {
  const [selected, setSelected] = React.useState(defaultSelected);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Typography
          textAlign="center"
          sx={{
            fontSize: "1em",
          }}
        >
          Select frame to display on Proof of Copyright
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={1}>
          {frames.map((frame) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      frame.name === selected.name ? "3px solid #72bcd4" : null,
                  }}
                  src={getMediaUrl(frame.name)}
                  alt="frame"
                  onClick={() => setSelected(frame)}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <ArtisButton
          name="Cancel"
          sx={{
            fontSize: "1.5rem",
            color: "red",
          }}
          onClick={() => {
            setWorkIcon(getMediaUrl(defaultSelected || frames[0].name));
            handleClose();
          }}
        />
        <ArtisButton
          name="Select"
          onClick={() => {
            setWorkIcon(getMediaUrl(selected.name));
            setValues(selected);
            handleClose();
          }}
          sx={{
            fontSize: "1.5rem",
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

const initialValues = {
  title: "",
  description: "",
  work_creator: "",
  copyright_date: new Date(),
  copyright_owner: "",
  tags: [],
  work_copy_name: "",
  work_copy_size: null,
  work_copy_fingerprint: "",
  support_document_name: "",
  support_document_size: null,
  support_document_fingerprint: "",
  image_id: "",
  pdficon_id: "",
  work_type: "Photograph",
  emails: [],
};

const WORK_TYPES = {
  Photograph: "/images/artis_icons/photographIcon.png",
  Film: "/images/artis_icons/filmIcon.png",
  Art: "/images/artis_icons/artIcon.png",
  Multimedia: "/images/artis_icons/multimediaIcon.png",
  Dance: "/images/artis_icons/danceIcon.png",
  Program: "/images/artis_icons/programIcon.png",
  Website: "/images/artis_icons/websiteIcon.png",
  Book: "/images/artis_icons/bookIcon.png",
  Story: "/images/artis_icons/storyIcon.png",
  Script: "/images/artis_icons/scriptIcon.png",
  Music: "/images/artis_icons/musicIcon.png",
};

const schema = yup.object({
  work_copy_name: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
});

export default function CreateWork(props) {
  const { user } = useUser();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [sendCommunityEmail, setSendCommunityEmail] = useState(false);
  const [_audio, _setAudio] = useState(null);

  const defaultValues = {
    ...initialValues,
    work_creator: `${user?.profile?.first_name} ${user?.profile?.last_name}`,
    copyright_owner: `${user?.profile?.first_name} ${user?.profile?.last_name}`,
    tags: user?.profile?.default_tags || [],
    work_type: "Photograph",
    emails: user?.profile?.email ? [user.profile.email] : [],
  };

  const [isFrameModalOpen, setIsFrameModalOpen] = React.useState(false);
  const [frameImages, setFrameImages] = useState([]);
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    formState,
    reset,
    trigger,
  } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [workIcon, setWorkIcon] = useState("");
  const [defaultWorkIcon, setDefaultWorkIcon] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [fileLoading, setFileLoading] = useState("");
  const [message, setMessage] = useState("");
  const [selectCover, setSelectCover] = useState(false);
  const [artistType, setArtistType] = useState(user?.profile?.artist_type);
  const [fameConnections, setFameConnections] = useState(null);
  const [allCollabs, setAllCollabs] = useState([]);
  const [percentage, setPercentage] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPercentages, setAllPercentages] = useState({});
  const [isModalCheckContri, setIsModalCheckContri] = useState(false);
  const [glSearchTabs, setGLSearchTabs] = useState([]);
  const [sendGPSLocation, setSendGPSLocation] = useState(false);
  const [gpsSwitchEnabled, setGpsSwitchEnabled] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [locationData, setLocationData] = useState(null);
  
  const theme = useTheme();
  
  React.useEffect(() => {
    document.title = "Add Work | Artis.app";
    const audio = new Audio("https://artis.app/Artis.Success.wav");
    audio.load();
    _setAudio(audio);
  }, []);

  React.useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await UserService.getFameConnections();
        if (response.result) {
          const allConnections = response.result.all_fame.map((fame) => {
            const customUser =
              user.profile.user.id === fame?.sender[0].user_id
                ? fame?.invitee[0]
                : fame?.sender[0];
            return { ...customUser, isSelected: false };
          });
          setFameConnections(allConnections);
        }
      } catch (error) {}
    };
    fetchConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (window.innerWidth > 768) {
      setGpsSwitchEnabled(false)
    } else {
      setGpsSwitchEnabled(true)
    }
  }, []);

  const { isDirty, isValid } = formState;
  /**
   * Get work icon based on type and file
   * @param {*} type
   * @param {*} file
   * @param {*} response
   */
  const getWorkIcon = (type, file = null, response = null) => {
    if (type.includes("image") && response?.result?.image_id) {
      setWorkIcon(URL.createObjectURL(file));
    } else if (response.result?.icon_path) {
      setWorkIcon(getMediaUrl(response.result.icon_path));
      setDefaultWorkIcon(response.result.icon_path);
    } else {
      setSelectCover(true);
      setWorkIcon(WORK_TYPES["Photograph"]);
    }
  };

  /**
   *
   * @param {*} event
   * @param {*} type
   */
  const handleFileUpload = async (event, type) => {
    let file = event.target.files[0];

    if (file.name.includes(".heic") || file.name.includes(".HEIC")) {
      await heic2any({
        blob: file,
        toType: "image/jpg",
      }).then(function (resultBlob) {
        file = new File([resultBlob], file.name.replace('.heic','').replace(".HEIC", '') + ".jpg", { type: "image/jpeg", lastModified: file.lastModified });
      });
    }
    
    if (event?.target && event.target?.files.length) {
      const formData = new FormData();
      formData.append("file", file);

      if (file.type.includes("image")) {
        formData.append("image", true);
      }
      if (type === "file") {
        formData.append("work_copy", true);
      }

      const isVideoType = file.type.match("video.*") ? "video" : null;
      setFileLoading(type);

      if (
        file.lastModifiedDate ||
        file.lastModified
      ) {
        setValue(
          "copyright_date",
          file.lastModifiedDate ??
            new Date(file.lastModified)
        );
      }

      EXIF.getData(file, function () {
        const allMetaData = EXIF.getAllTags(this);
        if (allMetaData && allMetaData?.DateTimeOriginal) {
          setValue("copyright_date", new Date(allMetaData.DateTimeOriginal));
        }
      });

      try {
        let response = null;
        if (isVideoType) {
          response = await WorkService.uploadVideoFile(formData);
          if (response.result.frame_images) {
            setDefaultWorkIcon(response.result.icon_path);
            setFrameImages(response.result.frame_images);
            setIsFrameModalOpen(true);
          }
        } else {
          response = await WorkService.uploadFile(formData);
        }

        const result = response.result;
        if (type === "file") {
          getWorkIcon(
            file.type,
            file,
            response
          );
          setValue("image_id", result?.image_id || "");
          setValue("pdficon_id", result?.pdficon_id || "");
          setValue("work_copy_name", result.filename, {
            shouldValidate: false,
          });
          setValue("work_copy_size", result.filebytes);
          setValue("work_copy_fingerprint", result.fingerprint);
        } else if (type === "cover") {
          setSelectCover(false);
        } else {
          setValue("support_document_name", result.filename, {
            shouldValidate: false,
          });
          setValue("support_document_size", result.filebytes);
          setValue("support_document_fingerprint", result.fingerprint);
        }

        setFileLoading("");
      } catch (e) {
        setMessage(e.message);
        setFileLoading("");
      }
    }
    trigger();
  };

  const handleIconSelect = (e) => {
    setWorkIcon(WORK_TYPES[e.target.value]);
    setValue("work_type", e.target.value);
  };

  const _handleSubmit = async (data, e) => {
    var all_artists = document.getElementsByName("artist_type");
    var all_artists_values = [];
    for (var i = 0; i < all_artists.length; i++) {
      all_artists_values.push(all_artists[i].value);
    }

    if (!all_artists_values.includes("")) {
      setIsloading(true);
      data.copyright_date = data.copyright_date.toISOString().slice(0, 10);
      data.sendCommunityEmail = sendCommunityEmail;
      data.collaboratorsExist = false;
      if (allCollabs.length > 0) {
        data.collaboratorsExist = true;
      }
      data.ownership = percentage;
      data.artist_type = artistType;
      
      // add geolocation to the data
      if (gpsSwitchEnabled && sendGPSLocation) {
        if (setLocationData !== null) {
          data.location = locationData;
        } else {
          setIsErrorModalOpen(true);
          setSendGPSLocation(false);
          setIsloading(false);
          return
        }
      }
      
      const response = await WorkService.createWork(data);
      allCollabs.forEach(async (con) => {
        try {
          await WorkService.createCollaborators({
            work_id: response.result.id,
            collab_id: con.user_id,
            registered_by_id: user.profile.user.id,
            contribution: con.artist_type,
            ownership: con.hasOwnProperty("ownership") ? con.ownership : 0,
            searchtabs: JSON.stringify(glSearchTabs),
            oncopyright: con.hasOwnProperty("oncopyright")
              ? con.oncopyright
              : false,
          });
        } catch (error) {
          console.error(error);
        }
      });
      setIsloading(false);
      
      setSelectCover(false);
      setWorkIcon("");

      if (response?.result?.success) {
        reset();
        // playSuccessAudio();
        const work = response.result;
        // setMessage(`Congrats! You have registered ${work.title} on the blockchain! Click `);
        const successMessage = (
          <div>
            <img alt="Artis.app" src="https://artis.app/images/peace.jpg" />
            <p>
              <strong>CONGRATS!!!</strong>
            </p>
            <br />
            <p>'{work.title}'</p>
            <p>will be registered on the blockchain!</p>
          </div>
        );
        playSuccessAudio();
        setAllCollabs([]);
        toast.success(successMessage, {
          onClose: () => {
            // Commented out to stop page from going back to /works
            // history.push("/works");
          },
        });
      } else {
        // setMessage(`Error submitting your form, please try again!`)
        toast.error(
          `Something went wrong while submitting your original, please try again!`,
          {
            onClose: () => {
              // reset();
            },
          }
        );
      }
      window.scrollTo(0, 0);
    } else {
      setIsModalCheckContri(true);
    }
  };


  const playSuccessAudio = () => {
    if (_audio) {
      _audio.play();
    }
  };

  const selectedCollaborators = fameConnections?.some((con) => con.isSelected);

  const handleGPSSwitch = () => {
    setSendGPSLocation(!sendGPSLocation)
    // get the user's location data
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      }, 
      () => {
        setIsErrorModalOpen(true);
        setSendGPSLocation(false);
      }
    );
  }

  const switchStyle = {
    borderRadius: 2,
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#26a69a"
    },
    "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
      backgroundColor: '#55a19a'
    }
  }

  const styles = {
    "artis-input": {
      marginTop: "0",
      marginBottom: "5%",
      borderColor: "teal !important",
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "1rem",
      [theme.breakpoints.down(490)]: {
        width: window.innerWidth - 70,
      },
    },
  };
  
  return (
    <Container maxWidth="md">
      <FrameModal
        open={isFrameModalOpen}
        handleClose={() => setIsFrameModalOpen(false)}
        frames={frameImages}
        setWorkIcon={setWorkIcon}
        defaultSelected={defaultWorkIcon}
        setValues={(frame) => {
          setValue("image_id", frame.id || "");
          setValue("work_copy_name", frame.filename, { shouldValidate: true });
        }}
      />
      <Typography mb={1} textAlign="center" fontSize="1.3rem">
        {message}
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.primary,
          overflow: "hidden",
          display: "grid",
          boxShadow: 2,
          backgroundSize: "cover",
          backgroundPosition: "0 400px",
          padding: 1,
        }}
      >
        <Box
          component="form"
          id="work_form"
          noValidate
          sx={{
            mt: 1,
            marginRight: "2%",
            marginLeft: "2%",
            marginTop: "5%",
          }}
        >
          <Typography 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              [theme.breakpoints.down(500)]: {
                width: window.innerWidth - 70,
              }
            }}
          >
            <img
              src="https://artis.app/images/Artis_one.jpg"
              alt="ONE"
              width="50"
              height="50"
            />
          </Typography>
          <Grid 
            container 
            direction={window.innerWidth > 490 ? "row" : "column"} 
            sx={{
              [theme.breakpoints.down(490)]: {
                width: window.innerWidth - 70,
              },
            }}
          >
            <Grid item>
              <Typography
                sx={{
                  fontSize: "1.5em",
                }}
              >
                Select a file containing your work, for Artis to upload and fingerprint.
              </Typography>
            </Grid>
            <Grid item xs={3} sm>
              <InfoDialog
                title="Digitally Fingerprint."
                subtitle="The file you digitally fingerprint represents the original you are registering. It can be a photo of your painting or furniture; or a 300x300px output of your original photo. PDF of your ideas, novel, script. Music file like an MP3. Iphone video of your dance. Etc. Etc."
                examples={[
                  "MonaLisa_photo.jpg",
                  "Imagine.mp3",
                  "RomeoAndJuliet.pdf",
                  "NativeSon.doc",
                ]}
              />
            </Grid>
            <Grid item></Grid>
          </Grid>
          <TextField
            variant="standard"
            style={{ 
              textTransform: "none",
            }}
            margin="normal"
            required
            fullWidth
            id="work_copy_name"
            name="work_copy_name"
            sx={styles["artis-input"]}
            InputProps={{
              style: {
                fontSize: "1.2rem",
              },
            }}
            disabled={isLoading}
            InputLabelProps={{
              required: false,
              sx: { color: "teal" },
              shrink: true,
            }}
            onClick={(event) => document.getElementById("upload_file").click()}
            value={getValues(["work_copy_name"])}
          />
          {workIcon && (
            <Box
              textAlign="center"
              sx={{
                mb: "2%",
              }}
            >
              <img
                src={workIcon}
                style={{ maxHeight: "200px", maxWidth: "200px" }}
                alt="Work icon"
              />
              <Typography color="black">
                {getValues(["work_copy_name"])} fingerprinted
              </Typography>
            </Box>
          )}
          {fileLoading === "file" && (
            <Box
              textAlign="center"
              sx={{
                mb: "2%",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <input
            id="upload_file"
            type="file"
            onChange={(event) => handleFileUpload(event, "file")}
            style={{ display: "none" }}
          />
          {selectCover && (
            <>
              <Grid container direction="row">
                <Grid item>
                  <Typography
                    color="green"
                    textAlign="center"
                    sx={{
                      fontSize: "1.5em",
                    }}
                  >
                    As your work is not an image, please select an icon to
                    represents this work inside Artis.app. This icon will not be
                    shown on Certificates.
                  </Typography>
                </Grid>
                <Grid item></Grid>
              </Grid>
              <div style={{ textAlign: "center" }}>
                <Select
                  native={false}
                  lable="Cover"
                  value={getValues(["work_type"])}
                  onChange={handleIconSelect}
                  renderValue={(v) => {
                    return (
                      <img
                        style={{ height: 50, width: 50 }}
                        src={WORK_TYPES[v]}
                        alt={v}
                      />
                    );
                  }}
                >
                  {Object.keys(WORK_TYPES).map((k) => (
                    <MenuItem value={k}>{k}</MenuItem>
                  ))}
                </Select>
              </div>
              <br />
              <br />
            </>
          )}
          <br />
          <br />
          <br />
          <Typography 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              [theme.breakpoints.down(500)]: {
                width: window.innerWidth - 70,
              }
            }}
          >
            <img
              src="https://artis.app/images/Artis_two.jpg"
              alt="TWO"
              width="50"
              height="50"
            />
          </Typography>
          <Grid 
            container 
            direction={window.innerWidth > 490 ? "row" : "column"} 
          >
            <Grid item>
              <Typography
                sx={{
                  fontSize: "1.5em",
                }}
              >
                What is the work's title?
              </Typography>
            </Grid>
            <Grid item xs={3} sm>
              <InfoDialog
                title="Title"
                subtitle="This is the name of your original work."
                examples={["Mona Lisa", "Casablanca", "Ninth Symphony"]}
              />
            </Grid>
            <Grid item></Grid>
          </Grid>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                variant="standard"
                style={{ textTransform: "none" }}
                margin="normal"
                required
                fullWidth
                id="title"
                label="ex: Mona Lisa"
                name="Title"
                autoComplete="title"
                sx={styles["artis-input"]}
                InputProps={{
                  classes: {
                    teal: {
                      root: {
                        "&:hover:not($disabled):not($focused):not($error) $notchedOutline":
                          {
                            borderColor: "teal !important",
                          },
                      },
                    },
                  },
                  style: {
                    fontSize: "1.1em",
                  },
                }}
                InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
                {...field}
              />
            )}
          />
          <br />
          <br />
          <br />
          <Typography 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              [theme.breakpoints.down(500)]: {
                width: window.innerWidth - 70,
              }
            }}
          >
            <img
              src="https://artis.app/images/Artis_three.jpg"
              alt="THREE"
              width="50"
              height="50"
            />
          </Typography>
          <Grid 
            container 
            direction={window.innerWidth > 490 ? "row" : "column"} 
          >
            <Grid item>
              <Typography
                sx={{
                  fontSize: "1.5em",
                }}
              >
                How would you describe it?
              </Typography>
            </Grid>
            <Grid item xs={1} sm>
              <InfoDialog
                title="Description"
                subtitle="Describe what is the original.. photo? dance? furniture? etc. For exammple, if you uploaded a video of a dance you created, describe it has as a dance, not a video file. "
                examples={[
                  "12x12cm oil painting on canvas",
                  "Nikon Raw file",
                  "short story",
                  "TV pilot",
                  "Sheet music",
                  "Multimedia file in mpg format",
                ]}
              />
            </Grid>
            <Grid item></Grid>
          </Grid>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                variant="standard"
                style={{ textTransform: "none" }}
                margin="normal"
                required
                sx={styles["artis-input"]}
                fullWidth
                name="description"
                label="ex: 77cmx 53cm oil on canvas"
                id="description"
                autoComplete="description"
                InputProps={{
                  classes: {
                    teal: {
                      root: {
                        "&:hover:not($disabled):not($focused):not($error) $notchedOutline":
                          {
                            borderColor: "teal !important",
                          },
                      },
                    },
                  },
                  style: {
                    fontSize: "1.1rem",
                  },
                }}
                InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
                {...field}
              />
            )}
          />
          <br />
          <br />
          <br />
          <Grid container direction="row" mb={3}>
            <Grid item>
              <Typography
                sx={{
                  fontSize: "1.5em",
                }}
              >
                Created by:{" "}
              </Typography>
            </Grid>
            <Grid item xs={3} sm></Grid>
          </Grid>
          <Grid item >
            <Typography
              sx={{
                height: 200,
                width: 460,
                border: "1px solid rgba(0,0,0,.4)",
                boxShadow:"rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
                margin: "auto",
                [theme.breakpoints.down(530)]: {
                  margin: 0,
                  width: window.innerWidth - 70,
                },
                [theme.breakpoints.down(440)]: {
                  margin: 0,
                  height: 250,
                  fontSize: "1.0em",
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.5em",
                  fontWeight: "bold",
                  marginTop: "10px",
                  textAlign: "center",
                  [theme.breakpoints.down(425)]: {
                    fontSize: "1.4em",
                  },
                }}
              >
                {`${user?.profile?.first_name} ${user?.profile?.last_name}`}
              </Typography>
              <Grid sx={{ margin: "10px 20px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontSize: "1.2em",
                    width: 230,
                    display: "inline-block",
                  }}
                >
                  Contribution
                </Typography>
                <Typography sx={{ display: "inline-block", width: 100 }}>
                  <TextField
                    variant="standard"
                    style={{ textTransform: "none" }}
                    required
                    fullWidth
                    id="user_artist_type"
                    // label="Artist Type"
                    name="artist_type"
                    autoComplete="artist_type"
                    value={artistType}
                    onChange={(e) => setArtistType(e.target.value)}
                  />
                </Typography>
              </Grid>
              <Grid sx={{ margin: "20px 20px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontSize: "1.2em",
                    width: 230,
                    display: "inline-block",
                    marginTop: "-5px",
                  }}
                >
                  Percentage of Ownership
                </Typography>
                <Typography sx={{ display: "inline", color: "black", width: 100 }}>
                  {percentage}%
                </Typography>
              </Grid>
              <Grid sx={{ margin: "10px 20px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontSize: "1.2em",
                    width: 230,
                    display: "inline-block",
                  }}
                >
                  Name on Copyright
                </Typography>
                <Checkbox sx={{ paddingLeft: 0, width: 100 }} disabled checked />
              </Grid>
            </Typography>
          </Grid>
          <Grid container direction="row">
            <Grid item sx={{ margin: "auto", width: "460px" }}>
              {!isCollabModalOpen && selectedCollaborators && (
                <Typography sx={{ mb: 2 }}>Selected Collaborators:</Typography>
              )}
              {!isCollabModalOpen &&
                allCollabs?.map((con) => {
                  return (
                    <CollaboratorCard
                      value={con}
                      onChangeContri={(value) => (con.artist_type = value)}
                      onChangeCopyright={(check) => (con.oncopyright = check)}
                      defaultValue={
                        allPercentages["percentage" + con.id] ? 
                        allPercentages["percentage" + con.id] : 0
                      }
                      onChangePercentage={(value) => {
                        var all_percentages = allPercentages;
                        all_percentages["percentage" + con.id] =
                          parseInt(value);
                        con["ownership"] = parseInt(value);
                        var all_values = Object.values(all_percentages);
                        var sum_percentages = all_values.reduce(
                          (a, b) => a + b,
                          0
                        );
                        setAllPercentages(all_percentages);
                        if (sum_percentages > 100) {
                          all_percentages["percentage" + con.id] = 0;
                          con["ownership"] = parseInt(value);
                          setPercentage(
                            100 - sum_percentages + parseInt(value)
                          );
                          setIsModalOpen(true);
                        } else {
                          setPercentage(100 - sum_percentages);
                        }
                      }}
                      onCloseClick={() => {
                        const index = allCollabs.indexOf(con);
                        if (index !== -1) {
                          const newArray = [...allCollabs]; // Create a copy of the array to modify
                          newArray.splice(index, 1); // Remove the item using splice
                          setAllCollabs(newArray); // Update the state with the new array
                          var all_percentages = allPercentages;
                          allPercentages["percentage" + con.id] =
                            allPercentages["percentage" + con.id]
                              ? allPercentages["percentage" + con.id]
                              : 0;
                          setPercentage(
                            percentage + all_percentages["percentage" + con.id]
                          );
                          all_percentages["percentage" + con.id] = 0;
                          setAllPercentages(all_percentages);
                        }
                      }}
                    />
                  );
                })}
              <ArtisButton
                name="Add Collaborator"
                sx={{
                  fontSize: 20,
                  pl: 0,
                  ml: 0,
                  textAlign: "left",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setIsCollabModalOpen(!isCollabModalOpen);
                }}
                type="button"
              />
            </Grid>
            {/* This is modal for checking of Percentage of Ownership validate */}
            <Modal open={isModalOpen} onClose={(e) => setIsModalOpen(false)}>
              <Box
                sx={{
                  width: 400,
                  height: 164,
                  backgroundColor: "white",
                  margin: "auto",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  padding: "30px 20px",
                }}
              >
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2, color: "black" }}
                >
                  This is not Mel Brook’s The Producers, you cannot distribute
                  more than 100% of ownership
                </Typography>
              </Box>
            </Modal>
            {/* This is modal for checking of Contribution validate */}
            <Modal
              open={isModalCheckContri}
              onClose={(e) => setIsModalCheckContri(false)}
            >
              <Box
                sx={{
                  width: 400,
                  height: 164,
                  backgroundColor: "white",
                  margin: "auto",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  padding: "30px 20px",
                }}
              >
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2, color: "black" }}
                >
                  Please fill in what your collaborators contribute to this work
                </Typography>
              </Box>
            </Modal>
            <AddCollabDialog
              open={isCollabModalOpen}
              handleClose={() => setIsCollabModalOpen(false)}
              fameConnections={fameConnections}
              allCollabs={allCollabs}
              setAllCollabs={setAllCollabs}
            />
            <ErrorDialog 
              open={isErrorModalOpen}
              handleClose={() => setIsErrorModalOpen(false)}
              message={`
                Your mobile browser refused to give Artis.app your GPS coordinates. Please go into the browser setting and enable this.
              `}
            />
          </Grid>
          <br />
          <br />
          <img
            src="https://artis.app/images/Artis_four.jpg"
            alt="ONE"
            width="50"
            height="50"
          />
          <Grid container direction="row">
            <Grid item>
              <Controller
                name="copyright_date"
                render={({ field }) => (
                  <DateInput
                    label="Copyright date"
                    value={getValues().copyright_date}
                    handleChange={field.onChange}
                  />
                )}
                control={control}
              />
            </Grid>
            <Grid item xs={3} sm>
              &nbsp;
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid 
            container
            direction={window.innerWidth > 490 ? "row" : "column"} 
          >
            <Grid item>
              <Typography
                sx={{
                  fontSize: "1.5em",
                  [theme.breakpoints.down(490)]: {
                    width: window.innerWidth - 70,
                  },
                }}
              >
                Optional - Search Tags to search for or catagorize works.
              </Typography>
            </Grid>
            <Grid item xs={3} sm>
              <InfoDialog
                title="Search Tags"
                subtitle="Search Tags are an easy way to catagorize or search for your work. For example, you can add the Search Tag 'photo' to all your photos and 'pdf' to all the pdfs your register. Multiple Search Tags can be added to a single work. To create a Search Tag, type in a word and press enter."
                examples={["PDF", "MP3", "Poem", "Recipe"]}
              />
            </Grid>
            <Grid item></Grid>
          </Grid>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagsInput
                sx={{
                  mb: 3,
                  fontSize: "1.5rem",
                  [theme.breakpoints.down(490)]: {
                    width: window.innerWidth - 70,
                  },
                }}
                id="tags"
                name="Tags"
                placeholder="Type in a word and press enter"
                label="tags"
                chips={field.value}
                options={user?.profile?.tags}
                setChips={field.onChange}
                onChangeSearch={(value) => setGLSearchTabs(value)}
              />
            )}
          />

          <Grid 
            container
            direction={window.innerWidth > 490 ? "row" : "column"} 
          >
            <Grid item>
              <Typography
                sx={{
                  fontSize: "1.5em",
                  [theme.breakpoints.down(490)]: {
                    width: window.innerWidth - 70,
                  },
                }}
              >
                Optional - Include support documentation.
              </Typography>
            </Grid>
            <Grid item xs={3} sm>
              <InfoDialog
                title="Support Document"
                subtitle="Attach and record supporting documentation for your work. For example, if you are registering a photo of a model, upload the model-signed release form. Good practice is to zip up all support documents into one file and then upload that one zip file here."
                examples={[
                  "VogueSepember2023Cover_modelRelease.zip",
                  "LocationPermissionForm.zip",
                  "ClearChainOfTitle.zip",
                ]}
              />
            </Grid>
            <Grid item></Grid>
          </Grid>
          <TextField
            variant="standard"
            style={{ textTransform: "none" }}
            margin="normal"
            fullWidth
            value={getValues(["support_document_name"])}
            id="support_file"
            label="Click here to select support file to include in registration"
            name="support_document_name"
            sx={styles["artis-input"]}
            InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
            onClick={(event) =>
              document.getElementById("").click()
            }
          />

          {getValues("support_document_name") && (
            <Box
              textAlign="center"
              sx={{
                mb: "2%",
              }}
            >
              <Typography color="black">
                {getValues("support_document_name")} fingerprinted
              </Typography>
            </Box>
          )}
          {fileLoading === "support_file" && (
            <Box
              textAlign="center"
              sx={{
                mb: "2%",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <input
            id="upload_support_file"
            onChange={(event) => handleFileUpload(event, "support_file")}
            type="file"
            style={{ display: "none" }}
          />
        </Box>
      </Box>
      <br />
      <Typography
        sx={{
          fontSize: "1.5em",
        }}
      >
        Email detailed copy of registration to:
      </Typography>
      <EmailInputs
        email={user?.profile?.email}
        emails={
          user?.profile?.work_emails &&
          user?.profile.work_emails.filter(
            (obj) => obj?.email && obj.email.includes("@")
          )
        }
        onEmailsUpdate={(emails) => setValue("emails", emails)}
      />
      <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
        {/* <Checkbox
          checked={sendCommunityEmail}
          onChange={() => setSendCommunityEmail(!sendCommunityEmail)}
          inputProps={{ "aria-label": "controlled" }}
        /> */}
        <FormControlLabel
          control={
            <Switch
              checked={sendCommunityEmail}
              onChange={() => setSendCommunityEmail(!sendCommunityEmail)}
              inputProps={{ 'aria-label': 'Checkbox' }}
              sx={switchStyle}
            />
          }
          label="Send this work's Proof of Copyright to your creative community."
        />
      </Box>
      <Box>
        <FormControlLabel
          control={
            <Switch 
              checked={sendGPSLocation}
              onChange={handleGPSSwitch}
              disabled={!gpsSwitchEnabled}
              inputProps={{ 'aria-label': 'Checkbox' }}
              sx={switchStyle}
            />
          }
          label="Include GPS location where this work is being registered."
        />
      </Box>
      {isLoading && (
        <Box textAlign="center" mb={4}>
          <CircularProgress size="4rem" />
        </Box>
      )}
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <br />
        <img
          src="https://artis.app/images/Artis_five.jpg"
          alt="FOUR"
          width="50"
          height="50"
        />

        <br />

        {isLoading ? (
          <Box sx={{ m: 2, pl: 5, pr: 5, pb: 0, pt: 0, textAlign: "center" }}>
            Registering new work in blockchain, please wait...
          </Box>
        ) : (
          <Button
            // disabled={false}
            style={{
              backgroundColor: `${
                !isDirty || !isValid ? "#eeeeee" : "#26a69a"
              }`,
              fontSize: "1.4em",
              color: `${!isDirty || !isValid ? "black" : "#fff"}`,
              textTransform: "uppercase",
              fontFamily: "Bellefair, serif",
            }}
            sx={{
              m: 2,
              pl: 5,
              pr: 5,
              pb: 0,
              pt: 0,
            }}
            type="button"
            onClick={() => handleSubmit(_handleSubmit)()}
          >
            register on blockchain
          </Button>
        )}
        <Typography color="black" component="p" textAlign="center" mb={4}>
          By clicking the button above, you attest the work you're registering
          <br /> is your original creation and its copyright belongs to you.
        </Typography>

        {selectedCollaborators && (
          <Typography color="green" component="p" textAlign="center" mb={4}>
            When button is pressed, the work will be sent to collaborators for
            them to accept or decline their participation. Only after all have
            accepted will the work be registered on the blockchain.
          </Typography>
        )}
      </div>
      <br />
      <br />

      <ArtisFooter />
    </Container>
  );
}
