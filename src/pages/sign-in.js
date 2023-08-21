import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Login from "../components/forms/Login";
import SubmitEmail from "../components/forms/SubmitEmail";
import { useUser } from "../hooks/user";
import ArtisButton from "../components/buttons/button";
import { AuthService } from "../api";
import WorkService from "../api/service";
import useCheckMobileScreen from "../hooks/isMobile";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .required("Email or username is required"),
  password: yup.string("Enter your password").required("Password is required"),
});

export default function SignIn() {
  const { user, login } = useUser();
  const isMobile = useCheckMobileScreen(600);
  const history = useHistory();

  const [artisCode, setArtisCode] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [artisCodeError, setArtisCodeError] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [isMissmatch, setIsMissmatch] = useState(false);
  const [submitEmail, setSubmitEmail] = useState("");
  const [openPage, setOpenPage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitEmail(submitEmail);
    setOpenPage("email");
    // To-do: send email to user
    const response = await AuthService.submitEmail({ email: submitEmail });

    if (response.result) {
      setSubmitEmail("");
      toast.success("Email submitted successfully!");
    } else {
      setSubmitEmail("");
      toast.error("Invalid email!");
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setSuccess(true);

      const loginAttempt = await login(
        values.email.toLowerCase(),
        values.password
      );
      setIsLoading(false);
      setSuccess(false);

      if (loginAttempt !== "Success") {
        formik.setFieldValue("password", "");
        setError("Invalid password or email!");
      }
    },
  });

  useEffect(() => {
    document.title = "Login | Artis.app";
  }, []);

  useEffect(() => {
    if (user) history.push("/works");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setIsMissmatch("");
  }, [formik.values.password]);

  useEffect(() => {
    setError("");
  }, [formik.values.email]);

  const handleLookup = async () => {
    const lookupAttempt = await WorkService.lookup(artisCode);
    const res = lookupAttempt?.result;
    if (res) {
      if (res.artis_code) history.push(`/works/${res.artis_code}`);
    }
    setArtisCodeError(`Nothing is registered under this code: ${artisCode}`);
  };

  return (
    <Container maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box>
          <Grid
            sx={{
              fontFamily: "Bellefair, serif",
              textAlign: "center",
            }}
            container
          >
            <Grid item>
              <ArtisButton
                name="Login/Sign up"
                onClick={() => setOpenPage(openPage === "login" ? "" : "login")}
                sx={{
                  fontSize: "1.3em",
                }}
                textColor={openPage === "login" ? "gray" : "teal"}
              />
            </Grid>
            <Grid item>
              <ArtisButton
                name="Find Copyright"
                onClick={() =>
                  setOpenPage(openPage === "artis-code" ? "" : "artis-code")
                }
                sx={{
                  fontSize: "1.3em",
                }}
                textColor={openPage === "artis-code" ? "gray" : "teal"}
              />
            </Grid>
          </Grid>
        </Box>
        <Box maxWidth={isMobile ? "95%" : "50%"}>
          <Collapse in={openPage === "login"} timeout="auto" unmountOnExit>
            <Typography color="red">
              {error !== "" ? `${error}` : ""}
            </Typography>
            <Login formik={formik} />
            <SubmitEmail
              isMobile={isMobile}
              handleEmailSubmit={handleEmailSubmit}
              submitEmail={submitEmail}
              setSubmitEmail={setSubmitEmail}
              setError={setError}
            />
          </Collapse>
        </Box>
        <Box maxWidth={isMobile ? "95%" : "55%"}>
          <Collapse in={openPage === "artis-code"} timeout="auto" unmountOnExit>
            <Box>
              <br />
              <p class="center">Find a copyrighted work by its Artis Code</p>
              <br />
              <Typography color="red">
                {artisCodeError !== "" ? `${artisCodeError}` : ""}
              </Typography>
              <TextField
                style={{ textTransform: "none" }}
                variant="standard"
                margin="normal"
                required
                fullWidth
                name="artis_code"
                label="Artis Code"
                type="text"
                id="name"
                value={artisCode}
                onChange={(e) => {
                  setArtisCode(e.target.value);
                  setArtisCodeError("");
                }}
                autoComplete="off"
                sx={{ mb: 3 }}
                InputProps={{
                  style: {
                    fontSize: "1.3rem",
                  },
                }}
                InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
              />
              <Button
                type="button"
                className="normal"
                fullWidth
                style={{
                  backgroundColor: "transparent",
                  fontSize: "1.5em",
                  color: "teal",
                  textTransform: "none",
                  fontFamily: "Bellefair, serif",
                }}
                variant="text"
                sx={{ mt: -1, mb: 2 }}
                onClick={handleLookup}
              >
                Start Search
              </Button>
            </Box>
          </Collapse>
        </Box>
        <Box maxWidth={isMobile ? "95%" : "55%"} textAlign="center">
          {/* <Collapse in={openPage === ""} timeout="auto" unmountOnExit>
            <Typography
              variant="p"
              sx={{
                fontFamily: "Bellefair, serif",
                fontSize: "1.3rem",
                borderRadius: "10px",
              }}
            >
              Digital and real-world art is copied endlessly. Billions in earnings
              lost by artists and art owners. Artis.app enables the safe marketing
              of all art - written, image, physical, audio -- around the world and
              ensures its valuable authenticity -- <em>for free</em>.
              <br />
              <br />
              Artis.app is a community project created by artists for artists.
              <br />
              <br />
              Currently, registration is by invitation.
            </Typography>
          </Collapse> */}
        </Box>
      </Box>
      {/*   <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
}
