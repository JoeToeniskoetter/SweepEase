import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { useUsers } from "../hooks/useUsers";
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { NoUsers } from "./NoUsers";
import { UsertableOptions } from "./UserTableOptions";
import { ProtectedComponent } from "./ProtectedComponent";

interface UsersTableProps {}

const columnHelper = createColumnHelper<SweepInspectrUser>();

export const UsersTable: React.FC<UsersTableProps> = () => {
  const { data: users, isLoading } = useUsers();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: () => <Typography fontWeight={"bold"}>ID</Typography>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("email", {
        cell: (info) => info.getValue(),
        header: () => <Typography fontWeight={"bold"}>Email</Typography>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("role", {
        cell: (info) => info.getValue(),
        header: () => <Typography fontWeight={"bold"}>Role</Typography>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("id", {
        cell: (info) => (
          <ProtectedComponent
            allowedRoles={["ADMIN", "CREATOR"]}
            key={info.row.original.id}
          >
            <UsertableOptions id={info.row.original.id} />
          </ProtectedComponent>
        ),
        header: () => <Typography fontWeight={"bold"}></Typography>,
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
    () => (isLoading ? Array(10).fill({}) : users),
    [isLoading, users]
  );
  const table = useReactTable({
    columns: tableColumns,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
  });

  if (!isLoading && users?.length === 0) {
    return <NoUsers />;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: "white" }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} sx={{ bgcolor: "#f0f0f0" }}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{
                      width: header.getSize(),
                    }}
                  >
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
                  <TableCell
                    key={cell.id}
                    sx={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
