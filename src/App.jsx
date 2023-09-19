import Router from "./Router";
import "./App.css";
import Navbar, { RoleTyps } from "./components/Navbar";
import { createContext, useEffect, useState } from "react";
import Loader from "./components/Loader";
import BottomNav from "./components/BottomNav";


export const GeneralContext = createContext();

function App() {
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const [userRoleTyps, setUserRoleType] = useState(RoleTyps.none);
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
  return (
    <GeneralContext.Provider
      value={{ user, setUser, setLoader, userRoleTyps, setUserRoleType }}>
      <Navbar />
      <Router />
      <BottomNav/>
      {loader && <Loader />}
    </GeneralContext.Provider>
  );
}

export default App;
