'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  filters = [],
  onRowClick,
  emptyMessage = 'No results found.',
  loading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.id)
  );

  // Filter data
  let filteredData = data;

  // Apply search
  if (searchQuery && searchable) {
    filteredData = filteredData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  // Apply filters
  Object.entries(activeFilters).forEach(([filterId, filterValue]) => {
    if (filterValue) {
      filteredData = filteredData.filter(
        (row) => String(row[filterId]) === filterValue
      );
    }
  });

  // Apply sorting
  if (sortColumn) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Filters */}
          {filters.map((filter) => (
            <Select
              key={filter.id}
              value={activeFilters[filter.id] || ''}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={(checked) =>
                    setVisibleColumns((prev) =>
                      checked
                        ? [...prev, column.id]
                        : prev.filter((id) => id !== column.id)
                    )
                  }
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(searchQuery || Object.keys(activeFilters).length > 0) && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((col) => visibleColumns.includes(col.id))
                .map((column) => (
                  <TableHead key={column.id}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(String(column.accessorKey))}
                        className="-ml-4 h-8"
                      >
                        {column.header}
                        {sortColumn === column.accessorKey && (
                          <>
                            {sortDirection === 'asc' ? (
                              <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-2 h-4 w-4" />
                            )}
                          </>
                        )}
                      </Button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns
                    .filter((col) => visibleColumns.includes(col.id))
                    .map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.id))
                    .map((column) => (
                      <TableCell key={column.id}>
                        {column.cell
                          ? column.cell(row)
                          : column.accessorKey
                          ? String(row[column.accessorKey])
                          : ''}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} results
      </div>
    </div>
  );
}
