import { Edit, MoreHoriz } from "@mui/icons-material";
import {
  Button,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { UpdateUserModal } from "./UpdateUserModal";
import { useAuth } from "../context/AuthContext";

interface UserTableOptionsProps {
  id: string;
}

export const UsertableOptions: React.FC<UserTableOptionsProps> = ({ id }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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
            {user?.uid === id ? (
              <Typography variant="caption">
                Editing your own account is not allowed
              </Typography>
            ) : (
              <Button
                startIcon={<Edit />}
                onClick={() => setModalOpen(true)}
                sx={{ textTransform: "none", color: "black" }}
              >
                <ListItemText>Edit User</ListItemText>
              </Button>
            )}
          </MenuItem>
        </MenuList>
      </Menu>
      <UpdateUserModal
        userId={id}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setAnchorEl(null);
        }}
      />
    </>
  );
};
