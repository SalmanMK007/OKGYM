import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SubmitEmail = (props) => {
  const { submitEmail, setSubmitEmail, setError, handleEmailSubmit } = props;
  return (
    <Box>
      <Typography>
        Sorry, sign ups are currently by invite only. If you want to be notified when public enrollment starts, please add your email below.
      </Typography>
      <TextField
        style={{ textTransform: "none" }}
        variant="standard"
        margin="normal"
        required
        fullWidth
        name="submit_email"
        label="email"
        type="text"
        id="submit_email"
        value={submitEmail}
        onChange={(e) => {
          setSubmitEmail(e.target.value);
          setError("");
        }}
        // autoComplete="off"
        sx={{ mb: 3 }}
        InputProps={{
          style: {
            fontSize: "1.3rem",
          },
        }}
        InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
      />
      <Button
        type="button"
        className="normal"
        fullWidth
        style={{
          backgroundColor: "transparent",
          fontSize: "1.5em",
          color: "teal",
          textTransform: "none",
          fontFamily: "Bellefair, serif",
        }}
        variant="text"
        sx={{ mt: -1, mb: 2 }}
        onClick={handleEmailSubmit}
      >
        Add me to your list
      </Button>
    </Box>
  );
};

export default SubmitEmail;
