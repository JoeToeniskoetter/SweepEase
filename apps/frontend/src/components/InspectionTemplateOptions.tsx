import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useDeleteTemplate } from "../hooks/useDeleteTemplate";

interface InspectionTemplateOptionsProps {
  id: string;
}

export const InspectionTemplateOptions: React.FC<
  InspectionTemplateOptionsProps
> = ({ id }) => {
  const { mutateAsync: deleteTemplate, isPending } = useDeleteTemplate();
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
        <Box sx={{ maxWidth: "100%" }}>
          <MenuList>
            <Link to={id} style={{ all: "unset" }}>
              <MenuItem>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            </Link>
            <MenuItem
              onClick={async () => {
                await deleteTemplate({ id });
              }}
            >
              <ListItemIcon>
                {isPending ? <CircularProgress /> : <Delete fontSize="small" />}
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </MenuList>
        </Box>
      </Menu>
    </>
  );
};
