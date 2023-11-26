import  { useContext, useEffect, useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { HiOutlineInformationCircle } from "react-icons/hi";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { FaUsersCog } from "react-icons/fa";
import { FaRegIdCard } from "react-icons/fa";
import { GeneralContext,darkTheme } from "../App";
import { RoleTyps } from './Navbar';
import { Link, useResolvedPath } from 'react-router-dom';

const pages = [
    { route: "/about", title: "About", icon: <HiOutlineInformationCircle /> },
    { route: "/favcards", title: "Favorites", icon: <FavoriteIcon />, permissions: [RoleTyps.user, RoleTyps.business, RoleTyps.admin] },
    { route: "/mycards", title: "My cards", icon: <FaRegIdCard />, permissions: [RoleTyps.business, RoleTyps.admin] },
    {route:'/admin',title:'Admin',icon:<FaUsersCog/>,permissions:[RoleTyps.admin]},
];

const checkPermissions = (permissions, userRoletype) => {
    return permissions.includes(userRoletype);
};
export default function BottomNav() {
    const [value, setValue] = useState(0);
    const path = useResolvedPath().pathname;
    const { userRoleTyps,currentTheme } = useContext(GeneralContext);
    const activePageIndex = pages.findIndex((page) => page.route === path);

    useEffect(() => {
        if (activePageIndex !== -1) {
            setValue(activePageIndex);
        }
    }, [activePageIndex]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
 const style={
    backgroundColor:currentTheme===darkTheme?'rgb(40 40 40)':'#aad3ff',
    color: currentTheme === darkTheme ? 'white' : 'black'
 }
    return (
        <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            className={'bottom-nav'}
            style={style}>
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


