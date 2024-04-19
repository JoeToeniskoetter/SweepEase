import { MoreHoriz, Start } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface UserTableOptionsProps {
  id: string;
}

export const UsertableOptions: React.FC<UserTableOptionsProps> = ({ id }) => {
  const navigate = useNavigate();
  console.log(id, navigate);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <Start />
            </ListItemIcon>
            <ListItemText>Edit User</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
