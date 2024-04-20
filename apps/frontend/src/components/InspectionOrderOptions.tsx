import { Delete, MoreHoriz, Start } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStartInspection } from "../hooks/useStartInspection";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useDeleteInspectionOrder } from "../hooks/useDeleteInspectionOrder";

interface InspectionOrderOptionsProps {
  id: string;
  status: string;
}

export const InspectionOrderOptions: React.FC<InspectionOrderOptionsProps> = ({
  id,
  status,
}) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const {
    mutateAsync: deleteInspectionOrder,
    isPending: isDeletingInspectionOrder,
  } = useDeleteInspectionOrder();
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
      return [
        <MenuItem
          onClick={async () => {
            try {
              await startInspection({ id });
              navigate(`/inspections/${id}`);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <ListItemIcon>
            {isPending ? <CircularProgress size={18} /> : <Start />}
          </ListItemIcon>
          <ListItemText>Begin Inspection</ListItemText>
        </MenuItem>,
        <MenuItem
          onClick={async () => {
            try {
              setConfirmationDialogOpen(true);
            } catch (e) {
              console.error(e);
            }
          }}
          sx={{ color: "red" }}
        >
          <ListItemIcon>
            {isPending ? (
              <CircularProgress size={18} />
            ) : (
              <Delete color="error" />
            )}
          </ListItemIcon>
          <ListItemText>Delete Inspection</ListItemText>
        </MenuItem>,
      ];
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

    if (status === "COMPLETE") {
      return (
        <Link to={`/inspections/${id}`} style={{ all: "unset" }}>
          <MenuItem>
            <ListItemIcon>
              {isPending ? <CircularProgress size={18} /> : <Start />}
            </ListItemIcon>
            <ListItemText>View Report</ListItemText>
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
      <ConfirmationDialog
        open={confirmationDialogOpen}
        content={
          <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
            {isDeletingInspectionOrder && <CircularProgress />}

            <Typography>
              {isDeletingInspectionOrder
                ? "Removing Inpsection Order"
                : "Are you sure you want to delete this order?"}
            </Typography>
          </Box>
        }
        title="Delete inspection order?"
        onAccept={async () => {
          await deleteInspectionOrder({ id });
          setConfirmationDialogOpen(false);
          handleClose();
        }}
        onCancel={() => {
          setConfirmationDialogOpen(false);
          handleClose();
        }}
        onClose={() => {
          setConfirmationDialogOpen(false);
          handleClose();
        }}
      />
    </>
  );
};
