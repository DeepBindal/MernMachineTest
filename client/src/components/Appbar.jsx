import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { NavLink, Link } from "react-router-dom";
import AdbIcon from "@mui/icons-material/Adb";
import { MenuItem } from "@mui/material";
import { Context } from "../main";

const pages = [
  { label: "Home", route: "/" },
  { label: "Create Employee", route: "/create-employee" },
  { label: "Employee List", route: "/employees" },
];

function Appbar() {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = React.useContext(Context);
  const handleClick = () => {
    setIsAuthenticated(false);
    setUser({});
  }
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <NavLink
                  to={page.route}
                  key={page.label}
                  // style={({ isActive }) => ({
                  //   textDecoration: "none",
                  //   // color: isActive ? "#1976d2" : "inherit",
                  // })}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {page.label}
                    </Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 2 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {pages.map((page) => (
              <NavLink
                key={page.route}
                to={page.route}
                style={({ isActive }) => ({
                  //   textDecoration: "none",
                  color: isActive ? "#0be646" : "white",
                  marginLeft: "20px",
                  fontWeight: isActive ? "bold" : "normal",
                })}
                onClick={handleCloseNavMenu}
              >
                <Typography variant="button" sx={{ my: 2, display: "block" }}>
                  {page.label}
                </Typography>
              </NavLink>
            ))}
          </Box>
          {isAuthenticated ? (
            <div className="flex gap-3 items-center">
              {user.user.username}
              <Button onClick={handleClick} variant="contained" color="success" sx={{ mr: 1 }}>
                Logout
              </Button>
            </div>
          ) : (
            <Box sx={{ ml: 2 }}>
              <Link to="/signup">
                <Button variant="contained" color="success" sx={{ mr: 1 }}>
                  Signup
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="contained" color="success">
                  Login
                </Button>
              </Link>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Appbar;
