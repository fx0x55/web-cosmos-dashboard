'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
  }[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function DataTable<T>({
  data,
  columns,
  page,
  pageSize,
  total,
  onPageChange,
  loading,
  error,
  onRetry,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <div className="surface-panel overflow-hidden rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/20 bg-gradient-to-r from-muted/40 to-muted/15 hover:bg-muted/40">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className="h-12 px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="h-14 border-b border-border/20">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-6">
                      <div
                        className="shimmer h-4 w-full max-w-[90px] rounded-md bg-muted/40"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && error && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-destructive/80">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                    {onRetry && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="gap-2 rounded-lg">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-muted-foreground/60">
                  No data available for this view.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              data.length > 0 &&
              data.map((item, i) => (
                <TableRow
                  key={i}
                  className="group h-14 border-b border-border/15 transition-all duration-300 ease-out hover:bg-primary/[0.04] hover:shadow-[inset_4px_0_0_0_hsl(var(--primary))]">
                  {columns.map((col, j) => (
                    <TableCell
                      key={j}
                      className="px-6 text-sm text-foreground/70 transition-colors duration-300 group-hover:text-foreground/90">
                      {col.cell
                        ? col.cell(item)
                        : (item[col.accessorKey!] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground/60">
          Page {page} of {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="h-9 w-9 rounded-xl border-border/50 transition-all duration-300 ease-out hover:border-primary/30 hover:bg-primary/[0.04] hover:text-primary hover:shadow-sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="h-9 w-9 rounded-xl border-border/50 transition-all duration-300 ease-out hover:border-primary/30 hover:bg-primary/[0.04] hover:text-primary hover:shadow-sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
