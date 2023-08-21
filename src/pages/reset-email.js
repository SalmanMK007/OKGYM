import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Container, Box } from "@mui/material";
import axios from "axios";
import Loader from "../components/buttons/loader";
import { useUser } from "../hooks/user";

const ResetEmail = () => {
  const { uid, token, new_email } = useParams();
  const history = useHistory();
  const { logout } = useUser();

  useEffect(() => {
    const resetEmail = async () => {
      try {
        if (!new_email) return null;
        await axios.post(
          `https://api.artis.app/users/reset-email/${uid}/${token}/${new_email}/`,
          { new_email }
        );
        logout();
        history.push("/login");
      } catch (error) {
        history.push("/login");
      }
    };
    resetEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!new_email) {
    history.push("/login");
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box ml={3} mr={3} mb={3} mt={10}>
        <Loader isLoading={true} />
      </Box>
    </Container>
  );
};

export default ResetEmail;
