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
import { useContext, useState ,useEffect} from "react";
import { RoleTyps } from "../components/Navbar";
import Joi from "joi";
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ""
  })
  const [isFormValid,setIsFormValid]=useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState({
    email: '',
    loginAttempts: 0,
    isBlocked: false,
  });
  const [blockedUsers, setBlockedUsers] = useState(
    JSON.parse(localStorage.getItem('blockedUsers')) || []
  );
  const { setUser, setLoader, setUserRoleType,snackbar} = useContext(GeneralContext);
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
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || [];
    const isBlocked = userStatus.isBlocked;
    if (blockedUsers.includes(formData.email)) {
      snackbar('You are blocked. Please try again later.');
      return;
    }
    const data = new FormData(event.currentTarget);
    setLoader(true);
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
          setUserStatus({
            email: '',
            loginAttempts: 0,
            isBlocked: false,
          });
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
        snackbar(`Welcome ${data.fullName}`)
      })
      .catch((err) => {
        setUserStatus({
          email: formData.email,
          loginAttempts: userStatus.loginAttempts+1,
          isBlocked: false,
        });
        console.log(err.message);
        if (userStatus.loginAttempts + 1 >= 3) {
          setUserStatus({
            email: formData.email,
            loginAttempts: userStatus.loginAttempts,
            isBlocked: true,
          });
          setBlockedUsers([...blockedUsers, userStatus]);
          localStorage.setItem('blockedUsers', JSON.stringify([...blockedUsers, userStatus]));
          setTimeout(() => {
            const updatedBlockedUsers = blockedUsers.filter(user => user !== formData.email);
            setBlockedUsers(updatedBlockedUsers);
            localStorage.setItem('blockedUsers', JSON.stringify(updatedBlockedUsers));
            setUserStatus({
              email: '',
              loginAttempts: 0,
              isBlocked: false,
            });
          }, 1 * 60 * 1000); // user block time.
          snackbar('Three Failed Login Attempts, Please Try Again Later');
        } else {
          snackbar('Invalid username or password, Please double-check and try again');
        }
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
              value={formData.email}/>
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
              value={formData.password}/>
            <Button
              type="submit"
              fullWidth
              // disabled={!isFormValid|| userStatus.email}
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
       

       {/* Msg */}
      {/* {isBlocked&&localStorage.getItem('blockedUser')===formData.email? <div><p>blablabla</p></div>:''} */}
     
      </>
  );
}




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
import { useContext, useState ,useEffect} from "react";
import { RoleTyps } from "../components/Navbar";
import Joi from "joi";
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ""
  })
  const [isFormValid,setIsFormValid]=useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loginAttemts,setLoginAttempts]=useState(0);
  const { setUser, setLoader, setUserRoleType,snackbar,user } = useContext(GeneralContext);
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
  
    const isBlocked = localStorage.getItem('isBlocked');
    if (isBlocked&&localStorage.getItem('blockedUser')===formData.email) {
      setIsBlocked(true);
      snackbar('You are blocked. Please try again later.');
      return;
    }
    const data = new FormData(event.currentTarget);
    setLoader(true);
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
          setLoginAttempts(0);
          setIsBlocked(false);
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
        snackbar(`Welcome ${data.fullName}`)
      })
      .catch((err) => {
        setLoginAttempts(loginAttemts + 1); 
        console.log(err.message);
        if (loginAttemts + 1 >= 3) {
          setIsBlocked(true);
          localStorage.setItem('isBlocked', 'true');
          localStorage.setItem('blockedUser', formData.email);
          setTimeout(() => {
            setIsBlocked(false);
            setLoginAttempts(0);
            localStorage.removeItem('isBlocked'); 
            localStorage.removeItem('blockedUser'); 
          }, 1 * 60 * 1000); // user block time.
          snackbar('Three Failed Login Attempts, Please Try Again Later');
        } else {
          snackbar('Invalid username or password, Please double-check and try again');
        }
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
              value={formData.email}/>
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
              value={formData.password}/>
            <Button
              type="submit"
              fullWidth
              disabled={!isFormValid||isBlocked&&localStorage.getItem('blockedUser')===formData.email}
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

      {isBlocked&&localStorage.getItem('blockedUser')===formData.email? <div><p></p></div>:''}
     
      </>
  );
}


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
  const [userStatus, setUserStatus] = useState([{
    email: '',
    loginAttempts: 0,
    isBlocked: false,
  }]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const { setUser, setLoader, setUserRoleType, snackbar, user } = useContext(GeneralContext);
  console.log(user);
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
    const userEmail = data.get("email");
    setLoader(true);
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
        snackbar(`Welcome ${data.fullName}`)
      })
      .catch((err) => {
        const updatedUserStatus = userStatus.map((user) => {
          if (user.email === userEmail) {
            return {
              ...user,
              loginAttempts: user.loginAttempts + 1,
              isBlocked: user.loginAttempts + 1 < 3 ? false : true,
            };
          }
          return user;
        });
  
        setUserStatus(updatedUserStatus);
  
        // Check if the user is blocked and add to blockedUsers if true
        const blockedUser = updatedUserStatus.find((user) => user.isBlocked);
  
        if (blockedUser) {
          setBlockedUsers([...blockedUsers, blockedUser]);
        }
        console.log(userStatus);
        console.log(blockedUsers);
        console.log(err.message);

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
              // disabled={!isFormValid}
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


