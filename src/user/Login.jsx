import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { GeneralContext } from "../App";
import { useContext, useState, useEffect } from "react";
import { RoleTyps } from "../components/Navbar";
import Joi from "joi";
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ""
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const { setUser, setLoader, setUserRoleType, snackbar, user } = useContext(GeneralContext);
  const schema = Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@%$#^&*\-_*]).{8,32}$/).required()
      .messages({
        "string.pattern.base": "Password must meet the specified criteria",
        "any.required": "Password is required",
      }),
  });
  const handleValid = (ev) => {
    const { name, value } = ev.target;
    const obj = { ...formData, [name]: value }
    setFormData(obj)
    const validate = schema.validate(obj, { abortEarly: false })
    const tempErrors = { ...errors }
    delete tempErrors[name];
    if (validate.error) {
      const item = validate.error.details.find((e) => e.context.key == name)
      if (item) {
        tempErrors[name] = item.message;
      }
    }
    setIsFormValid(!validate.error)
    setErrors(tempErrors)
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoader(true);
    // Clear attempts for formData.email
    const clearAttempts = () => {
      let obj = JSON.parse(localStorage.getItem('obj')) || {};
      delete obj[formData.email];
      localStorage.setItem('obj', JSON.stringify(obj));
    };
    fetch(
      `https://api.shipap.co.il/clients/login?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`,
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then((x) => {
            throw new Error(x);
          });
        }
      })
      .then((data) => {
        setUser(data);
        setUserRoleType(RoleTyps.user);
        if (data.business) {
          setUserRoleType(RoleTyps.business);
        } else if (data.admin) {
          setUserRoleType(RoleTyps.admin);
        }
        navigate("/");
        snackbar(`Welcome ${data.fullName}`);
        // Clear attempts when user logs in successfully
        clearAttempts();
      })
      .catch((err) => {
        // Handle login error
        let obj = JSON.parse(localStorage.getItem('obj')) || {};
        if (!obj[formData.email]) {
          obj[formData.email] = { attempts: 1, isBlocked: false };
        } else {
          const attempts = obj[formData.email].attempts || 0;
          obj[formData.email] = {
            attempts: attempts + 1,
            isBlocked: attempts + 1 >= 3 ? true : false,
          };
        }
        localStorage.setItem('obj', JSON.stringify(obj));
        console.log(err.message);
        setTimeout(() => {
          clearAttempts();
        }, 20000); // 60000 milliseconds = 1 minute
      })
      .finally(() => setLoader(false));
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              error={Boolean(errors.email)}
              helperText={errors.email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleValid}
              value={formData.email} />
            <TextField
              error={Boolean(errors.password)}
              helperText={errors.password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleValid}
              value={formData.password} />
            <Button
              type="submit"
              fullWidth
              disabled={!isFormValid|| (localStorage.getItem('obj') && JSON.parse(localStorage.getItem('obj'))[formData.email]?.isBlocked)}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/signup">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}


