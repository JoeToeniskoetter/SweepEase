import {
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
  Skeleton,
} from "@mui/material";
import React, { useMemo } from "react";
import { useInspectionTemplateOptions } from "../hooks/useInspectionTemplateOptions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInspectionOrder } from "../hooks/useCreateInspectionOrder";

interface InspectionOrderInfoFormProps {
  onSave: () => void;
}

interface InspectionOrderInfoFormType {
  customerName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  templateId: string;
}

const InspectionOrderFormSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  address: z.string().min(1, { message: "Customer address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zip: z.string().min(5, { message: "zip is required" }),
  phone: z.string().optional(),
  templateId: z.string().min(1, { message: "inspection template is required" }),
});

export const InspectionOrderInfoForm: React.FC<
  InspectionOrderInfoFormProps
> = ({ onSave }) => {
  const { data, isLoading } = useInspectionTemplateOptions();
  const { mutateAsync: createInspectionOrder, isPending } =
    useCreateInspectionOrder();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InspectionOrderInfoFormType>({
    resolver: zodResolver(InspectionOrderFormSchema),
  });

  const onSubmit = async (values: InspectionOrderInfoFormType) => {
    try {
      await createInspectionOrder({ ...values, phone: "" });
      onSave();
    } catch (e) {
      console.error(e);
    }
  };

  const skeletons = useMemo(() => {
    const arr = new Array(7).fill(7);
    return arr.map((i) => <Skeleton key={i} sx={{ marginTop: 5 }} />);
  }, []);

  if (isLoading) {
    return skeletons;
  }
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2} mt={2}>
      <Box>
        <Typography fontWeight={"bold"}>Customer Name</Typography>
        <TextField
          placeholder="John Smith"
          fullWidth
          {...register("customerName")}
          error={errors.customerName?.message !== undefined}
          helperText={errors.customerName?.message}
        />
      </Box>
      <Box>
        <Typography fontWeight={"bold"}>Customer Address</Typography>
        <TextField
          placeholder="123 Something st."
          fullWidth
          {...register("address")}
          error={errors.address?.message !== undefined}
          helperText={errors.address?.message}
        />
      </Box>
      <Box display={"flex"} gap={2}>
        <Box width={"50%"}>
          <Typography fontWeight={"bold"}>City</Typography>
          <TextField
            placeholder="St. Louis"
            fullWidth
            {...register("city")}
            error={errors.city?.message !== undefined}
            helperText={errors.city?.message}
          />
        </Box>
        <Box width={"50%"}>
          <Typography fontWeight={"bold"}>State</Typography>
          <TextField
            placeholder="MO"
            fullWidth
            {...register("state")}
            error={errors.state?.message !== undefined}
            helperText={errors.state?.message}
          />
        </Box>
      </Box>
      <Box>
        <Typography fontWeight={"bold"}>Zip</Typography>
        <TextField
          placeholder="63305"
          fullWidth
          {...register("zip")}
          error={errors.zip?.message !== undefined}
          helperText={errors.zip?.message}
        />
      </Box>
      <Box>
        <Typography fontWeight={"bold"}>Phone</Typography>
        <TextField
          placeholder="555-555-5555"
          fullWidth
          {...register("phone")}
          error={errors.phone?.message !== undefined}
          helperText={errors.phone?.message}
        />
      </Box>
      <Box>
        <Typography fontWeight={"bold"}>Inspection Template</Typography>
        <TextField
          select
          fullWidth
          placeholder={data?.at(0)?.name}
          {...register("templateId")}
          error={errors.templateId?.message !== undefined}
          helperText={errors.templateId?.message}
        >
          {data?.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
        {isPending ? (
          <CircularProgress color="secondary" />
        ) : (
          <Typography fontWeight={"bold"} color={"white"} variant="body2">
            Create
          </Typography>
        )}
      </Button>
    </Box>
  );
};
