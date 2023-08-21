import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { TextField, Typography, Grid, Checkbox } from "@mui/material";
import { useTheme } from "@mui/styles";

export const CollaboratorCard = (props) => {
  const [percentage, setPercentage] = useState(0);
  const theme = useTheme();

  React.useEffect(() => {
    setPercentage(props.defaultValue);
  }, [props]);

  return (
    <Card
      sx={{
        minWidth: 275,
        border: "1px solid rgba(0,0,0,.4)",
        marginTop: "0px",
        [theme.breakpoints.down(530)]: {
          margin: 0,
          width: window.innerWidth - 70,
        },
        [theme.breakpoints.down(440)]: {
          margin: 0,
          height: 250,
          fontSize: "1.0em",
        }
      }}
    >
      <CardContent>
        <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography
            sx={{
              fontSize: "1.5em",
              paddingRight: "0px",
              textAlign: "center",
              fontWeight: "bold",
              width: "350px",
              position: "relative",
              left: "27px",
              display: "flex",
              [theme.breakpoints.down(425)]: {
                fontSize: "1.4em",
              },
            }}
            color="text.secondary"
          >
            {props.value.first_name} {props.value.last_name}
          </Typography>
          <Typography
            sx={{
              color: "red",
              ml: 2,
              cursor: "pointer",
              display: "inline",
              float: "right",
              paddingRight: "5px",
            }}
            onClick={() => {
              props.onCloseClick();
            }}
          >
            X
          </Typography>
        </Typography>
        <Grid sx={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: "1.3em",
              width: 230,
              display: "inline-block",
              // marginLeft: "70px",
            }}
          >
            Contribution
          </Typography>
          <Typography sx={{ display: "inline-block", width: 100 }}>
            <TextField
              variant="standard"
              style={{ textTransform: "none" }}
              required
              fullWidth
              id="user_artist_type"
              name="artist_type"
              autoComplete="artist_type"
              defaultValue={`${props.value.artist_type}`}
              onChange={(e) => props.onChangeContri(e.target.value)}
              sx={{ width: 1, position: "relative", top: "-3px" }}
            />
          </Typography>
        </Grid>
        <Grid sx={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: "1.3em",
              width: 230,
              display: "inline-block",
              // marginLeft: "70px",
            }}
          >
            Percentage of Ownership
          </Typography>
          <Typography sx={{ display: "inline-block", width: 100 }}>
            <TextField
              variant="standard"
              style={{ textTransform: "none" }}
              type="number"
              required
              fullWidth
              id="user_percentage_ownership"
              name="percentage_ownership"
              value={percentage}
              sx={{
                width: 78,
                position: "relative",
                top: "-3px",
                textAlign: "center",
              }}
              onChange={(e) => {
                var value = parseInt(e.target.value);
                if (value <= 0) value = 0;
                if (value > 100) value = 100;
                var propsValue = value;
                if (!propsValue) propsValue = 0;
                props.onChangePercentage(propsValue);
                setPercentage(value);
              }}
            />
            <Typography sx={{ display: "inline", marginLeft: "10px" }}>
              %
            </Typography>
          </Typography>
        </Grid>
        <Grid sx={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: "1.3em",
              width: 230,
              display: "inline-block",
              // marginLeft: "70px",
            }}
          >
            Name on Copyright
          </Typography>
          <Checkbox
            sx={{ width: 100 }}
            onChange={(e) => props.onChangeCopyright(e.target.checked)}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};
