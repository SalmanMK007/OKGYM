import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloudOutlined from "@mui/icons-material/CloudOutlined";

import random from "lodash/random";
import CollapsibleBody from "../collapsible";
import ArtisInput from "../inputs/textfield";
import ArtisButton from "../buttons/button";
import Loader from "../buttons/loader";

export default function InvitedUsers(props) {
  const [emails, setEmails] = useState(props?.invitedUsers);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props?.invitedUsers) {
      setEmails(props?.invitedUsers);
    }
  }, [props?.invitedUsers]);

  const handleChange = (event, index) => {
    setEmails(
      emails.map((email, i) => {
        if (i !== index) return email;
        return {
          ...email,
          email: event.target.value.toLowerCase(),
        };
      })
    );
  };

  // Invite new user
  const handleInvite = async (index) => {
    setSelectedEmailIndex(index)
    if (emails[index].email?.synced === false) return;
    if (emails[index].is_active) return;
    setIsLoading(true);
    const response = await props.handleInvite(emails[index]);
    if (response.error) {
      setError(response.error);
    }
    setIsLoading(false);
  };

  const userField = (user, index) => (
    <Grid
      key={user ? user?.id : random(100, Number.MAX_VALUE, false)}
      container
      spacing={1}
      sx={{
        flexGrow: 1,
        justifyContent: "center",
      }}
      display="flex"
      columns={12}
      direction="row"
    >
      <Grid
        item
        xs={10}
        color="transparent"
        sx={{
          boxShadow: 0,
          alignSelf: "flex-start",
        }}
      >
        <ArtisInput
          disabled={user?.synced !== false}
          value={user?.email}
          InputLabelProps={{
            required: false,
            sx: { color: "teal" },
            shrink: true,
          }}
          onChange={(e) => handleChange(e, index)}
        />
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          alignSelf: "flex-end",
        }}
      >
        {selectedEmailIndex === index && <Loader isLoading={isLoading} />}
        <ArtisButton
          name={
            user.is_active
              ? "Accepted"
              : user?.synced === false
              ? "Invite"
              : "Resend"
          }
          type="submit"
          disabled={(user?.is_active && user.email !== "") || false}
          id={`invite_${user.id}`}
          textColor="teal"
          sx={{
            fontSize: "1.2rem",
          }}
          onClick={() => handleInvite(index)}
        />
      </Grid>
    </Grid>
  );
  return (
    <>
      <CollapsibleBody
        expanded={props.openId === "invite"}
        id="invite"
        title="Invite New Artists"
        icon={<CloudOutlined />}
        handleClick={props.setOpenId}
        mainSx={{
          alignItems: "stretch",
          //fontFamily: "'Bellefair', sans-serif;",
          fontWeight: "normal",
        }}
      >
        <Box m={3} fontSize="1.3rem">
          <div>
              <center>
                  <h3>Share Artis with great artists</h3>
             </center>
          </div>
          <Typography>
            Enter below the email of a great artist or creator you know, we'll send them an invite.
          </Typography>
          <Typography color="error">{error !== "" && `${error}`}</Typography>

          {emails.map((user, i) => userField(user, i))}
        </Box>
      </CollapsibleBody>
    </>
  );
}
