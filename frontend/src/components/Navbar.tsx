import { AppBar } from "@mui/material";
import React from "react";
import { Logo } from "./Logo";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        borderBottom: 2,
        borderColor: "rgb(229, 231, 235);",
        paddingLeft: 4,
      }}
      elevation={0}
    >
      <Logo />
    </AppBar>
  );
};
