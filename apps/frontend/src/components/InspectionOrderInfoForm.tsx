import {
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
  Skeleton,
  Select,
  FormHelperText,
  FormControl,
} from "@mui/material";
import React, { useMemo } from "react";
import { useInspectionTemplateOptions } from "../hooks/useInspectionTemplateOptions";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInspectionOrder } from "../hooks/useCreateInspectionOrder";
import { useUpdateInspectionOrder } from "../hooks/useUpdateInspecitonOrder";

interface InspectionOrderInfoFormProps {
  onSave: () => void;
  inspectionOrder?: InspectionOrder;
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
> = ({ onSave, inspectionOrder }) => {
  const { mutateAsync: updateInspectionOrder, isPending: isUpdating } =
    useUpdateInspectionOrder();
  const { data, isLoading } = useInspectionTemplateOptions();
  const { mutateAsync: createInspectionOrder, isPending } =
    useCreateInspectionOrder();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InspectionOrderInfoFormType>({
    resolver: zodResolver(InspectionOrderFormSchema),
    defaultValues: {
      customerName: inspectionOrder?.customerName,
      address: inspectionOrder?.address,
      city: inspectionOrder?.city,
      phone: inspectionOrder?.phone,
      state: inspectionOrder?.state,
      zip: inspectionOrder?.zip,
      templateId: inspectionOrder?.template?.id,
    },
  });

  const onSubmit = async (values: InspectionOrderInfoFormType) => {
    try {
      if (inspectionOrder) {
        await updateInspectionOrder({ ...values, id: inspectionOrder.id });
      } else {
        await createInspectionOrder({ ...values });
      }
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
        <Typography fontWeight={"bold"}>Phone (Optional)</Typography>
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
        <Controller
          control={control}
          name="templateId"
          render={({ field }) => {
            return (
              <FormControl
                sx={{ minWidth: 120 }}
                fullWidth
                error={errors.templateId?.message !== undefined}
              >
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  fullWidth
                  error={errors.templateId?.message !== undefined}
                >
                  {data?.map((o) => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.templateId?.message && (
                  <FormHelperText>{errors.templateId?.message}</FormHelperText>
                )}
              </FormControl>
            );
          }}
        />
      </Box>
      <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
        {isPending || isUpdating ? (
          <CircularProgress sx={{ color: "white" }} size={18} />
        ) : (
          <Typography fontWeight={"bold"} color={"white"} variant="body2">
            {inspectionOrder ? "Update" : "Create"}
          </Typography>
        )}
      </Button>
    </Box>
  );
};
