import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Chip } from "@mui/material";

export default function TagsField(props) {
  const { options, chips, setChips, ...other } = props;

  return (
    <Autocomplete
      multiple
      fullWidth
      id="tags"
      options={options}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="filled" label={option} {...getTagProps({ index })} />
        ))
      }
      onChange={(e, value) => {
        setChips(value);
        props.onChangeSearch(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          fullWidth
          label={other?.name}
          placeholder={other?.placeholder}
        />
      )}
      value={chips}
      {...other}
    />
  );
}
