import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React from "react";
import { useUpdateUser } from "../hooks/useUpdateUser";

interface UpdateUserModalProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  onClose,
  open,
  userId,
}) => {
  const [role, setRole] = React.useState("");
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5">Update User</Typography>
        <Box pt={2} display={"flex"} flexDirection={"column"} gap={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
              <MenuItem value={"USER"}>USER</MenuItem>
            </Select>
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            startIcon={
              isPending && (
                <CircularProgress sx={{ color: "white", fontSize: 18 }} />
              )
            }
            disabled={false}
            onClick={async () => {
              await updateUser({ id: userId, role });
              onClose();
            }}
            sx={{ color: "white" }}
          >
            Update User
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
