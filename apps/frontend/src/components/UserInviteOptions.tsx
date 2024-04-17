import { MoreHoriz, RefreshTwoTone, Start } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStartInspection } from "../hooks/useStartInspection";

interface InspectionOrderOptionsProps {
  id: string;
  invite: UserInvite;
}

export const UserInviteOptions: React.FC<InspectionOrderOptionsProps> = ({
  id,
  invite,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderOptions = () => {
    return (
      <Button
        sx={{ maxWidth: "100%", textTransform: "none" }}
        color="secondary"
        onClick={async () => {
          try {
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <RefreshTwoTone />
          </ListItemIcon>
          <ListItemText>Resend</ListItemText>
        </MenuItem>
      </Button>
    );
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreHoriz />
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
        <MenuList>{renderOptions()}</MenuList>
      </Menu>
    </>
  );
};
