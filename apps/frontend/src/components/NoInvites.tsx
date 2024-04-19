import { PersonAddAlt } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { InviteUserModal } from "./InviteUserModal";
import { ProtectedComponent } from "./ProtectedComponent";

interface NoInvitesProps {}

export const NoInvites: React.FC<NoInvitesProps> = () => {
  const [inviteUserModalOpen, setInviteUserModalOpen] =
    useState<boolean>(false);
  return (
    <Box
      sx={{ width: "100%" }}
      display={"flex"}
      bgcolor={"white"}
      alignItems={"center"}
      justifyContent={"center"}
      height={200}
      borderRadius={5}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
      >
        <Typography variant="h6">No invites found</Typography>
        <ProtectedComponent
          allowedRoles={["ADMIN", "CREATOR"]}
          fallbackComponent={
            <Tooltip title="Missing required permissions. Reach your to your company admin to invite users">
              <span>
                <Button
                  disabled
                  startIcon={<PersonAddAlt />}
                  variant="outlined"
                >
                  Invite user
                </Button>
              </span>
            </Tooltip>
          }
        >
          <Button
            startIcon={<PersonAddAlt />}
            variant="outlined"
            onClick={() => setInviteUserModalOpen(true)}
          >
            Invite user
          </Button>
        </ProtectedComponent>
      </Box>
      <InviteUserModal
        open={inviteUserModalOpen}
        onClose={() => setInviteUserModalOpen(false)}
      />
    </Box>
  );
};
