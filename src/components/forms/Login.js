  import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

const Login = (props) => {
  const { formik } = props;
  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{
        mt: 1,
      }}
    >
      <TextField
        variant="standard"
        style={{ textTransform: "none" }}
        margin="normal"
        required
        fullWidth
        InputProps={{
          style: {
            fontSize: "1.3rem",
          },
        }}
        id="email"
        label="Your email (case sensitive)"
        name="email"
        autoComplete="email"
        value={formik.values.email}
        onChange={(e) => {
          formik.setFieldValue('email', e.target.value.toLowerCase());
        }}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
      />
      <TextField
        variant="standard"
        style={{ textTransform: "none" }}
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        InputProps={{
          style: {
            fontSize: "1.3rem",
          },
        }}
        autoComplete="current-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        InputLabelProps={{ required: false, sx: { color: "#9E9E9E" } }}
      />
      <Box>
        <div style={{ textAlign: "right" }}>
          <NavLink
            to="/forgot"
            variant="body2"
            style={{
              textDecoration: "none",
              fontSize: "1em",
              color: "#03B6EF",
              fontFamily: "Arial",
            }}
          >
            lost password
          </NavLink>
        </div>
      </Box>

      <Button
        type="submit"
        className="normal"
        fullWidth
        style={{
          backgroundColor: "transparent",
          fontSize: "1.5em",
          hover: "none",
          color: "teal",
          textTransform: "none",
          fontFamily: "Bellefair, serif",
        }}
        variant="text"
        sx={{ mt: 3, mb: 2 }}
      >
        Log In
      </Button>
    </Box>
  );
};

export default Login;
