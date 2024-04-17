import React from "react";
import { useAuth } from "../context/AuthContext";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircleTwoTone } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface NavbarUserMenuProps {}

export const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({}) => {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (!user) {
    return null;
  }

  return (
    <Box display={"flex"} sx={{ pr: 2 }}>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <AccountCircleTwoTone sx={{ fontSize: 36 }} color="primary" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Link to="/dashboard" style={{ all: "unset" }}>
          <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        </Link>
        <MenuItem
          onClick={async () => {
            await signOut();
            handleClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};
