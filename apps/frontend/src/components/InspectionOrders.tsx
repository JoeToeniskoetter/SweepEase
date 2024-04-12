import { AddCircleOutline, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { useInspectionOrders } from "../hooks/useInspectionOrders";
import { InspectionOrderInfoForm } from "./InspectionOrderInfoForm";
import { InspectionOrderOptions } from "./InspectionOrderOptions";
import { InspectionOrderStatus } from "./InspectionOrderStatus";

interface InspectionOrdersProps {}

const columnHelper = createColumnHelper<InspectionOrder>();

export const InspectionOrders: React.FC<InspectionOrdersProps> = ({}) => {
  const theme = useTheme();
  const { data, isLoading } = useInspectionOrders();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("customerName", {
        cell: (info) => info.getValue(),
        header: () => <Typography fontWeight={"bold"}>Customer</Typography>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("template", {
        cell: (info) => (
          <Typography>{info.row.original.template?.inspectionLevel}</Typography>
        ),
        header: () => (
          <Typography fontWeight={"bold"}>Inspection Level</Typography>
        ),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("address", {
        cell: ({ row }) => (
          <Box>
            <Typography>{row.original.address}</Typography>
            <Typography fontWeight={"light"}>
              {row.original.city} {row.original.state} {row.original.zip}
            </Typography>
          </Box>
        ),
        header: () => <Typography fontWeight={"bold"}>Address</Typography>,
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("status", {
        cell: (info) => <InspectionOrderStatus status={info.getValue()} />,
        header: () => <Typography fontWeight={"bold"}>Status</Typography>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("id", {
        cell: ({ row }) => (
          <InspectionOrderOptions
            id={row.original.id}
            status={row.original.status}
          />
        ),
        header: () => <Typography></Typography>,
        footer: (info) => info.column.id,
      }),
    ],
    []
  );

  const tableColumns = React.useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton animation="pulse" />,
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
    <>
      <Box
        display={"flex"}
        alignItems={"start"}
        justifyContent={"start"}
        width={"100%"}
        bgcolor={theme.palette.secondary.main}
        sx={{ height: 120, p: 4 }}
        flexDirection={"column"}
      >
        <Typography variant="h5" sx={{ color: "white" }} fontWeight={"bold"}>
          Inspection Orders
        </Typography>
        <Typography sx={{ color: "white", fontWeight: "light" }}>
          View in progress and upcoming orders
        </Typography>
      </Box>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
        maxWidth="lg"
      >
        <Box display={"flex"}>
          <Button
            onClick={() => setOpenModal(true)}
            startIcon={<AddCircleOutline color="primary" fontSize="small" />}
          >
            Create Order
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableHead
              sx={
                {
                  // backgroundColor: theme.palette.secondary.main,
                }
              }
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
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
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 5,
              p: 4,
              maxHeight: "100%",
              overflowY: "scroll",
            }}
          >
            <Box display={"flex"} justifyContent={"end"}>
              <IconButton onClick={() => setOpenModal(false)}>
                <Close />
              </IconButton>
            </Box>
            <Typography variant="h5" fontWeight={"bold"}>
              Create Inspection Order
            </Typography>
            <Typography fontWeight={"light"}>
              Provide us some details about this inspection
            </Typography>
            <InspectionOrderInfoForm onSave={() => setOpenModal(false)} />
          </Box>
        </Modal>
      </Container>
    </>
  );
};
