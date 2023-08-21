import React from "react";
import Button from "@mui/material/Button";

function ArtisButton(props) {
  const { type, disabled, textColor, id, name, bgColor, ...other } = props;
  return (
    <Button
      type={type || "submit"}
      fullWidth
      style={{
        backgroundColor: bgColor || "transparent",
        hover: "none",
        cursor: disabled ? "text" : "pointer",
        color: disabled ? textColor || "gray" : textColor || "teal",
        textTransform: "none",
        fontFamily: "Bellefair, serif",
      }}
      disabled={disabled}
      variant="text"
      id={id}
      {...other}
    >
      {name}
    </Button>
  );
}

export default ArtisButton;
