import React, { useEffect } from "react";
import { createTheme, responsiveFontSizes } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { teal } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
// local imports
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "react-tiny-fab/dist/styles.css";
import Routes from "./pages";
import UserProvider from "./providers/user";
import WorksProvider from "./providers/works";
import { useLocation } from "react-router-dom";

let theme = createTheme({
  palette: {
    secondary: {
      main: teal[500],
    },
    primary: {
      main: teal[500],
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: "'Bellefair', serif",
        fontSize: 18,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
  overrides: {
    MuiInputLabel: {
      // Name of the component ⚛️ / style sheet
      root: {
        // Name of the rule
        color: "teal",
        "&$focused": {
          // increase the specificity for the pseudo class
          color: "teal",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

function App() {
  const { pathname: path } = useLocation();
  useEffect(() => {
    // if path is not /login, hide presentation div
    if (path !== "/login") {
      document.getElementById("presentation").style.display = "none";
    } else {
      document.getElementById("presentation").style.display = "block";
    }
  }, [path]);

  useEffect(() => {   
    const audio = document.querySelector("audio");
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          // Autoplay started
          audio.muted = false;
        })
        .catch((error) => {
          console.error(error);
          // Autoplay was prevented.
          const button = document.createElement("button");
          button.style.visibility = "hidden";
          button.addEventListener("click", () => {
            audio.muted = false;
            audio.play();
          });
          button.click();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <WorksProvider>
          <ToastContainer />
          <Routes />
        </WorksProvider>
      </UserProvider>
      <audio
        src="https://artis.app/Artis.Opening.wav"
        muted={true}
        playsInline
        playsinline
        id="MyAudioElement"
      />
    </ThemeProvider>
  );
}

export default App;
