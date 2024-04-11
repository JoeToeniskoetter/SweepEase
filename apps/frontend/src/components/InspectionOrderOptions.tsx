import { MoreHoriz, Start } from "@mui/icons-material";
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
  status: string;
}

export const InspectionOrderOptions: React.FC<InspectionOrderOptionsProps> = ({
  id,
  status,
}) => {
  const navigate = useNavigate();
  const { mutateAsync: startInspection, isPending } = useStartInspection();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderOptions = () => {
    if (status === "NEW") {
      return (
        <Button
          sx={{ maxWidth: "100%", textTransform: "none" }}
          color="secondary"
          onClick={async () => {
            try {
              await startInspection({ id });
              navigate(`/inspections/${id}`);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <MenuItem>
            <ListItemIcon>
              {isPending ? <CircularProgress size={18} /> : <Start />}
            </ListItemIcon>
            <ListItemText>Begin Inspection</ListItemText>
          </MenuItem>
        </Button>
      );
    }
    if (status === "IN PROGRESS") {
      return (
        <Link to={`/inspections/${id}`} style={{ all: "unset" }}>
          <MenuItem>
            <ListItemIcon>
              {isPending ? <CircularProgress size={18} /> : <Start />}
            </ListItemIcon>
            <ListItemText>Resume Inspection</ListItemText>
          </MenuItem>
        </Link>
      );
    }

    return null;
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
