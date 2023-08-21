import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function WorksAcquired(props) {
  return (
    <Box  
      sx={{
        textAlign: "center",
        flexGrow: 1,
        mt: "2%",
        overflow: "hidden",
        display: "grid",
        backgroundSize: "cover",
        backgroundPosition: "0 400px",
      }}
    >
      {/* <br />
      <br /> */}
      <Typography component="div" fontSize="1.3rem" mt={4}>
        To generate Rights and Certificates of Authenticity<br />you'll need an active subscription to Artis.app.<br /><br />Please return to the 
        <Typography
          component="a"
          sx={{
            textDecoration: "none",
          }}
          fontSize="1.3rem"
          href="/"
        >
          {" "}
          previous page
        </Typography>
      </Typography>
    </Box>
  );
}
