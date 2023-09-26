import  { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles'; 
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { HiOutlineInformationCircle } from "react-icons/hi";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { BiSolidUserRectangle } from "react-icons/bi";
import { GeneralContext } from "../App";
import { RoleTyps } from './Navbar';
import { Link, useResolvedPath } from 'react-router-dom';

const useStyles = () => styled('div')({ 
    root: {
        width: 500,
    },
});

const pages = [
    { route: "/about", title: "About", icon: <HiOutlineInformationCircle /> },
    { route: "/favcards", title: "Favcards", icon: <FavoriteIcon />, permissions: [RoleTyps.user, RoleTyps.business, RoleTyps.admin] },
    { route: "/mycards", title: "Mycards", icon: <BiSolidUserRectangle />, permissions: [RoleTyps.business, RoleTyps.admin] },
];

const checkPermissions = (permissions, userRoletype) => {
    return permissions.includes(userRoletype);
};
export default function BottomNav() {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const path = useResolvedPath().pathname;
    const { user, setUser, setLoader, userRoleTyps, setUserRoleType } = useContext(GeneralContext);

    // Find the index of the page that matches the current path
    const activePageIndex = pages.findIndex((page) => page.route === path);

    // Set the active page index as the initial value for BottomNavigation
    useEffect(() => {
        if (activePageIndex !== -1) {
            setValue(activePageIndex);
        }
    }, [activePageIndex]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            className={`${classes.root} bottom-nav`}
        >
            {pages
                .filter((page) => !page.permissions || checkPermissions(page.permissions, userRoleTyps))
                .map((page) => (
                    <BottomNavigationAction
                        key={page.route}
                        label={page.title}
                        icon={page.icon}
                        className='bottom-nav-icon'
                        component={Link}
                        to={page.route}
                    />
                ))}
        </BottomNavigation>
    );
}
