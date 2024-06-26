import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddCircleOutline,
  AssignmentTwoTone,
  Delete,
  DeleteOutlined,
  Edit,
  ExpandMore,
  FireplaceTwoTone,
  HistoryEduTwoTone,
  InfoTwoTone,
  Save,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { useUpdateTemplate } from "../hooks/useUpdateTemplate";
import { DraggableItem } from "./DraggableItem";
import { ProtectedComponent } from "./ProtectedComponent";

interface TemplateForm {
  name: string;
  inspectionLevel: string;
  signaturesRequired: boolean;
  items: {
    id?: string;
    name: string;
    position: number;
    options: { id?: string; name: string; description: string }[];
  }[];
}

const TemplateFormSchema = z.object({
  name: z.string().min(1),
  inspectionLevel: z.enum(["Level One", "Level Two", "Level Three"]),
  signaturesRequired: z.boolean(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, { message: "item name is required" }),
      position: z.number(),
      options: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string().min(1, { message: "option name is required" }),
          description: z
            .string()
            .min(1, { message: "option description is required" }),
        })
      ),
    })
  ),
});

export const EditTemplateForm = ({
  template,
  id,
  edit,
  setEdit,
}: {
  template?: InspectionTemplate;
  id: string;
  edit: boolean;
  setEdit: (canEdit: boolean) => void;
}) => {
  const theme = useTheme();
  // const [edit, setEdit] = useState<boolean>(false);
  const { mutateAsync: updateTemplate, isPending, error } = useUpdateTemplate();
  const onSubmit = async (values: TemplateForm) => {
    try {
      values.items = values.items.map((item, idx) => ({
        ...item,
        position: idx + 1,
      }));
      await toast.promise(updateTemplate({ ...values, id: id }), {
        success: "Template saved",
        pending: "Saving template",
        error: "Error while saving template",
      });
      setEdit(false);
      reset(watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
    } catch (e) {
      console.error(e);
    }
  };
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
    getValues,
  } = useForm<TemplateForm>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      name: template?.name,
      items: template?.items,
      signaturesRequired: template?.signaturesRequired,
      inspectionLevel: template?.inspectionLevel,
    },
    reValidateMode: "onChange",
  });
  const { fields, append, remove, update, move } = useFieldArray({
    control,
    name: "items",
  });

  const variant = "filled";

  const findPos = (id: string) => {
    return fields.findIndex((f) => f.id === id);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (active.id === over?.id) return;
    const activeIdx = findPos(active.id.toString());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore

    const overIdx = findPos(over?.id.toString());

    move(activeIdx, overIdx);
  }

  const hasOptionNameError = (index: number, i: number): boolean => {
    const hasError =
      errors &&
      errors?.items &&
      errors.items[index] &&
      errors.items[index]!.options &&
      errors.items[index]!.options![i] &&
      errors.items[index]!.options![i]!.name &&
      errors.items[index]!.options![i]!.name?.message != undefined;

    if (hasError !== undefined) {
      return hasError;
    }
    return false;
  };

  return (
    <>
      <Box
        bgcolor={theme.palette.secondary.main}
        sx={{ height: 120, p: 4, width: "100%" }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
      >
        <Typography fontWeight={"bold"} variant="h4" sx={{ color: "white" }}>
          Edit Template
        </Typography>
      </Box>
      <Container
        disableGutters
        maxWidth={"xl"}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: 4,
          minHeight: "100vh",
          pb: 4,
        }}
      >
        {error && <Alert severity="error">Error updating template</Alert>}
        <Box
          display={"flex"}
          gap={2}
          justifyContent={"flex-end"}
          position={"sticky"}
          top={0}
          bgcolor={theme.palette.background.default}
          py={2}
          zIndex={100}
        >
          <ProtectedComponent
            allowedRoles={["ADMIN", "CREATOR"]}
            fallbackComponent={
              <Tooltip title="Missing required permissions. Contact your company admin to edit a template">
                <span>
                  <Button
                    disabled
                    startIcon={<AddCircleOutline fontSize="small" />}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                </span>
              </Tooltip>
            }
          >
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEdit(true)}
              disabled={edit}
              sx={{ color: "white" }}
            >
              Edit
            </Button>
          </ProtectedComponent>
          <Tooltip title={!isDirty ? "Make changes before saving" : ""}>
            <span>
              <Button
                disabled={!isDirty}
                variant="contained"
                startIcon={
                  isPending ? (
                    <CircularProgress size={18} color="success" />
                  ) : (
                    <Save />
                  )
                }
                onClick={handleSubmit(onSubmit)}
                color="success"
              >
                Save
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box>
          {/* <pre> {JSON.stringify(getValues().items, null, 4)}</pre> */}
          <Box py={2}>
            <Box display={"flex"} gap={1}>
              <InfoTwoTone color="secondary" />
              <Typography fontWeight={"bold"}>Template Name</Typography>
            </Box>
            <Typography variant="body2">
              Give your template a name to easily find it later
            </Typography>
            <Divider />
          </Box>
          <TextField
            disabled={!edit}
            {...register("name")}
            fullWidth
            variant={"filled"}
            label="Name"
          />
        </Box>
        <Box py={1}>
          <Box display={"flex"} gap={1}>
            <FireplaceTwoTone color="secondary" />
            <Typography fontWeight={"bold"}>Inspection Level</Typography>
          </Box>
          <Typography variant="body2">
            Choose which level of inspection this template should be used for
          </Typography>
          <Divider />
        </Box>
        <TextField
          size="small"
          select
          fullWidth
          disabled={!edit}
          variant={"filled"}
          label="Inspection Level"
          defaultValue={template?.inspectionLevel}
          {...register("inspectionLevel")}
          error={
            errors.inspectionLevel !== undefined &&
            errors.inspectionLevel?.message !== undefined
          }
          helperText={
            (errors?.inspectionLevel && errors.inspectionLevel?.message) ?? ""
          }
        >
          <MenuItem value={"Level One"}>Level 1</MenuItem>
          <MenuItem value={"Level Two"}>Level 2</MenuItem>
          <MenuItem value={"Level Three"}>Level 3</MenuItem>
        </TextField>
        <Box py={1}>
          <Box display={"flex"} gap={1}>
            <HistoryEduTwoTone color="secondary" />
            <Typography fontWeight={"bold"}>Signatures Required</Typography>
          </Box>
          <Typography variant="body2">
            Do you require a signature from the customer and technician
          </Typography>
          <Divider />
        </Box>
        <Controller
          control={control}
          name="signaturesRequired"
          render={({ field }) => (
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={field.value}
                value={field.value}
                onChange={(e) => {
                  // setValue("signaturesRequired", JSON.parse(e.target.value));
                  field.onChange({
                    ...e,
                    target: { ...e.target, value: JSON.parse(e.target.value) },
                  });
                }}
              >
                <FormControlLabel
                  disabled={!edit}
                  value={true}
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  disabled={!edit}
                  value={false}
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
              <FormHelperText>
                {errors.signaturesRequired?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box display={"flex"} py={2} flexDirection={"column"}>
              <Box display={"flex"} gap={1}>
                <AssignmentTwoTone color="secondary" />
                <Typography fontWeight={"bold"}>Inspection Items</Typography>
              </Box>
              <Typography variant="body2">
                Create items your technitician should inspect
              </Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Tooltip title={!edit ? "Select edit to make changes" : ""}>
                <span>
                  <Button
                    size="small"
                    startIcon={<AddCircleOutline fontSize={"small"} />}
                    onClick={() => {
                      append({
                        name: "",
                        position: fields.length + 1,
                        options: [
                          { id: "", name: "NA", description: "Not applicable" },
                          {
                            id: "",
                            name: "Not Acceptable",
                            description:
                              "This item is not in working condition",
                          },
                          {
                            id: "",
                            name: "Acceptable",
                            description:
                              "This item is in acceptable working condition",
                          },
                        ],
                      });
                      setOpenItems(new Set(openItems.add(fields.length)));
                    }}
                    disabled={!edit}
                  >
                    Add Item
                  </Button>
                </span>
              </Tooltip>
              <Button
                color="error"
                startIcon={<DeleteOutlined fontSize={"small"} />}
                onClick={() => {
                  if (selectedSections.length === fields.length) {
                    alert(
                      "Inspection templates must contain at least on inspection item"
                    );
                    return;
                  }
                  remove(selectedSections);
                  setSelectedSections([]);
                }}
                disabled={selectedSections.length < 1}
              >
                Remove{" "}
                {selectedSections.length ? `${selectedSections.length}` : ""}
                Sections
              </Button>
            </Box>
          </Box>
          <Divider />
        </Box>
        <Box display={"flex"} flexDirection={"column"}>
          <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {/* Draggbale start */}
              {fields.map((field, index) => (
                <DraggableItem
                  id={field.id}
                  key={field.id}
                  showDragHandle={edit}
                >
                  <Accordion
                    elevation={0}
                    expanded={openItems.has(index)}
                    key={field.id}
                    sx={{
                      bgcolor: theme.palette.background.default,
                      width: "100%",
                      ...(errors.items &&
                        errors.items[index] && {
                          boxShadow: "1px 1px 1px 1px #ff6b66",
                        }),
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore fontSize={"large"} />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      onClick={() => {
                        const newSet = new Set(openItems);
                        if (openItems.has(index)) {
                          newSet.delete(index);
                        } else {
                          newSet.add(index);
                        }
                        setOpenItems(newSet);
                      }}
                    >
                      <Box
                        width={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          width={"100%"}
                        >
                          <Typography>{index + 1}.</Typography>
                          {edit && (
                            <Checkbox
                              onClick={(e) => {
                                e.stopPropagation();
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                if (e.target.checked) {
                                  setSelectedSections([
                                    ...selectedSections,
                                    index,
                                  ]);
                                } else {
                                  setSelectedSections([
                                    ...selectedSections.filter(
                                      (s) => s != index
                                    ),
                                  ]);
                                }
                              }}
                            />
                          )}
                          <TextField
                            disabled={!edit}
                            {...register(`items.${index}.name`)}
                            onClick={(e) => e.stopPropagation()}
                            variant={variant}
                            label="Item Name"
                            placeholder="Flu Liner"
                            key={field.id}
                            fullWidth
                            error={
                              errors.items !== undefined &&
                              errors.items[index]?.name?.message !== undefined
                            }
                            helperText={
                              (errors?.items &&
                                errors?.items[index]?.name?.message) ??
                              ""
                            }
                          />
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ display: "flex", justifyContent: "end" }}
                    >
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        width={"75%"}
                      >
                        <Box py={1} display={"flex"} flexDirection={"column"}>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Box display={"flex"} flexDirection={"column"}>
                              <Box display={"flex"} gap={1}>
                                <FireplaceTwoTone color="secondary" />
                                <Typography fontWeight={"bold"}>
                                  Condition Options
                                </Typography>
                              </Box>
                              <Typography variant="body2">
                                Create options to easily select during
                                inspection
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              startIcon={<AddCircleOutline />}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                update(index, {
                                  ...getValues().items[index],
                                  options: [
                                    ...field.options,
                                    { name: "", description: "" },
                                  ],
                                });
                              }}
                              disabled={!edit}
                            >
                              Add Option
                            </Button>
                          </Box>
                          <Divider />
                        </Box>
                        <Box
                          display={"flex"}
                          justifyContent={"flex-end"}
                          alignItems={"start"}
                          flexDirection={"column"}
                          gap={2}
                        >
                          {field.options.map((option, i) => {
                            return (
                              <Box
                                display={"flex"}
                                gap={1}
                                alignItems={"end"}
                                justifyContent={"center"}
                                key={`items.${index}.options.${i}.name`}
                                width={"100%"}
                              >
                                <TextField
                                  fullWidth
                                  disabled={!edit}
                                  variant={variant}
                                  label={option.name || "Option Name"}
                                  size="small"
                                  placeholder="name"
                                  {...register(
                                    `items.${index}.options.${i}.name`
                                  )}
                                  error={hasOptionNameError(index, i)}
                                  helperText={
                                    (errors &&
                                      errors!.items &&
                                      errors.items[index] &&
                                      errors.items[index]!.options &&
                                      errors!.items[index]!.options![i] &&
                                      errors!.items[index]!.options![i]!.name
                                        ?.message) ??
                                    ""
                                  }
                                />
                                <TextField
                                  fullWidth
                                  disabled={!edit}
                                  variant="filled"
                                  multiline
                                  label="Description"
                                  size="small"
                                  placeholder="description"
                                  {...register(
                                    `items.${index}.options.${i}.description`
                                  )}
                                  error={
                                    errors &&
                                    errors?.items &&
                                    errors.items[index] &&
                                    errors.items[index]!.options &&
                                    errors.items[index]!.options![i] &&
                                    errors.items[index]!.options![i]!
                                      .description &&
                                    errors.items[index]!.options![i]!
                                      .description?.message != undefined
                                  }
                                  helperText={
                                    (errors &&
                                      errors!.items &&
                                      errors.items[index] &&
                                      errors.items[index]!.options &&
                                      errors!.items[index]!.options![i] &&
                                      errors!.items[index]!.options![i]!
                                        .description?.message) ??
                                    ""
                                  }
                                />
                                {edit && (
                                  <IconButton
                                    onClick={() => {
                                      update(index, {
                                        ...field,
                                        options: field.options.filter(
                                          (_o, idx) => idx !== i
                                        ),
                                      });
                                    }}
                                  >
                                    <Delete color="error" />
                                  </IconButton>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </DraggableItem>
              ))}
            </SortableContext>
          </DndContext>
        </Box>
      </Container>
    </>
  );
};
