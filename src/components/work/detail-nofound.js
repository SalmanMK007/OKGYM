import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";

export default function DetailedNoFound(props) {
  return (
    <Box
      sx={{
        "& > :not(style)": {
          display: "flex",
          justifyContent: "space-around",
          height: "70vh",
          width: "100%",
          bgcolor: "background.paper",
        },
      }}
    >
      <Collapse collapsedSize={props.isMobile ? 60 : 40}>
        <Box>
          <br />
          <br />
          <br />
          <center>
            <img
              alt="Artis.app Logo"
              textAlign="center"
              src="https://artis.app/images/Artis.png"
              height="208"
              width="150"
            />
          </center>

          <br />
          <br />
          <Typography fontSize="2em" textAlign="center" color="black">
            Work has not been registered yet.
          </Typography>
          <br />
          <br />
        </Box>
      </Collapse>
    </Box>
  );
}
