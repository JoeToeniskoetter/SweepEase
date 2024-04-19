import {
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { InviteUserModal } from "../components/InviteUserModal";
import { UserInvitesTable } from "../components/UserInvitesTable";
import { UsersTable } from "../components/UsersTable";
import { AddCircleOutline } from "@mui/icons-material";
import { ProtectedComponent } from "../components/ProtectedComponent";

interface UsersProps {}

export const Users: React.FC<UsersProps> = () => {
  const [tab, setTab] = useState<number>(0);
  const [inviteUserModalOpen, setInviteUserModalOpen] =
    useState<boolean>(false);
  const theme = useTheme();
  return (
    <>
      <Box
        display={"flex"}
        alignItems={"start"}
        justifyContent={"start"}
        width={"100%"}
        bgcolor={theme.palette.secondary.main}
        sx={{ height: 120, p: 4 }}
        flexDirection={"column"}
      >
        <Typography variant="h5" sx={{ color: "white" }} fontWeight={"bold"}>
          Users
        </Typography>
        <Typography sx={{ color: "white" }} fontWeight={"light"}>
          View and manager your users here
        </Typography>
      </Box>
      <Container maxWidth="lg">
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={2}
        >
          <ProtectedComponent allowedRoles={["ADMIN", "CREATOR"]}>
            <Button
              onClick={() => setInviteUserModalOpen(true)}
              startIcon={<AddCircleOutline />}
              variant="outlined"
            >
              Invite user
            </Button>
          </ProtectedComponent>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }} mb={4}>
            <Tabs
              value={tab}
              onChange={(_event: React.SyntheticEvent, newValue: number) => {
                setTab(newValue);
              }}
              aria-label="basic tabs example"
            >
              <Tab label="Users" />
              <ProtectedComponent allowedRoles={["ADMIN", "CREATOR"]}>
                <Tab label="Invites" />
              </ProtectedComponent>
            </Tabs>
          </Box>
          {tab === 0 && <UsersTable />}
          {tab === 1 && <UserInvitesTable />}
        </Box>
      </Container>
      <InviteUserModal
        open={inviteUserModalOpen}
        onClose={() => setInviteUserModalOpen(false)}
      />
    </>
  );
};
