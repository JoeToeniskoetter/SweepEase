import { Close, Delete, Edit, MoreHoriz, Start } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStartInspection } from "../hooks/useStartInspection";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useDeleteInspectionOrder } from "../hooks/useDeleteInspectionOrder";
import { ProtectedComponent } from "./ProtectedComponent";
import { InspectionOrderInfoForm } from "./InspectionOrderInfoForm";

interface InspectionOrderOptionsProps {
  inspection: InspectionOrder;
  status: string;
}

export const InspectionOrderOptions: React.FC<InspectionOrderOptionsProps> = ({
  inspection,
  status,
}) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    mutateAsync: deleteInspectionOrder,
    isPending: isDeletingInspectionOrder,
  } = useDeleteInspectionOrder();
  const { mutateAsync: startInspection, isPending: startingInspection } =
    useStartInspection();
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
              await startInspection({ id: inspection.id });
              navigate(`/inspections/${inspection.id}`);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <ListItemIcon>
            {startingInspection ? <CircularProgress size={18} /> : <Start />}
          </ListItemIcon>
          <ListItemText>Begin Inspection</ListItemText>
        </MenuItem>,
        <ProtectedComponent allowedRoles={["ADMIN", "CREATOR"]}>
          <MenuItem
            onClick={async () => {
              setUpdateModalOpen(true);
            }}
          >
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Edit Inspection</ListItemText>
          </MenuItem>
        </ProtectedComponent>,
        <ProtectedComponent allowedRoles={["ADMIN", "CREATOR"]}>
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
              {isDeletingInspectionOrder ? (
                <CircularProgress size={18} />
              ) : (
                <Delete color="error" />
              )}
            </ListItemIcon>
            <ListItemText>Delete Inspection</ListItemText>
          </MenuItem>
        </ProtectedComponent>,
      ];
    }
    if (status === "IN PROGRESS") {
      return (
        <Link to={`/inspections/${inspection.id}`} style={{ all: "unset" }}>
          <MenuItem>
            <ListItemIcon>
              <Start />
            </ListItemIcon>
            <ListItemText>Resume Inspection</ListItemText>
          </MenuItem>
        </Link>
      );
    }

    if (status === "COMPLETE") {
      return (
        <Link
          to={`/inspections/${inspection.id}/review`}
          style={{ all: "unset" }}
        >
          <MenuItem>
            <ListItemIcon>
              <Start />
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
          await deleteInspectionOrder({ id: inspection.id });
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
      <Modal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
            maxHeight: "100%",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            width: "50%",
            minWidth: 400,
            scrollbarWidth: "none",
          }}
        >
          <Box display={"flex"} justifyContent={"end"}>
            <IconButton onClick={() => setUpdateModalOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Typography variant="h5" fontWeight={"bold"}>
            Update Inspection Order
          </Typography>
          <Typography fontWeight={"light"}>
            Provide us some details about this inspection
          </Typography>
          <InspectionOrderInfoForm
            onSave={() => {
              setUpdateModalOpen(false);
              handleClose();
            }}
            inspectionOrder={inspection}
          />
        </Box>
      </Modal>
    </>
  );
};
