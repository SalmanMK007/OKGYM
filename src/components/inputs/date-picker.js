import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Stack from "@mui/material/Stack";

export default function DateInput(props) {
  const { sx, value, handleChange, readOnly, ...other } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack sx={sx} spacing={3}>
        <DatePicker
          disableFuture
          value={value || null}
          onChange={handleChange}
          readOnly={readOnly || false}
          renderInput={(params) => (
            <TextField
              style={{ textTransform: "none", borderColor: "black" }}
              variant="standard"
              margin="normal"
              required
              fullWidth
              {...params}
            />
          )}
          {...other}
        />
      </Stack>
    </LocalizationProvider>
  );
}
