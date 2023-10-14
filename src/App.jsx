import Router from "./Router";
import "./App.css";
import './responsive.css';
import Navbar, { RoleTyps } from "./components/Navbar";
import { createContext, useEffect, useState } from "react";
import Loader from "./components/Loader";
import BottomNav from "./components/BottomNav";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from "./components/SnackBar";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background:{
      default:'#161616'
    }
  },
  typography:{
    fontFamily:'Inter',
  }
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
      default: '#d8f5ff', // Define your background color
    },
    // Other theme options...
  },
  // Typography and other theme options...
  typography:{
    fontFamily:'Inter',
  }
});
export const GeneralContext = createContext();

export default function App() {
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const [snackbarText,setSnackbarText]=useState('')
  const [userRoleTyps, setUserRoleType] = useState(RoleTyps.none);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (query) => {
    setSearchQuery(query); // Update the search query in the parent component
  };

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
  const snackbar = (text) => {
    setSnackbarText(text);
    setTimeout(() => setSnackbarText(""), 3 * 1000);
  };
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />  
      {/*CssBaseline damaging other css but dark mode works */}
      <GeneralContext.Provider
        value={{ user, setUser, setLoader, userRoleTyps, setUserRoleType ,snackbar,currentTheme}}>
        <Navbar theme={currentTheme} onToggleTheme={toggleTheme}   onSearchChange={handleSearchChange}/>
        <Router query={searchQuery} />
        <BottomNav />
        {loader && <Loader />}
        {snackbarText && <Snackbar text={snackbarText} />}
      </GeneralContext.Provider>
    </ThemeProvider>
  );
}
