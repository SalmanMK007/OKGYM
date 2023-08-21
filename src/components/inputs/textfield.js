import React from "react";
import { TextField } from '@mui/material';

export default function ArtisInput(props) {
    return (
        <TextField
            variant="outlined"
            style={{ 
                textTransform: "none", 
                fontFamily: props.fontFamily || "Montserrat, sans-serif", 
            }}
            InputProps={{
                style: {
                    fontSize: "1em",
                    fontFamily: props.fontFamily || "Montserrat, sans-serif",
                }
            }}
            margin="normal"
            fullWidth
            {...props}
        />
    );
}