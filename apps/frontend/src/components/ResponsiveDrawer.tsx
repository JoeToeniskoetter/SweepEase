import {
  ContentPasteTwoTone,
  HomeTwoTone,
  ListAltTwoTone,
  Logout,
  Menu,
} from "@mui/icons-material";
import { Button, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

const tabs = [
  // {
  //   name: "Home",
  //   icon: <HomeTwoTone />,
  //   path: "",
  // },
  {
    name: "Inspections",
    icon: <ContentPasteTwoTone />,
    path: "inspections",
  },
  {
    name: "Templates",
    icon: <ListAltTwoTone />,
    path: "templates",
  },
];

export default function ResponsiveDrawer(props: Props) {
  const { signOut } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const isActive = (path: string) => {
    if (path === "" && location.pathname === "/dashboard") {
      return true;
    }

    const pathSegs = location.pathname.split("/");
    return pathSegs[2] === path;
  };

  const drawer = (
    <Box
      px={2}
      height={"100%"}
      display="flex"
      flexDirection={"column"}
      justifyContent={"space-between"}
    >
      <Box>
        <Toolbar sx={{ display: { xs: "none", sm: "flex" } }}>
          <Logo variant="dark" />
        </Toolbar>
        <Divider />
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {tabs.map((tab) => {
            return (
              <Link
                key={tab.name}
                to={tab.path}
                style={{
                  textDecoration: "none",
                  color: "grey",
                }}
              >
                <ListItem
                  key={tab.name}
                  disablePadding
                  sx={{
                    backgroundColor: isActive(tab.path) ? "#faddd7" : "white",
                    borderRadius: 2,
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        color: isActive(tab.path)
                          ? theme.palette.secondary.main
                          : "grey",
                      }}
                    >
                      {tab.icon}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        color: isActive(tab.path)
                          ? theme.palette.secondary.main
                          : "grey",
                      }}
                      primary={tab.name}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Box>
      <Button
        startIcon={<Logout />}
        fullWidth
        onClick={async () => await signOut()}
      >
        Sign Out
      </Button>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: 1,
          borderColor: "rgb(229, 231, 235);",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            backgroundColor: "white",
            height: 50,
            display: { xs: "flex", sm: "none" },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
          <Logo variant="dark" />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar
          sx={{
            display: { xs: "flex", sm: "none" },
          }}
        />
        <Outlet />
      </Box>
    </Box>
  );
}
