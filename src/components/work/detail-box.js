import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import ArtisButton from "../buttons/button";

export default function DetailLoadingBox(props) {
  const timeoutRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setIsOpen(false);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Box
      m={isOpen ? 5 : 1}
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
      <Collapse in={isOpen} collapsedSize={props.isMobile ? 60 : 40}>
        {isOpen ? (
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
              PROOF OF COPYRIGHT REGISTRATION
            </Typography>
            <Typography fontSize="1.5em" textAlign="center" color="black">
              Secured by Ethereum/Polygon blockchains
            </Typography>
            <br />
            <br />
          </Box>
        ) : (
          <ArtisButton
            name="Artis.app Proof of Copyright Registration"
            textColor="gray"
            sx={{
              fontSize: "1rem",
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </Collapse>
    </Box>
  );
}
