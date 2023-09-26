import Router from "./Router";
import "./App.css";
import Navbar, { RoleTyps } from "./components/Navbar";
import { createContext, useEffect, useState } from "react";
import Loader from "./components/Loader";
import BottomNav from "./components/BottomNav";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // Define your primary color
    },
    secondary: {
      main: '#FF4081', // Define your secondary color
    },
    background: {
      default: '#FFFFFF', // Define your background color
    },
    // Other theme options...
  },
  // Typography and other theme options...
});
export const GeneralContext = createContext();

export default function App() {
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const [userRoleTyps, setUserRoleType] = useState(RoleTyps.none);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);
  useEffect(() => {
    fetch(`https://api.shipap.co.il/clients/login`, {
      credentials: "include",
    })
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
      })
      .catch((err) => {
        setUserRoleType(RoleTyps.none);
        console.log(err.message);
      })
      .finally(setLoader(false));
  }, []);
  const toggleTheme = () => {
    setCurrentTheme(currentTheme === lightTheme ? darkTheme : lightTheme);
  };
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GeneralContext.Provider
        value={{ user, setUser, setLoader, userRoleTyps, setUserRoleType }}>
        <Navbar theme={currentTheme} onToggleTheme={toggleTheme} />
        <Router />
        <BottomNav />
        {loader && <Loader />}
      </GeneralContext.Provider>
    </ThemeProvider>
  );
}
