import { MoreHoriz, Refresh } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import React from "react";
import { useResendInvite } from "../hooks/useResendInvite";

interface InspectionOrderOptionsProps {
  id: string;
  invite: UserInvite;
}

export const UserInviteOptions: React.FC<InspectionOrderOptionsProps> = ({
  invite,
}) => {
  const { mutateAsync: resend, isPending } = useResendInvite();
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
      <MenuItem
        onClick={async () => {
          await resend({ id: invite.id });
          handleClose();
        }}
      >
        <ListItemIcon>
          {isPending ? (
            <CircularProgress sx={{ color: "black" }} size={18} />
          ) : (
            <Refresh />
          )}
        </ListItemIcon>
        <ListItemText>Resend</ListItemText>
      </MenuItem>
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
