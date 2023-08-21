import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import CloudOutlined from "@mui/icons-material/CloudOutlined";
import CollapsibleBody from "../../../collapsible";
import ArtisButton from "../../../buttons/button";
import Loader from "../../../buttons/loader";
import ArtisInput from "../../../inputs/textfield";
import utils from "../../../../utils";

const extractFileName = (file) => {
  try {
    return "" + file.split("/").pop();
  } catch (e) {
    return "";
  }
};

export default function Bio(props) {
  const { handleSubmit, setValue, control } = useForm({
    defaultValues: {
      artist_bio: props.bio,
      artist_website: props.website,
      photo: null,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [profileIcon, setProfileIcon] = useState(
    props?.photo ? utils.getMediaUrl(props.photo) : ""
  );

  const _handleSubmit = async (data) => {
    setIsLoading(true);
    const { ...body } = data;
    const formData = new FormData();

    if (body?.photo) {
      formData.append("photo", body.photo);
    }
    formData.append("artist_bio", body.artist_bio);
    formData.append("artist_website", body.artist_website);

    await props.handleBioUpdate(formData);
    setIsLoading(false);
  };

  const handleFileUpload = async (event) => {
    setIsLoading(true);
    if (event?.target && event.target?.files.length) {
      if (event.target.files[0].type.includes("image")) {
        setValue("photo", event.target.files[0]);
        setProfileIcon(URL.createObjectURL(event.target.files[0]));
      } else {
        setError("Please select an image");
      }
    }
    setIsLoading(false);
  };

  return (
    <CollapsibleBody
      expanded={props.openId === `bio${props.collaborator_id}`}
      id={`bio${props.collaborator_id}`}
      title={
        props?.isSettings ? 
        `Bio, Website and Photo` : 
        <>
          <span>{`${props.first_name} ${props.last_name}`}</span>
        </>
      }
      icon={props?.isSettings ? <CloudOutlined /> : <PersonIcon />}
      is_kyced={props?.is_kyced}
      handleClick={props.setOpenId}
      mainSx={{
        alignItems: props?.isSettings ? "stretch" : "flex-start",
      }}
      sign_status={props?.sign_status}
      detail={props?.detail}
      contribution={props?.contribution}
      onEditPage={props?.onEditPage}
    >
      <Box
        component="form"
        ml={3}
        mr={3}
        noValidate
        onSubmit={handleSubmit((data) => _handleSubmit(data))}
      >
        {error !== "" && (
          <Box textAlign="center" color="red">
            {error}
          </Box>
        )}
        {!props.hasOwnProperty("hiddenTitle") && !props?.isSettings && (
          <Grid container direction={"column"} spacing={1}>
            <Grid item>
              <Box color="gray">
                {/* <br />contribution:&nbsp;{props.contribution} */}
                <br />ownership:&nbsp;{props.ownership}%
                <br /> on Copyright:&nbsp;{props.oncopyright ? "Yes" : "No"}
              </Box>
            </Grid>
          </Grid>
        )}

        {profileIcon && (
          <Box
            textAlign="center"
            sx={{
              mb: "2%",
              mt: props.onEditPage ? "5%" : "2%",
            }}
          >
            <img
              src={profileIcon}
              style={{ maxHeight: "200px", maxWidth: "200px" }}
              alt="Profile"
            />
          </Box>
        )}
        {
          ((props?.isEdit === true || props?.isSettings) &&
            <>
              <Controller
                control={control}
                name="photo"
                render={({ ref, formState, fieldState, ...rest }) => (
                  <ArtisInput
                    label="Photo"
                    id="photo"
                    value={
                      rest.field.value?.name || extractFileName(profileIcon)
                    }
                    InputLabelProps={{
                      required: false,
                      sx: { color: "teal" },
                      shrink: true,
                    }}
                    onClick={(event) =>
                      document.getElementById("upload_photo").click()
                    }
                    {...rest}
                  />
                )}
              />
              <input
                id="upload_photo"
                type="file"
                onChange={(e) => handleFileUpload(e)}
                hidden
              />
            </>
          )}
        {!props.hasOwnProperty("isEdit") || props?.isEdit === true ? (
          <Controller
            control={control}
            name="artist_website"
            render={({ ref, formState, fieldState, ...rest }) => (
              <ArtisInput
                label="Website"
                id="website"
                onChange={rest.field.onChange}
                fontFamily="Montserrat', sans-serif"
                value={rest.field.value}
                InputLabelProps={{
                  required: false,
                  sx: { color: "teal" },
                  shrink: true,
                }}
                {...rest}
              />
            )}
          />
        ) : (
          <Box component="a" sx={{ display: "block", textAlign: "center" }}>
            {props.website}
          </Box>
        )}
        {!props.hasOwnProperty("isEdit") || props?.isEdit === true ? (
          <Controller
            control={control}
            name="artist_bio"
            render={({ ref, formState, fieldState, ...rest }) => (
              <ArtisInput
                label="Bio"
                id="bio"
                multiline
                InputLabelProps={{
                  required: false,
                  sx: { color: "teal" },
                  shrink: true,
                }}
                onChange={rest.field.onChange}
                value={rest.field.value}
                fontFamily="Montserrat', sans-serif"
                {...rest}
              />
            )}
          />
        ) : (
          <Box
            component="p"
            sx={{
              whiteSpace: "pre-wrap",
              fontSize: "1rem",
              fontFamily: "'Montserrat', sans-serif;",
              fontWeight: "normal",
              m: 3,
              textAlign: "left",
            }}
          >
            {props.bio}
          </Box>
        )}
        
        <Loader isLoading={isLoading} />
        {!props.hasOwnProperty("isEdit") ||
          (props?.isEdit === true && (
            <ArtisButton
              id="update_bio"
              name="Update for ALL Certificates"
              sx={{
                fontSize: "1.5rem",
                mb: 2,
                mt: 2,
              }}
            />
          ))}
        {
          props?.isSettings &&
          <ArtisButton
            id="update_bio"
            name="Update"
            sx={{
              fontSize: "1.5rem",
              mb: 2,
              mt: 2,
            }}
          />
        }
        {/* <br /> */}
        {props.hasOwnProperty("allCommunity") && props.allCommunity}
        {/* <br /> */}
      </Box>
    </CollapsibleBody>
  );
}
  
 