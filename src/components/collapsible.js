import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";

import ExpandButton from "./work/expand-more";

export default function CollapsibleBody(props) {
  return (
    <Box ml={3} mr={3}>
      <Box
        sx={{
          bgcolor: "background.paper",
          overflow: "hidden",
          boxShadow: 4,
          p: 1,
          borderBottom: "1px solid #ddd",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "15px",
          fontWeight: "normal",
          lineHeight: "1.5",
          ...props.mainSx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => props.handleClick(props.expanded ? "" : props.id)}
        >
          <Grid direction={"row"} container>
            <Grid item>
              <ExpandButton
                title={props.title}
                id={props.id}
                handleClick={props.handleClick}
                expanded={props.expanded}
                {...props.buttonProps}
              >
                {props.icon}
              </ExpandButton>
            </Grid>
            <Grid item>
              {props?.is_kyced && (
                <img
                  style={{
                    height: 10,
                    marginTop: "15px",
                  }}
                  alt="identity validated"
                  src="/images/GoldWreath.jpg"
                />
              )}
            </Grid>
          </Grid>
          <div style={{ display: "flex", alignSelf: "flex-start" }}>
          {
            !props.onEditPage &&
            <Box
              component="p"
              sx={{
                display: "flex",
                marginLeft: "50px",
                fontSize: "12px",
                fontStyle: "italic",
                color: "gray",
              }}
            >
            { props.contribution }
            </Box>
          }
          {
            props.onEditPage && 
            <Box
              component="p"
              sx={{
                display: "flex",
                marginLeft: "50px",
                fontSize: "12px",
                fontStyle: "italic",
                color: "gray",
              }}
            >
              {`
                ${props.contribution}${(props.sign_status === 0 || 
                  // props.sign_status === 1 || 
                  props.sign_status === 2) ? "," : ""}
              `}
            </Box>
          }
          {props.sign_status === 0 ? (
            <Box
              component="p"
              color="green"
              sx={{
                display: "block",
                fontSize: "12px",
              }}
              style={{
                marginLeft: !props.contribution ? "50px" : "5px",
              }}
            >
              awaiting approval
            </Box>
          ) 
          // : props.sign_status === 1 ? (
          //   <Box
          //     component="p"
          //     color="brown"
          //     sx={{
          //       display: "block",
          //       fontSize: "12px",
          //     }}
          //     style={{
          //       marginLeft: !props.contribution ? "50px" : "5px",
          //     }}
          //   >
          //     approval accepted
          //   </Box>
          // ) 
          : (
            props.sign_status === 2 && (
              <Box
                component="p"
                color="red"
                sx={{
                  display: "block",
                  fontSize: "12px",
                }}
                style={{
                  marginLeft: !props.contribution ? "50px" : "5px",
                }}
              >
                approval declined
              </Box>
            )
          )}
          </div>
          {/* {props.detail === true && (
            <Box
              component="p"
              display="inline"
              color="black"
              sx={{
                display: "block",
                width: "100%",
                marginLeft: "90px",
                fontSize: "14px",
              }}
            >
              {props.contribution}
            </Box>
          )} */}
        </Box>
        <Collapse
          in={props.expanded}
          timeout="auto"
          unmountOnExit
          {...props.collapseProps}
        >
          {props.children}
        </Collapse>
      </Box>
    </Box>
  );
}
