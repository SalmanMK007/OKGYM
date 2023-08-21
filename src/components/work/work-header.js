import React from "react";
import Box from "@mui/material/Box";

import config from "../config";

export default function WorkHeader(props) {
  const { work } = props;

  return (
    <React.Fragment>
      <Box
        component="img"
        alt={work?.description}
        src={`${config.url.API_URL}${work?.work_image?.image}`}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          m: 3,
          minWidth: { md: 350 },
        }}
      >
        {work?.sold_tx_hash && work?.sold_tx_hash === "0" && (
          <>
            <Box component="span" color="gray">
              FOR SALE
              <br />
            </Box>

            <Box
              component="span"
              color="green"
              sx={{
                fontSize: "3.5rem",
                mt: 1,
                fontFamily: "Bellefair, serif",
              }}
            >
              {work.sold_price}
              <br />
              <br />
            </Box>
          </>
        )}

        <Box
          component="h1"
          sx={{
            fontSize: "1.8rem",
            mt: 1,
            fontFamily: "Bellefair, serif",
          }}
        >
          {work?.title}
        </Box>
        <Box
          component="span"
          sx={{
            fontSize: "1.2rem",
            fontWeight: "normal",
            fontFamily: "Bellefair, serif",
          }}
        >
          by: {work?.copyright_owner}
        </Box>
        <Box
          component="p"
          sx={{
            fontFamily: "Bellefair, serif",
            fontStyle: "italic",
            fontWeight: "normal",
          }}
        >
          {work?.description}
        </Box>
        {work?.sold_tx_hash && work.sold_tx_hash !== "0" && (
          <>
            <Box component="span" color="gray">
              ACQUIRED BY
              <br />
            </Box>
            <Box
              component="h1"
              sx={{
                fontFamily: "Bellefair, serif",
                fontWeight: "normal",
              }}
            >
              {work?.sold_buyer}
              <br />
            </Box>
          </>
        )}
      </Box>
    </React.Fragment>
  );
}
