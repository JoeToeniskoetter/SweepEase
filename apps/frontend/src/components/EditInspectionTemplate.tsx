import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddCircleOutline,
  Assignment,
  DeleteOutlined,
  Edit,
  ExpandMore,
  Info,
  Restore,
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
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useInspectionTemplate } from "../hooks/useTemplate";
import { useUpdateTemplate } from "../hooks/useUpdateTemplate";

interface EditInspectionTemplateProps {}

interface TemplateForm {
  name: string;
  items: {
    id?: string;
    name: string;
    options: { id?: string; name: string; description: string }[];
  }[];
}

const TemplateFormSchema = z.object({
  name: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, { message: "item name is required" }),
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

export const EditInspectionTemplate: React.FC<
  EditInspectionTemplateProps
> = () => {
  const { id } = useParams();
  const {
    data: template,
    isLoading,
    error,
  } = useInspectionTemplate({ id: id || "" });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container disableGutters maxWidth={"lg"}>
      {error && <Alert severity="error">Error loading template</Alert>}
      {isLoading && <CircularProgress />}
      <EditTemplateForm template={template} id={id || ""} />
    </Container>
  );
};

const EditTemplateForm = ({
  template,
  id,
}: {
  template?: InspectionTemplate;
  id: string;
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const { mutateAsync: updateTemplate, isPending, error } = useUpdateTemplate();
  const onSubmit = async (values: TemplateForm) => {
    try {
      await updateTemplate({ ...values, id: id });
      setEdit(false);
    } catch (e) {}
  };
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number[]>
  >([]);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors },
  } = useForm<TemplateForm>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      name: template?.name,
      items: template?.items,
    },
    reValidateMode: "onChange",
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const variant = "standard";

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"start"}
        gap={2}
      >
        <Typography fontWeight={"bold"} variant="h4">
          Edit Template
        </Typography>
        {edit ? (
          <Button
            disabled={!isDirty}
            variant="outlined"
            startIcon={isPending ? <CircularProgress size={18} /> : <Save />}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEdit(true)}
          >
            Edit
          </Button>
        )}
        <Button
          disabled={!isDirty}
          variant="outlined"
          startIcon={<Restore />}
          onClick={() => reset()}
          sx={{ color: "green", border: "1px solid green" }}
        >
          Reset
        </Button>
      </Box>
      <Box
        maxWidth={"md"}
        mt={3}
        display={"flex"}
        flexDirection={"column"}
        gap={2}
      >
        {error && <Alert severity="error">Error updating template</Alert>}
        <Box>
          <Box py={2}>
            <Box display={"flex"} gap={1}>
              <Info />
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
        <Box display={"flex"} flexDirection={"column"}>
          <Box display={"flex"} py={2} flexDirection={"column"}>
            <Box display={"flex"} gap={1}>
              <Assignment />
              <Typography fontWeight={"bold"}>Inspection Items</Typography>
            </Box>
            <Typography variant="body2">
              Create items your technitician should inspect
            </Typography>
            <Divider />
          </Box>
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <Button
              size="small"
              startIcon={<AddCircleOutline />}
              onClick={() =>
                append({
                  name: "",
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
                })
              }
              disabled={!isValid}
            >
              Add Item
            </Button>
            <Button
              startIcon={<DeleteOutlined />}
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
        <Box display={"flex"} flexDirection={"column"}>
          {fields.map((field, index) => (
            <Accordion
              elevation={0}
              expanded={openItems.has(index)}
              key={field.id}
              sx={{
                padding: 1,
                ".MuiAccordionSummary-root": {
                  backgroundColor: "white !important",
                },
                ...(errors.items &&
                  errors.items[index] && {
                    // border: 1.5,
                    // borderColor: "red",
                    boxShadow: "1px 1px 1px 1px #ff6b66",
                  }),
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore fontSize={"large"} />}
                aria-controls="panel1-content"
                id="panel1-header"
                onClick={(e) => {
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
              <AccordionDetails>
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  alignItems={"start"}
                  flexDirection={"column"}
                  gap={2}
                >
                  <Box display={"flex"} alignItems={"center"} gap={2}>
                    <Typography fontWeight={"bold"}>Options</Typography>
                    <Box>
                      <Button
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
                      >
                        Add Option
                      </Button>
                    </Box>
                    <Box
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <Button
                        startIcon={<DeleteOutlined />}
                        onClick={(event) => {
                          event.stopPropagation();
                          const optionsToDelete = selectedOptions[index] || [];
                          update(index, {
                            ...field,
                            options: field.options.filter(
                              (_o, i) => !optionsToDelete.includes(i)
                            ),
                          });
                          setSelectedOptions({
                            ...selectedOptions,
                            [index]: [],
                          });
                          return 0;
                        }}
                        disabled={!selectedOptions[index]?.length}
                      >
                        Remove {selectedOptions[index]?.length} Option(s)
                      </Button>
                    </Box>
                  </Box>
                  {field.options.map((option, i) => {
                    return (
                      <Box
                        display={"flex"}
                        gap={1}
                        alignItems={"end"}
                        key={`items.${index}.options.${i}.name`}
                      >
                        {edit && (
                          <Checkbox
                            // checked={selectedOptions[index]?.includes(i)}
                            onClick={(e) => {
                              e.stopPropagation();
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              //@ts-ignore
                              if (!e.target.checked) {
                                let newSelectedOptions = selectedOptions;
                                if (selectedOptions[index]) {
                                  newSelectedOptions = {
                                    ...selectedOptions,
                                    [index]: selectedOptions[index].filter(
                                      (idx) => idx !== i
                                    ),
                                  };
                                }
                                setSelectedOptions(newSelectedOptions);
                              } else {
                                let newSelectedOptions = selectedOptions;
                                if (selectedOptions[index]) {
                                  newSelectedOptions = {
                                    ...selectedOptions,
                                    [index]: [...selectedOptions[index], i],
                                  };
                                } else {
                                  newSelectedOptions = {
                                    ...selectedOptions,
                                    [index]: [i],
                                  };
                                }
                                console.log(newSelectedOptions);
                                setSelectedOptions(newSelectedOptions);
                              }
                            }}
                          />
                        )}
                        <TextField
                          disabled={!edit}
                          variant={variant}
                          label={option.name || "Option Name"}
                          size="small"
                          placeholder="name"
                          {...register(`items.${index}.options.${i}.name`)}
                          error={
                            errors?.items &&
                            errors.items[index]?.options &&
                            errors?.items[index]?.options[i]?.name?.message !==
                              undefined
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
                            errors?.items[index]?.options[i]?.description
                              ?.message !== undefined
                          }
                          helperText={
                            (errors?.items &&
                              errors.items[index]?.options &&
                              errors?.items[index]?.options[i]?.description
                                ?.message) ??
                            ""
                          }
                        />
                      </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </>
  );
};
