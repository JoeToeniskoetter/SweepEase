import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import React from "react";
import { InspectionTemplateOptions } from "./InspectionTemplateOptions";

interface InspectionTemplatesTableProps {
  isLoading: boolean;
  data: InspectionTemplate[];
}

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
    cell: (info) => <InspectionTemplateOptions template={info.row.original} />,
  }),
];

export const InspectionTemplatesTable: React.FC<
  InspectionTemplatesTableProps
> = ({ data, isLoading }) => {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    columns: tableColumns,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table>
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
