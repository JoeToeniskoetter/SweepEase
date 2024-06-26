import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
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
import { useInvites } from "../hooks/useInvites";
import { UserInviteOptions } from "./UserInviteOptions";
import { NoInvites } from "./NoInvites";
import { format } from "date-fns";

interface UsersTableProps {}

const columnHelper = createColumnHelper<UserInvite>();

export const UserInvitesTable: React.FC<UsersTableProps> = ({}) => {
  const { data: invites, isLoading } = useInvites();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("userEmail", {
        cell: (info) => info.getValue(),
        header: () => <Typography fontWeight={"bold"}>Email</Typography>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("createdAt", {
        cell: (info) =>
          info.getValue() ? format(info.getValue(), "MM/dd/yyyy") : "'",
        header: () => <Typography fontWeight={"bold"}>Invited</Typography>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("id", {
        cell: ({ row }) => (
          <UserInviteOptions id={row.original.id} invite={row.original} />
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
    () => (isLoading ? Array(10).fill({}) : invites),
    [isLoading, invites]
  );
  const table = useReactTable({
    columns: tableColumns,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      {!isLoading && invites?.length === 0 ? (
        <NoInvites />
      ) : (
        <TableContainer component={Paper} variant="outlined">
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
          </Table>
        </TableContainer>
      )}
    </>
  );
};
