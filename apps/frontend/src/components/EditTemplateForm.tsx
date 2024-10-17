import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddCircleOutline,
  AssignmentTwoTone,
  Edit,
  FireplaceTwoTone,
  HistoryEduTwoTone,
  HouseTwoTone,
  InfoTwoTone,
  Save,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Slide,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { useUpdateTemplate } from "../hooks/useUpdateTemplate";
import { EditTemplateItemsForm } from "./EditTemplateItemsForm";
import { ProtectedComponent } from "./ProtectedComponent";

export interface TemplateForm {
  name: string;
  inspectionLevel: string;
  signaturesRequired: boolean;
  chimneyItems: {
    id?: string;
    type: "CHIMNEY" | "FIREPLACE";
    name: string;
    position: number;
    options: { id?: string; name: string; description: string }[];
  }[];
  fireplaceItems: {
    id?: string;
    type: "CHIMNEY" | "FIREPLACE";
    name: string;
    position: number;
    options: { id?: string; name: string; description: string }[];
  }[];
}

const TemplateFormSchema = z.object({
  name: z.string().min(1),
  inspectionLevel: z.enum(["Level One", "Level Two", "Level Three"]),
  signaturesRequired: z.boolean(),
  chimneyItems: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, { message: "item name is required" }),
      type: z.enum(["CHIMNEY", "FIREPLACE"]),
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
  fireplaceItems: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, { message: "item name is required" }),
      type: z.enum(["CHIMNEY", "FIREPLACE"]),
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
  const [activeTab, setActiveTab] = useState<number>(0);
  const { mutateAsync: updateTemplate, isPending, error } = useUpdateTemplate();
  const onSubmit = async (values: TemplateForm) => {
    try {
      const chimneyItems = values.chimneyItems.map((i, idx) => ({
        ...i,
        position: idx + 1,
      }));
      const fireplaceItems = values.fireplaceItems.map((i, idx) => ({
        ...i,
        position: idx + 1,
      }));
      const newTemplate = {
        id: template?.id,
        inspectionLevel: values.inspectionLevel,
        signaturesRequired: values.signaturesRequired,
        name: values.name,
        items: [...chimneyItems, ...fireplaceItems],
      };
      await toast.promise(updateTemplate({ ...newTemplate, id: id }), {
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
  const methods = useForm<TemplateForm>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      name: template?.name,
      fireplaceItems: template?.items.filter((f) => f.type === "FIREPLACE"),
      chimneyItems: template?.items.filter((f) => f.type === "CHIMNEY"),
      signaturesRequired: template?.signaturesRequired,
      inspectionLevel: template?.inspectionLevel,
    },
    reValidateMode: "onChange",
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = methods;

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
        <Box display={"flex"} gap={0.5} flexDirection={"column"} pt={4}>
          <Box display={"flex"} gap={1}>
            <AssignmentTwoTone color="secondary" />
            <Typography fontWeight={"bold"}>Inspection Items</Typography>
          </Box>
          <Typography variant="body2">
            Create items your technitician should inspect
          </Typography>
        </Box>
        <Divider />
        <Tabs
          value={activeTab}
          onChange={(_, nv) => setActiveTab(nv)}
          variant="fullWidth"
          indicatorColor="secondary"
        >
          <Tab
            label={
              <Typography color={activeTab === 0 ? "white" : undefined}>
                chimney inspection items
              </Typography>
            }
            value={0}
            sx={{
              bgcolor: activeTab === 0 ? "secondary.main" : undefined,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
            icon={
              <HouseTwoTone
                sx={{ color: activeTab === 0 ? "white" : undefined }}
              />
            }
            iconPosition="start"
          ></Tab>
          <Tab
            label={
              <Typography color={activeTab === 1 ? "white" : undefined}>
                Fireplace inspection items
              </Typography>
            }
            value={1}
            sx={{
              bgcolor: activeTab === 1 ? "secondary.main" : undefined,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
            icon={
              <FireplaceTwoTone
                sx={{ color: activeTab === 1 ? "white" : undefined }}
              />
            }
            iconPosition="start"
          />
        </Tabs>
        <TabPanel activeTab={activeTab} index={0}>
          <Slide in={activeTab === 0} direction="left">
            <Box>
              <EditTemplateItemsForm
                arrayItemsFieldKey="chimneyItems"
                methods={methods}
                edit={edit}
              />
            </Box>
          </Slide>
        </TabPanel>
        <TabPanel activeTab={activeTab} index={1}>
          <Slide in={activeTab === 1} direction="right">
            <Box>
              <EditTemplateItemsForm
                arrayItemsFieldKey="fireplaceItems"
                methods={methods}
                edit={edit}
              />
            </Box>
          </Slide>
        </TabPanel>
      </Container>
    </>
  );
};

const TabPanel: React.FC<{
  activeTab: number;
  index: number;
  children: React.ReactNode;
}> = ({ activeTab, index, children }) => {
  return <div hidden={activeTab !== index}>{children}</div>;
};
