import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ExpandMore,
  FireplaceTwoTone,
  AddCircleOutline,
  Delete,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  Box,
  Typography,
  Checkbox,
  TextField,
  AccordionDetails,
  Button,
  Divider,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { DraggableItem } from "./DraggableItem";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { TemplateForm } from "./EditTemplateForm";

interface EditTemplateItemsFormProps {
  methods: UseFormReturn<TemplateForm, unknown, undefined>;
  arrayItemsFieldKey: "fireplaceItems" | "chimneyItems";
  edit: boolean;
}

export const EditTemplateItemsForm: React.FC<EditTemplateItemsFormProps> = ({
  arrayItemsFieldKey,
  edit,
  methods,
}) => {
  const theme = useTheme();
  const variant = "filled";
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { fields, append, remove, update, move } = useFieldArray({
    control: methods.control,
    name: arrayItemsFieldKey,
  });

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
      methods.formState.errors &&
      methods.formState.errors?.[arrayItemsFieldKey] &&
      methods.formState.errors[arrayItemsFieldKey][index] &&
      methods.formState.errors[arrayItemsFieldKey][index]!.options &&
      methods.formState.errors[arrayItemsFieldKey][index]!.options![i] &&
      methods.formState.errors[arrayItemsFieldKey][index]!.options![i]!.name &&
      methods.formState.errors[arrayItemsFieldKey][index]!.options![i]!.name
        ?.message != undefined;

    if (hasError !== undefined) {
      return hasError;
    }
    return false;
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        position={"sticky"}
        top={60}
        bgcolor={theme.palette.background.default}
        py={2}
        zIndex={100}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box display={"flex"} gap={2} justifyContent={"flex-end"}></Box>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
            pb={2}
          >
            <Tooltip title={!edit ? "Select edit to make changes" : ""}>
              <span>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  sx={{ color: "white" }}
                  startIcon={<AddCircleOutline fontSize={"small"} />}
                  onClick={() => {
                    append({
                      name: "",
                      type:
                        arrayItemsFieldKey === "chimneyItems"
                          ? "CHIMNEY"
                          : "FIREPLACE",
                      position: fields.length + 1,
                      options: [
                        { id: "", name: "NA", description: "Not applicable" },
                        {
                          id: "",
                          name: "Not Acceptable",
                          description: "This item is not in working condition",
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
              variant="contained"
              size="small"
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
              Items
            </Button>
          </Box>
        </Box>
        <Divider />
      </Box>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {/* Draggbale start */}
          {fields.map((field, index) => (
            <DraggableItem id={field.id} key={field.id} showDragHandle={edit}>
              <Accordion
                elevation={0}
                expanded={openItems.has(index)}
                key={field.id}
                sx={{
                  bgcolor: theme.palette.background.default,
                  width: "100%",
                  ...(methods.formState.errors[arrayItemsFieldKey] &&
                    methods.formState.errors[arrayItemsFieldKey][index] && {
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
                  <Box width={"100%"} display={"flex"} flexDirection={"column"}>
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
                              setSelectedSections([...selectedSections, index]);
                            } else {
                              setSelectedSections([
                                ...selectedSections.filter((s) => s != index),
                              ]);
                            }
                          }}
                        />
                      )}
                      <TextField
                        disabled={!edit}
                        {...methods.register(
                          `${arrayItemsFieldKey}.${index}.name`
                        )}
                        onClick={(e) => e.stopPropagation()}
                        variant={variant}
                        label="Item Name"
                        placeholder="Flu Liner"
                        key={field.id}
                        fullWidth
                        error={
                          methods.formState.errors[arrayItemsFieldKey] !==
                            undefined &&
                          methods.formState.errors[arrayItemsFieldKey][index]
                            ?.name?.message !== undefined
                        }
                        helperText={
                          (methods.formState.errors[arrayItemsFieldKey] &&
                            methods.formState.errors[arrayItemsFieldKey][index]
                              ?.name?.message) ??
                          ""
                        }
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <Box display={"flex"} flexDirection={"column"} width={"75%"}>
                    <Box py={1} display={"flex"} flexDirection={"column"}>
                      <Box display={"flex"} justifyContent={"space-between"}>
                        <Box display={"flex"} flexDirection={"column"}>
                          <Box display={"flex"} gap={1}>
                            <FireplaceTwoTone color="secondary" />
                            <Typography fontWeight={"bold"}>
                              Condition Options
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            Create options to easily select during inspection
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          startIcon={<AddCircleOutline />}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            update(index, {
                              ...methods.getValues()[arrayItemsFieldKey][index],
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
                              {...methods.register(
                                `${arrayItemsFieldKey}.${index}.options.${i}.name`
                              )}
                              error={hasOptionNameError(index, i)}
                              helperText={
                                (methods.formState.errors &&
                                  methods.formState.errors![
                                    arrayItemsFieldKey
                                  ] &&
                                  methods.formState.errors[arrayItemsFieldKey][
                                    index
                                  ] &&
                                  methods.formState.errors[arrayItemsFieldKey][
                                    index
                                  ]!.options &&
                                  methods.formState.errors![arrayItemsFieldKey][
                                    index
                                  ]!.options![i] &&
                                  methods.formState.errors![arrayItemsFieldKey][
                                    index
                                  ]!.options![i]!.name?.message) ??
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
                              {...methods.register(
                                `${arrayItemsFieldKey}.${index}.options.${i}.description`
                              )}
                              error={
                                methods.formState.errors &&
                                methods.formState.errors[arrayItemsFieldKey] &&
                                methods.formState.errors[arrayItemsFieldKey][
                                  index
                                ] &&
                                methods.formState.errors[arrayItemsFieldKey][
                                  index
                                ]!.options &&
                                methods.formState.errors[arrayItemsFieldKey][
                                  index
                                ]!.options![i] &&
                                methods.formState.errors[arrayItemsFieldKey][
                                  index
                                ]!.options![i]!.description &&
                                methods.formState.errors[arrayItemsFieldKey][
                                  index
                                ]!.options![i]!.description?.message !=
                                  undefined
                              }
                              helperText={
                                (methods.formState.errors &&
                                  methods.formState.errors![
                                    arrayItemsFieldKey
                                  ] &&
                                  methods.formState.errors[arrayItemsFieldKey][
                                    index
                                  ] &&
                                  methods.formState.errors[arrayItemsFieldKey][
                                    index
                                  ]!.options &&
                                  methods.formState.errors![arrayItemsFieldKey][
                                    index
                                  ]!.options![i] &&
                                  methods.formState.errors![arrayItemsFieldKey][
                                    index
                                  ]!.options![i]!.description?.message) ??
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
    </>
  );
};
