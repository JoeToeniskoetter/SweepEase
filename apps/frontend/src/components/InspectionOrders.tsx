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
  TablePagination,
  TableRow,
  Tooltip,
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
import { EmptyInspectionOrders } from "./EmptyInspectionOrders";
import { ProtectedComponent } from "./ProtectedComponent";

interface InspectionOrdersProps {}

const columnHelper = createColumnHelper<InspectionOrder>();

export const InspectionOrders: React.FC<InspectionOrdersProps> = () => {
  const theme = useTheme();
  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = useInspectionOrders(page);
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
    () => (isLoading ? Array(10).fill({}) : data?.data),
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
          gap: 2,
          pb: 4,
        }}
        maxWidth="lg"
      >
        <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
          <ProtectedComponent
            allowedRoles={[]}
            fallbackComponent={
              <Tooltip title="Missing required permissions. Contact your company admin to create an inspection order">
                <span>
                  <Button
                    disabled
                    startIcon={<AddCircleOutline fontSize="small" />}
                    variant="outlined"
                  >
                    Create Order
                  </Button>
                </span>
              </Tooltip>
            }
          >
            <Button
              onClick={() => setOpenModal(true)}
              startIcon={<AddCircleOutline color="primary" fontSize="small" />}
              variant="outlined"
            >
              Create Order
            </Button>
          </ProtectedComponent>
        </Box>
        {!isLoading && data?.data.length === 0 ? (
          <EmptyInspectionOrders />
        ) : (
          <TableContainer component={Paper}>
            <Table size="medium">
              <TableHead>
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
              <TablePagination
                count={data?.meta.totalItems ?? 0}
                page={page - 1}
                rowsPerPage={data?.meta.itemsPerPage ?? 0}
                onPageChange={(_, page) => {
                  setPage(page + 1);
                }}
              />
            </Table>
          </TableContainer>
        )}
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
