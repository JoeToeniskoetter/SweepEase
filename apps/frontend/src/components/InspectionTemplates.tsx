import { AddCircleOutline, Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import React, { useState } from "react";
import { useCreateTemplate } from "../hooks/useCreateTemplate";
import { useInspectionTemplates } from "../hooks/useInspectionTemplates";
import { InspectionTemplateOptions } from "./InspectionTemplateOptions";

interface InspectionTemplatesProps {}
const columnHelper = createColumnHelper<InspectionTemplate>();
const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <Typography fontWeight={"bold"}>Name</Typography>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("inspectionLevel", {
    header: () => <Typography fontWeight={"bold"}>Inspection Level</Typography>,
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("createdAt", {
    header: () => <Typography fontWeight={"bold"}>Created</Typography>,
    footer: (info) => info.column.id,
    cell: (info) =>
      info.getValue() && format(new Date(info.getValue()), "MM/dd/yyyy"),
  }),
  columnHelper.accessor("id", {
    header: () => <Typography hidden>Options</Typography>,
    footer: (info) => info.column.id,
    cell: (info) => <InspectionTemplateOptions id={info.renderValue() ?? ""} />,
  }),
];

export const InspectionTemplates: React.FC<InspectionTemplatesProps> = () => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { data, isLoading } = useInspectionTemplates();
  const [templateName, setTemplateName] = useState<string>("");
  const [inspectionLevel, setInspectionLevel] = useState<
    "Level One" | "Level Two" | "Level Three"
  >("Level One");

  const { mutateAsync: createTemplate, isPending, error } = useCreateTemplate();

  const tableColumns = React.useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: <Skeleton />,
          }))
        : columns,
    [isLoading]
  );
  const tableData = React.useMemo(
    () => (isLoading ? Array(10).fill({}) : data),
    [isLoading, data]
  );
  const table = useReactTable({
    columns: tableColumns,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Box
        display={"flex"}
        gap={2}
        flexDirection={"column"}
        maxWidth={"lg"}
        width={"100%"}
      >
        <Box display={"flex"} gap={2}>
          <Typography variant="h4" fontWeight={"bold"}>
            Templates
          </Typography>
          <Button
            onClick={() => setOpenModal(true)}
            startIcon={<AddCircleOutline color="primary" fontSize="small" />}
          >
            Create Template
          </Button>
        </Box>
        {error && <Alert severity="error">Failed to create template</Alert>}
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.secondary.main }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} sx={{ color: "white" }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
          }}
        >
          <Box display={"flex"} justifyContent={"end"}>
            <IconButton onClick={() => setOpenModal(false)}>
              <Close />
            </IconButton>
          </Box>
          <Typography variant="h5" fontWeight={"bold"}>
            Create Template
          </Typography>
          <Typography fontWeight={"light"}>
            Add something information about this template
          </Typography>
          <Box display={"flex"} flexDirection={"column"} gap={2} mt={2}>
            <TextField
              placeholder="Visual Inspection"
              label="Template Name"
              fullWidth
              onChange={(e) => setTemplateName(e.target.value)}
              value={templateName}
            />
            <TextField
              select
              fullWidth
              defaultValue={inspectionLevel}
              onChange={(e) => setInspectionLevel(e.target.value)}
              label="Inspection Level"
            >
              <MenuItem value={"Level One"}>Level 1</MenuItem>
              <MenuItem value={"Level Two"}>Level 2</MenuItem>
              <MenuItem value={"Level Three"}>Level 3</MenuItem>
            </TextField>
            {error && <Alert severity="error">Error creating template</Alert>}
            <Button
              variant="contained"
              fullWidth
              disabled={templateName.trim() === ""}
              onClick={async () => {
                try {
                  createTemplate({
                    name: templateName,
                    inspectionLevel: inspectionLevel,
                  });
                  setOpenModal(false);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {isPending ? (
                <CircularProgress color="secondary" />
              ) : (
                <Typography fontWeight={"bold"} color={"white"} variant="body2">
                  Save
                </Typography>
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};
