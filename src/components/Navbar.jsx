import { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { GeneralContext, lightTheme } from "../App";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { PiUserCircleDuotone } from "react-icons/pi";
import { BsSearch } from "react-icons/bs";

export const RoleTyps = {
  none: 0,
  user: 1,
  business: 2,
  admin: 3,
};
const checkPermissions = (permissions, userRoletype) => {
  return permissions.includes(userRoletype);
};
const pages = [
  { route: "/about", title: "About" },
  { route: "/login", title: "Login", permissions: [RoleTyps.none] },
  { route: "/signup", title: "Signup", permissions: [RoleTyps.none] },
  { route: "/favcards", title: "Favcards", permissions: [RoleTyps.user, RoleTyps.business, RoleTyps.admin], },
  { route: "/mycards", title: "Mycards", permissions: [RoleTyps.business, RoleTyps.admin], },
  { route: "/admin", title: "Admin", permissions: [RoleTyps.admin], },];
const settings = [
  { route: "/account", title: "Account", permissions: [RoleTyps.user, RoleTyps.business, RoleTyps.admin], },
];
export default function Navbar({ theme, onToggleTheme, onSearchChange }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    onSearchChange(event.target.value); // Pass the search query to the parent component
  }
  const { user, setUser, setLoader, userRoleTyps, setUserRoleType, currentTheme } = useContext(GeneralContext);
  const navigate = useNavigate();
  const path = useResolvedPath().pathname;
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const logout = () => {
    setLoader(true);
    fetch(`https://api.shipap.co.il/clients/logout`, {
      credentials: "include",
    }).then(() => {
      setUser();
      setUserRoleType(RoleTyps.none);
      setLoader(false);
      navigate("/");
    });
    handleCloseUserMenu();
  };
  const shouldShowSearchBar = !(
    location.pathname === '/about' ||
    location.pathname === '/login' ||
    location.pathname === '/account' ||
    location.pathname === '/signup' ||
    location.pathname.startsWith('/business/')
  );
  return (
    <AppBar  style={{width:'101%', minWidth: location.pathname !== '/about' ? '450px' : '' }} className="top-nav" position="static">
      <Container maxWidth="xl"> 
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2, display: { xs: "none", md: "flex" },
              fontWeight: 700, letterSpacing: ".2rem", color: "inherit", textDecoration: "none", }}>
            {user ? user.fullName : "CardCraft"}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit" >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left", }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" }, }} >
              {pages.filter((page) => !page.permissions ||
                checkPermissions(page.permissions, userRoleTyps))
                .map((page) => (
                  <Link key={page.route} to={page.route} style={{ color: currentTheme === lightTheme ? 'black' : 'white' }}>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  </Link>
                ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to={'/'}
            sx={{
              mr: 1,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: ".1rem",
              color: "inherit",}}>
            {user ? user.firstName : "CardCraft"}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.filter((page) => !page.permissions ||
              checkPermissions(page.permissions, userRoleTyps))
              .map((page) => (
                <Link key={page.route} to={page.route}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block", backgroundColor: page.route === path ? (currentTheme === lightTheme ? 'cornflowerblue' : '#5e5e5e') : '' }}>
                    {page.title}
                  </Button>
                </Link>
              ))}
          </Box>
          {shouldShowSearchBar && (
            <div className="search-box"><input className='search' type="text" placeholder="Search..." 
            value={searchQuery} onChange={handleSearchChange} /><BsSearch className="search-icon"/></div>
          )}
          {theme === lightTheme ? <MdOutlineDarkMode onClick={onToggleTheme} className="theme" /> :
            <MdOutlineLightMode onClick={onToggleTheme} className="theme" />}
          {user ? (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, marginLeft: '20px' }}>
                    <Avatar alt={user.fullName} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }} id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right", }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right", }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {settings.filter((s) => !s.permissions || checkPermissions(s.permissions, userRoleTyps))
                    .map((s) => (
                      <Link
                        key={s.route} to={s.route}
                        style={{ color: currentTheme === lightTheme ? 'black' : 'white' }} >
                        <MenuItem onClick={handleCloseUserMenu}>
                          <Typography textAlign="left">{s.title} <PiUserCircleDuotone style={{ marginBottom: '-5px', fontSize: '1.3rem' }} /></Typography>
                        </MenuItem>
                      </Link>
                    ))}
                  <MenuItem onClick={logout}>
                    <Typography textAlign="left">Logout <RiLogoutBoxRLine style={{ marginBottom: '-5px', marginLeft: '10px', fontSize: '1.3rem' }} /></Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>) : ("")}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

