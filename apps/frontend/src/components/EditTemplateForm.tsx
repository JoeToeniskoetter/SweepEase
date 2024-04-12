import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  Edit,
  InfoTwoTone,
  FireplaceTwoTone,
  AssignmentTwoTone,
  AddCircleOutline,
  DeleteOutlined,
  ExpandMore,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Alert,
  Divider,
  TextField,
  MenuItem,
  Tooltip,
  Accordion,
  AccordionSummary,
  Checkbox,
  AccordionDetails,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useUpdateTemplate } from "../hooks/useUpdateTemplate";
import { z } from "zod";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableItem } from "./DraggableItem";

interface TemplateForm {
  name: string;
  inspectionLevel: string;
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
}: {
  template?: InspectionTemplate;
  id: string;
}) => {
  const theme = useTheme();
  const [edit, setEdit] = useState<boolean>(false);
  const { mutateAsync: updateTemplate, isPending, error } = useUpdateTemplate();
  const onSubmit = async (values: TemplateForm) => {
    try {
      values.items = values.items.map((item, idx) => ({
        ...item,
        position: idx + 1,
      }));
      await updateTemplate({ ...values, id: id });
      setEdit(false);
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
    formState: { isDirty, errors },
  } = useForm<TemplateForm>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      name: template?.name,
      items: template?.items,
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
    const overIdx = findPos(over?.id.toString());

    move(activeIdx, overIdx);
  }

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
        <Box display={"flex"} gap={2}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEdit(true)}
          >
            Edit
          </Button>
          <Button
            disabled={!isDirty}
            variant="outlined"
            startIcon={isPending ? <CircularProgress size={18} /> : <Save />}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Box>
      </Box>
      <Container
        disableGutters
        maxWidth={"xl"}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          px: 4,
        }}
      >
        {error && <Alert severity="error">Error updating template</Alert>}
        <Box>
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
              <Tooltip title={"Select edit to make changes"}>
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
                      width: "100%",
                      ".MuiAccordionSummary-root": {
                        backgroundColor: "white !important",
                      },
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
                            onClick={(e) => e.stopPropagation()}
                            variant={variant}
                            label="Item Name"
                            placeholder="Flu Liner"
                            {...register(`items.${index}.name`)}
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
                                  ...field,
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
                                  error={
                                    errors?.items &&
                                    errors.items[index]?.options &&
                                    errors?.items[index]?.options[i]?.name
                                      ?.message !== undefined
                                  }
                                  helperText={
                                    (errors?.items &&
                                      errors.items[index]?.options &&
                                      errors?.items[index]?.options[i]?.name
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
                                    errors?.items &&
                                    errors.items[index]?.options &&
                                    errors?.items[index]?.options[i]
                                      ?.description?.message !== undefined
                                  }
                                  helperText={
                                    (errors?.items &&
                                      errors.items[index]?.options &&
                                      errors?.items[index]?.options[i]
                                        ?.description?.message) ??
                                    ""
                                  }
                                />
                                {edit && (
                                  <IconButton
                                    onClick={() => {
                                      update(index, {
                                        ...field,
                                        options: field.options.filter(
                                          (o, idx) => idx !== i
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
