import  { useState,useContext } from 'react';
import { styled } from '@mui/system';
import BottomNavigation from '@mui/material/BottomNavigation'; // Use '@mui/material' for BottomNavigation
import BottomNavigationAction from '@mui/material/BottomNavigationAction'; // Use '@mui/material' for BottomNavigationAction
import { FcAbout } from "react-icons/fc";
import FavoriteIcon from '@mui/icons-material/Favorite'; // Use '@mui/icons-material' for FavoriteIcon
import { BiSolidUserRectangle } from "react-icons/bi";
import { GeneralContext } from "../App";
import { RoleTyps } from './Navbar';

const useStyles = styled({
  root: {
    width: 500,
  },
});
const pages = [
    { route: "/about", title: "About" },
    { route: "/favcards", title: "Favcards",permissions: [RoleTyps.user, RoleTyps.business, RoleTyps.admin],},
    {route: "/mycards",title: "Mycards",permissions: [RoleTyps.business, RoleTyps.admin],},
  ];
  const checkPermissions = (permissions, userRoletype) => {
    return permissions.includes(userRoletype);
  };
export default function BottomNav() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { user, setUser, setLoader, userRoleTyps, setUserRoleType } =
  useContext(GeneralContext);
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels //????
      className={`${classes.root} bottom-nav`}
    >
      <BottomNavigationAction label="About" icon={<FcAbout className='bottom-nav-icon' />} />
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon className='fav bottom-nav-icon' />} />
      <BottomNavigationAction label="My Cards" icon={<BiSolidUserRectangle className='bottom-nav-icon' />} />
    </BottomNavigation>
  );
}
