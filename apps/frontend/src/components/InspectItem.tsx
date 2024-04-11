import {
  CheckCircleOutline,
  ExpandMore,
  SaveTwoTone,
} from "@mui/icons-material";
import {
  Accordion,
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
import React, { useState } from "react";
import { useUpdateInspectionOrderDetails } from "../hooks/useUpdateInspectionOrderDetails";
import { toast } from "react-toastify";

interface InspectItemProps {
  idx: number;
  item: InspectionDetail;
  openInspectionItem?: string;
  inspectionId: string;
  setOpenInspectionItem: (id?: string) => void;
}

export const InspectItem: React.FC<InspectItemProps> = ({
  idx,
  item: defaultItem,
  openInspectionItem,
  inspectionId,
  setOpenInspectionItem,
}) => {
  const { mutateAsync: updateInspectionOrderDetails } =
    useUpdateInspectionOrderDetails();
  const [item, setItem] = useState<InspectionDetail>(defaultItem);

  return (
    <Accordion
      elevation={1}
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
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={item.condition}
                name="radio-buttons-group"
                value={JSON.stringify(item.condition)}
                onChange={(e) => {
                  setItem({
                    ...item,
                    condition: JSON.parse(e.target.value),
                  });
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
                        <Typography variant="body2">{o.description}</Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Box>
            <Typography fontWeight={"bold"}>Notes</Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={item.notes}
              onChange={(e) => setItem({ ...item, notes: e.target.value })}
            />
          </Box>
          <Box>
            <Typography fontWeight={"bold"}>Upload Photo</Typography>
            <TextField type="file" fullWidth />
          </Box>
        </Box>
      </AccordionDetails>
      <Box p={2}>
        <Button
          variant="outlined"
          startIcon={<SaveTwoTone />}
          onClick={async () => {
            try {
              const result = await toast.promise(
                updateInspectionOrderDetails({
                  inspectionId,
                  data: item,
                }),
                {
                  pending: "Saving Report",
                  success: "Report updated",
                  error: "Problems saving report",
                }
              );
              setItem({ ...item, isComplete: result.isComplete });
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Save
        </Button>
      </Box>
    </Accordion>
  );
};
