import { AppBar, Box, SxProps, Theme } from "@mui/material";
import React from "react";
import { Logo } from "./Logo";
import { NavbarUserMenu } from "./NavbarUserMenu";

interface NavbarProps {
  sx: SxProps<Theme>;
  children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ sx, children }) => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        borderBottom: 2,
        borderColor: "rgb(229, 231, 235);",
        paddingLeft: 4,
        display: "flex",
        ...sx,
      }}
      elevation={0}
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        {children && children}
        <Logo variant="dark" />
        <NavbarUserMenu />
      </Box>
    </AppBar>
  );
};
