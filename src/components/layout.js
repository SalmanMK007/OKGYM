import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import { useHistory, useLocation } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBackSharp";

import { useUser } from "../hooks/user";
import utils from "../utils";

export default function Layout(props) {
  const { user, logout } = useUser();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pageName, setPageName] = React.useState("Artis.app");
  const { pathname: path } = useLocation();

  React.useEffect(() => {
    if (path.includes("/works/edit")) {
      setPageName("Work");
    } else if (path.includes("/works/new")) {
      setPageName("Add Work");
    } else if (path.includes("/settings")) {
      setPageName("Settings");
    } else if (path.includes("/help")) {
      setPageName("Help");
    } else {
      setPageName("Artis.app");
    }
  }, [path]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    history.push("/settings");
  };

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const handleHelp = () => {
    history.push("/help");
  };

  if (!user) {
    return <></>;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        pt: 0,
        backgroundImage: `url(/images/bluebrushstroke.jpg)`,
        // backgroundRepeat: "no-repeat"
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        sx={{
          boxShadow: 0,
        }}
      >
        <Toolbar>
          {history.location.pathname !== "/works" && (
            <IconButton onClick={handleGoBack}>
              <ArrowBackIcon fontSize="large" style={{ fill: "black" }} />
            </IconButton>
          )}

          <Typography
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            fontWeight={500}
            sx={{ mr: 2, fontSize: "2rem" }}
            fontFamily="'Bellefair', sans-serif"
          >
            {pageName}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props?.email}
          </Typography>
          {
            history.location.pathname !== "/help" &&
            <Typography 
              component="div" 
              color="#039be5"
              alignItems={"center"}
              sx={{ 
                marginRight: 1,
                textTransform: "capitalize",
                display: "flex",
                cursor: "pointer",
              }} 
              onClick={handleHelp}
            >
              HELP
            </Typography>
          }
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user.profile?.photo && (
              <Avatar
                alt="User profile"
                src={utils.getMediaUrl(user.profile?.photo)}
              />
            )}
            {!user.profile?.photo && <AccountCircleIcon fontSize="large" />}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleSettings}>Settings</MenuItem>
            <MenuItem onClick={() => handleLogout()}>Log Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
