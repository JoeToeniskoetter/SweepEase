import { MoreHoriz, Refresh, RefreshTwoTone } from "@mui/icons-material";
import {
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
      <Button
        sx={{ maxWidth: "100%", textTransform: "none" }}
        color="secondary"
        onClick={async () => {
          try {
            console.log("tru");
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <MenuItem>
          <Button
            startIcon={
              isPending ? (
                <CircularProgress sx={{ color: "black", fontSize: 18 }} />
              ) : (
                <Refresh />
              )
            }
            onClick={async () => await resend({ id: invite.id })}
            sx={{ textTransform: "none", color: "black" }}
          >
            <ListItemText>Resend</ListItemText>
          </Button>
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
