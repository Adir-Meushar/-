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
import { Link, useNavigate, useResolvedPath } from "react-router-dom";
import { GeneralContext, lightTheme } from "../App";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import SearchBar from "./SearchBar";
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
  { route: "/admin", title: "User Managment", permissions: [RoleTyps.admin], },];
const settings = [
  { route: "/account", title: "Account", permissions: [RoleTyps.user, RoleTyps.business, RoleTyps.admin], },
];
export default function Navbar({ theme, onToggleTheme }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, setUser, setLoader, userRoleTyps, setUserRoleType } = useContext(GeneralContext);
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
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2, display: { xs: "none", md: "flex" }, fontFamily: "monospace",
              fontWeight: 700, letterSpacing: ".3rem", color: "inherit", textDecoration: "none",
            }}>
            {user ? user.fullName:"Bussines Cards"}
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
                  <Link key={page.route} to={page.route}>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  </Link>
                ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}>
            My Cards
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.filter((page) => !page.permissions ||
              checkPermissions(page.permissions, userRoleTyps))
              .map((page) => (
                <Link key={page.route} to={page.route}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block", backgroundColor: page.route === path ? 'cornflowerblue' : '' }}>
                    {page.title}
                  </Button>
                </Link>
              ))}
          </Box>
          <SearchBar />
          {theme === lightTheme ? <MdOutlineDarkMode onClick={onToggleTheme} className="theme" /> :
            <MdOutlineLightMode onClick={onToggleTheme} className="theme" />}
          {user ? (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.fullName} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right", }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right", }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {settings.filter((s) => !s.permissions || checkPermissions(s.permissions, userRoleTyps))
                    .map((s) => (
                      <Link
                        key={s.route}
                        to={s.route}
                        style={{ textDecoration: "none", color: "black" }} >
                        <MenuItem onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">{s.title}</Typography>
                        </MenuItem>
                      </Link>
                    ))}
                  <MenuItem onClick={logout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>) : ("")}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

