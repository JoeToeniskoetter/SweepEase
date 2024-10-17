import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateCompany } from "../hooks/useCreateCompany";

interface CreateCompanyFormProps {
  onSave: () => void;
}

export const CreateCompanyForm: React.FC<CreateCompanyFormProps> = ({
  onSave,
}) => {
  const { mutateAsync: createCompany, error, isPending } = useCreateCompany();
  const { register, handleSubmit, control, watch } =
    useForm<CreateCompanyInput>();

  const onSubmit = async (data: CreateCompanyInput) => {
    try {
      await createCompany(data);
      onSave();
    } catch (e) {
      console.error(e);
    }
  };

  const logo = watch("logo");
  const renderPhoto = () => {
    if (logo) {
      console.log("have photo from form", logo);
      return (
        <Box py={2}>
          <img src={URL.createObjectURL(logo)} width={250} />
        </Box>
      );
    }

    return null;
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      width={"100%"}
      maxWidth={"sm"}
    >
      <Typography>Name</Typography>
      <TextField
        {...register("name")}
        fullWidth
        variant="outlined"
        placeholder="ABC Chimney"
      />
      <Typography>Address</Typography>
      <TextField
        {...register("address")}
        fullWidth
        variant="outlined"
        placeholder="123 Main St."
      />
      <Box display={"flex"} gap={2}>
        <Box>
          <Typography>City</Typography>
          <TextField
            {...register("city")}
            fullWidth
            variant="outlined"
            placeholder="St Louis"
          />
        </Box>
        <Box>
          <Typography>State</Typography>
          <TextField
            {...register("state")}
            fullWidth
            variant="outlined"
            placeholder="MO"
          />
        </Box>
        <Box>
          <Typography>Zip</Typography>
          <TextField
            {...register("zip")}
            fullWidth
            variant="outlined"
            placeholder="63305"
          />
        </Box>
      </Box>
      <Typography>Phone</Typography>
      <TextField
        {...register("phone")}
        fullWidth
        variant="outlined"
        placeholder="(555)-555-5555"
      />
      <Controller
        name="logo"
        control={control}
        render={({ field }) => (
          <>
            <Typography>Company Logo</Typography>
            <TextField
              type="file"
              inputProps={{ accept: "image/*" }}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;

                if (!files || files?.length == 0) {
                  return;
                }

                const firstFile = files[0];

                if (e.target.files && e.target.files.length > 0) {
                  field.onChange(firstFile);
                }
              }}
            />
          </>
        )}
      />
      {renderPhoto()}
      {error && <Alert severity="error">Failed to create company</Alert>}
      <Button
        variant="contained"
        sx={{ color: "white" }}
        onClick={handleSubmit(onSubmit)}
      >
        {isPending ? (
          <CircularProgress sx={{ color: "white" }} size={24} />
        ) : (
          "Save"
        )}
      </Button>
    </Box>
  );
};
