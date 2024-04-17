import {
  CheckCircleOutline,
  ExpandMore,
  SaveTwoTone,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useUpdateInspectionOrderDetails } from "../hooks/useUpdateInspectionOrderDetails";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

interface InspectItemProps {
  idx: number;
  item: InspectionDetail;
  openInspectionItem?: string;
  inspectionId: string;
  setOpenInspectionItem: (id?: string) => void;
}

interface InspectItemForm {
  item: string;
  condition: { name: string; description: string } | null;
  notes: string;
  photo: File;
}

export const InspectItem: React.FC<InspectItemProps> = ({
  idx,
  item,
  openInspectionItem,
  inspectionId,
  setOpenInspectionItem,
}) => {
  const { mutateAsync: updateInspectionOrderDetails } =
    useUpdateInspectionOrderDetails();
  const {
    reset,
    register,
    control,
    formState: { isDirty, dirtyFields },
    handleSubmit,
    watch,
  } = useForm<InspectItemForm>({
    defaultValues: {
      condition: item.condition,
      item: item.item,
      notes: item.notes,
      photo: undefined,
    },
  });

  const onSubmit = async (values: InspectItemForm) => {
    try {
      await toast.promise(
        updateInspectionOrderDetails({
          inspectionId,
          data: { id: item.id, ...values },
        }),
        {
          pending: "Saving Report",
          success: "Report updated",
          error: "Problems saving report",
        }
      );
      reset(watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const photo = watch("photo");

  const renderPhoto = () => {
    if (photo) {
      console.log("have photo from form", photo);
      return (
        <Box py={2}>
          <img src={URL.createObjectURL(photo)} width={250} />
        </Box>
      );
    }

    if (item.photoUrl) {
      console.log("have photo from item", item.photoUrl);

      return (
        <Box py={2}>
          <img src={item.photoUrl} width={250} />
        </Box>
      );
    }

    return null;
  };

  useEffect(() => {
    if (isDirty) {
      console.log(dirtyFields);
      handleSubmit(onSubmit)();
    }
  }, [openInspectionItem]);

  return (
    <Accordion
      elevation={0}
      key={item.id}
      expanded={openInspectionItem === item.id}
      onChange={() => {
        if (openInspectionItem === item.id) {
          setOpenInspectionItem(undefined);
          return;
        }
        setOpenInspectionItem(item.id);
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography fontWeight={"bold"}>
          {idx + 1}. {item.item}
        </Typography>
        {item.isComplete && (
          <CheckCircleOutline color="success" sx={{ pl: 1 }} fontSize="small" />
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <Box>
            <Controller
              control={control}
              name="condition"
              render={({ field }) => {
                return (
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={field.value}
                      name="radio-buttons-group"
                      value={JSON.stringify(field.value)}
                      onChange={(e) => {
                        field.onChange(JSON.parse(e.target.value));
                      }}
                    >
                      {item.options.map((o) => (
                        <FormControlLabel
                          key={o.name}
                          value={JSON.stringify({
                            name: o.name,
                            description: o.description,
                          })}
                          name={o.name}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography fontWeight={"bold"} variant="body2">
                                {o.name}
                              </Typography>
                              <Typography variant="body2">
                                {o.description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                );
              }}
            />
          </Box>
          <Box>
            <Typography fontWeight={"bold"}>Notes</Typography>
            <TextField fullWidth multiline {...register("notes")} minRows={2} />
          </Box>
          <Box>
            <Typography fontWeight={"bold"}>
              {item.photoUrl ? `Upload New Photo` : `Upload Photo`}
            </Typography>
            <Controller
              name="photo"
              control={control}
              render={({ field }) => (
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
              )}
            />
            {renderPhoto()}
          </Box>
        </Box>
      </AccordionDetails>
      <AccordionActions>
        <Box p={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SaveTwoTone />}
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty}
          >
            Save
          </Button>
        </Box>
      </AccordionActions>
    </Accordion>
  );
};
