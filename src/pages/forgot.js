import * as React from "react";
import axios from "axios";
import {
  CardMedia,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useHistory } from "react-router";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"© 2022 ArtisDAO"}
      <Link
        color="inherit"
        href="https://material-ui.com/"
        style={{ textDecoration: "none" }}
      ></Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export default function Forgot(props) {
  const history = useHistory();
  const [error, setError] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    React.useState(false);
  const handleSubmit = async () => {
    try {
      await axios.post("https://api.artis.app/password_reset/", { email });
      setIsSuccessModalVisible(true);
    } catch (error) {
      setError(error.response.data.email[0]);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Modal open={isSuccessModalVisible}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            borderColor: "white",
            boxShadow: 24,
            padding: 24,
            display: "flex",
            flexFlow: "column wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Success
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 5, mb: 5 }}>
            Password reset link sent
          </Typography>
          <Button onClick={() => history.push("/login")}>OK</Button>
        </Box>
      </Modal>
      <Container component="child" maxWidth="md">
        <br />
        <br />
        <CardMedia
          component="img"
          style={{ width: "40%", paddingTop: "10px", margin: "auto" }}
          image="images/Artis.png"
        />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {error && (
            <Typography
              component="h1"
              color="red"
              variant="h5"
              style={{ fontSize: "1.3em", fontFamily: "Bellefair, serif" }}
            >
              {error}
            </Typography>
          )}

          <Typography
            component="h1"
            variant="h5"
            style={{ fontSize: "1.5em", fontFamily: "Bellefair, serif" }}
          >
            Lost your password?!?
            <br />
            <br />
            No worries. Input your email and we'll send you a password reset
            link.
            <br />
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "80%" }}
          >
            <TextField
              variant="standard"
              style={{ textTransform: "none" }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Button
            className="normal"
            fullWidth
            style={{
              backgroundColor: "transparent",
              fontSize: "1.3em",
              color: "teal",
              textTransform: "none",
              fontFamily: "Bellefair, serif",
            }}
            variant="text"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Email Link
          </Button>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
