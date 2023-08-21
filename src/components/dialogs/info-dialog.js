import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IconButton, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

export default function InfoDialog(props) {
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  
  
  return (
    <div style={props.style}>
        <>
            <IconButton
                size="small"
                aria-label="info"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="success"
            >
                <InfoOutlined />
            </IconButton>
            <SwipeableDrawer
                anchor="bottom"
                open={state}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <Box
                    sx={{ width: 'auto', ml: 5, mr: 5, mb: 5}}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <Typography color="teal" display="inline-grid" fontSize="2.5rem">? </Typography> 
                    <Typography
                        component="h1"
                        fontSize="2.5rem"
                        display="inline-grid"
                    >
                        {props.title}
                    </Typography>
                    <Typography
                        component="p"
                        fontSize="1.3rem"
                    >
                        {props.subtitle}
                    </Typography>
                    <br/>
                    <Typography
                        component="div"
                        fontSize="1.8rem"
                    >
                        {props.examples.length ? "Examples:" : ""}
                        {props.examples.map(ex => <Typography key={ex} fontStyle="italic">{ex}</Typography>)}
                    </Typography>
                </Box>
            </SwipeableDrawer>
        </>
    </div>
  );
}
