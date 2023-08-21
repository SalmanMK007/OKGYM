import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import utils from "../utils";

const Img = styled("img")({
  margin: "auto",
  alignSelf: "center",
  maxWidth: "100%",
  maxHeight: "100%",
});

function Work(props) {
  const { 
    work, 
    profile, 
    history, 
    collabs 
  } = props;

  const { 
    registered_on_blockchain, 
    rejected_collab 
  } = work;

  const defaultBackground = "#f5f5f5";
  const [collabOptions, setCollabOptions] = useState({ color: defaultBackground, hideBlock: false, text: "" })
  
  useEffect(() => {
    const currentCollab = collabs?.find(col => col.collaborator.user_id === profile.user.id && col.work.id === work.id)

    if (rejected_collab) {
      setCollabOptions({ color: "#ffebee", text: "COLLABORATION DECLINED" })
    }
    else if (!registered_on_blockchain && currentCollab && currentCollab.collaborator.user_id === profile.user.id && !currentCollab.signed && !rejected_collab) {
      setCollabOptions({ color: "#fffde7", text: "ACCEPT or DECLINE" })
    } else if (!registered_on_blockchain && currentCollab?.registered_by_id !== profile.user.id && !rejected_collab) {
      setCollabOptions({ color: "#e8f5e9", text: "AWAITING APPROVAL" })
    }  
    
    if (!registered_on_blockchain && rejected_collab && currentCollab?.collaborator.user_id === profile.user.id) {
      setCollabOptions({ hideBlock: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collabs]);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      history.push(`/works/edit/${work.artis_code}`);
    },
  });

  if (collabOptions.hideBlock) {
    return null
  }

  return (
    <div {...handlers}>
      <Link style={{textDecoration: "none",color: "inherit",}} to={{ pathname: `/works/edit/${work.artis_code}`, work, profile }}>
        <Grid
          container
          sx={{
            backgroundColor: collabOptions.color,
            marginBottom: 1.5,
          }}
        >
          <Grid item mr={2}>
            <Box
              component="div"
              border="none"
              // className="image-container"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: props.isMobile ? "20vw" : "14vw",
                minHeight: "10vh",
              }}
            >
              <Img
                alt="complex"
                src={utils.getIcon(work.work_image, work.work_type)}
              />
            </Box>
          </Grid>
          <Grid item xs={6} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography
                  fontSize="1.4rem"
                  gutterBottom
                  component="h1"
                  color="black"
                  fontFamily="'Bellefair', sans-serif"
                >
                  {work?.title?.length > 30
                    ? work?.title?.substring(0, 30) + "..."
                    : work?.title}
                </Typography>
                <Typography
                  fontStyle="italic"
                  fontSize="0.9em"
                  variant="h1"
                  fontFamily="'Montserrat', sans-serif"
                  gutterBottom
                >
                  {work?.description}
                </Typography>
                <Typography
                  fontSize="0.9em"
                  variant="h1"
                  fontFamily="'Montserrat', sans-serif"
                >
                  {work?.artist_statement?.length > 100
                    ? work?.artist_statement?.substring(0, 100) + "..."
                    : work?.artist_statement}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs container direction="column" mr={1}>
            <Grid item xs textAlign="right">
              <Typography
                fontSize="1rem"
                component="h2"
                gutterBottom
                display="inline"
                textAlign="right"
              >
                {new Date(work?.copyright_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                <br />
              </Typography>
              <Typography
                color={(work?.sold_tx_hash === "0" ? "green" : "brown") || collabOptions.text ? "black" : "inherit"}
                fontSize="0.9em"
                textAlign="right"
                display="inline"

                gutterBottom
              >

                {work?.sold_tx_hash && collabOptions.text === "" &&
                  (work.sold_tx_hash === "0" ? "on sale" : "sold")}
                {collabOptions.text &&
                  <>{collabOptions.text}</>
                }
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Link>
    </div>
  );
}

export default Work;
