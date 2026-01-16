"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  page,
  pageSize,
  total,
  onPageChange,
  loading,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl overflow-hidden shadow-sm ring-1 ring-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5 border-white/10 bg-white/30 dark:bg-black/20">
              {columns.map((col, index) => (
                <TableHead key={index} className="text-muted-foreground font-medium h-14 px-6 text-base">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/10 h-20">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-6">
                      <div className="h-5 w-full max-w-[100px] bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-lg">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, i) => (
                <TableRow key={i} className="hover:bg-primary/5 dark:hover:bg-primary/10 border-white/5 transition-colors h-20 group">
                  {columns.map((col, j) => (
                    <TableCell key={j} className="font-medium px-6 text-base text-foreground/80 group-hover:text-foreground transition-colors">
                      {col.cell ? col.cell(item) : (item[col.accessorKey!] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground font-medium">
          Page {page} of {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="h-11 w-11 rounded-xl border-white/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="h-11 w-11 rounded-xl border-white/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
