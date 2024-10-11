import { ContentCopy, Delete, Edit, MoreHoriz } from "@mui/icons-material";
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
import { Link } from "react-router-dom";
import { useDeleteTemplate } from "../hooks/useDeleteTemplate";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { CopyTemplateDialog } from "./CopyTemplateDialog";

interface InspectionTemplateOptionsProps {
  template: InspectionTemplate;
}

export const InspectionTemplateOptions: React.FC<
  InspectionTemplateOptionsProps
> = ({ template }) => {
  const [copyTemplateDialogOpen, setCopyTemplateDialogOpen] =
    useState<boolean>(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
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
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: "white",
          boxShadow: 1,
          ":hover": { bgcolor: "lightgrey" },
        }}
        size="small"
      >
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
            {template.canEdit && (
              <Link to={template.id} style={{ all: "unset" }}>
                <MenuItem>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
              </Link>
            )}
            {template.canEdit && (
              <MenuItem
                onClick={() => {
                  setConfirmationDialogOpen(true);
                }}
              >
                <ListItemIcon>
                  {isPending ? (
                    <CircularProgress size={18} />
                  ) : (
                    <Delete fontSize="small" color="error" />
                  )}
                </ListItemIcon>
                <ListItemText sx={{ color: "red" }}>Delete</ListItemText>
              </MenuItem>
            )}
            <MenuItem onClick={() => setCopyTemplateDialogOpen(true)}>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
          </MenuList>
        </Box>
      </Menu>
      <ConfirmationDialog
        content={
          <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
            {isPending && <CircularProgress />}

            <Typography>
              {isPending
                ? "Removing Inpsection Template"
                : "Are you sure you want to delete this temlate?"}
            </Typography>
          </Box>
        }
        onAccept={async () => {
          await deleteTemplate({ id: template.id });
        }}
        onCancel={() => {
          setConfirmationDialogOpen(false);
          handleClose();
        }}
        onClose={() => {
          setConfirmationDialogOpen(false);
          handleClose();
        }}
        open={confirmationDialogOpen}
        title="Delete template?"
      />
      <CopyTemplateDialog
        template={template}
        onClose={() => setCopyTemplateDialogOpen(false)}
        open={copyTemplateDialogOpen}
      />
    </>
  );
};
