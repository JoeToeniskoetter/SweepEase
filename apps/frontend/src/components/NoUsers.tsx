import { PersonAddAlt } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { InviteUserModal } from "./InviteUserModal";
import { ProtectedComponent } from "./ProtectedComponent";
import { UserRole } from "../context/UserRole";

interface NoUsersProps {}

export const NoUsers: React.FC<NoUsersProps> = () => {
  const [inviteUserModalOpen, setInviteUserModalOpen] =
    useState<boolean>(false);
  return (
    <ProtectedComponent allowedRoles={[UserRole.ADMIN, UserRole.CREATOR]}>
      <Box
        sx={{ width: "100%" }}
        display={"flex"}
        bgcolor={"#ebebeb"}
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
          <Typography variant="h6">No users found</Typography>
          <Button
            startIcon={<PersonAddAlt />}
            variant="outlined"
            onClick={() => setInviteUserModalOpen(true)}
          >
            Invite user
          </Button>
        </Box>
        <InviteUserModal
          open={inviteUserModalOpen}
          onClose={() => setInviteUserModalOpen(false)}
        />
      </Box>
    </ProtectedComponent>
  );
};
