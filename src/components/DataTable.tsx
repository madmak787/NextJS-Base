/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Search, ArrowDownWideNarrow } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { api, cn } from "@/lib/utils";
import { DataTableCells } from "./DataTable-Cells";
import { JSX } from "react/jsx-runtime";

type DataTableColumn = {
  key: string;
  label: string;
  [key: string]: any;
};

type DataTableProps = {
  endpoint: string;
  columns: DataTableColumn[];
  actions?: DataTableColumn[];
  placeholder?: string;
};

export const DataTable = ({
  endpoint,
  columns,
  actions = [],
  placeholder = "Search...",
}: DataTableProps) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const totalPages = Math.ceil(total / limit);
  const allColumns = [...columns, ...actions];

  useEffect(() => {
    const fetchData = async () => {
      const result = await api(
        `${endpoint}?search=${debouncedQuery}&limit=${limit}&page=${page}&order=${order}`,
        [],
        "GET"
      );

      setData(result.data.data || []);
      setTotal(result.data.total || 0);
      setLoading(false);
    };

    fetchData();
  }, [debouncedQuery, endpoint, page, limit, order]);

  const renderPageLinks = () => {
    const pages: JSX.Element[] = [];
    const maxVisiblePages = 5; // Always show 5 moving pages
    const siblingCount = Math.floor(maxVisiblePages / 2); // e.g. 2 for center-based logic

    const pushPage = (i: number) => {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            className={`border border-transparent hover:border-brand-pumpkin hover:bg-brand-pumpkin hover:text-white ${
              i === page
                ? "border-brand-pumpkin text-brand-pumpkin font-semibold"
                : ""
            }`}
            isActive={i === page}
            onClick={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              setPage(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    };

    if (totalPages <= maxVisiblePages + 2) {
      // No need for ellipsis
      for (let i = 1; i <= totalPages; i++) pushPage(i);
      return pages;
    }

    // Always show first page
    pushPage(1);

    let start = Math.max(2, page - siblingCount);
    let end = Math.min(totalPages - 1, page + siblingCount);

    // Adjust range if near start or end
    if (page <= siblingCount + 2) {
      start = 2;
      end = maxVisiblePages;
    } else if (page >= totalPages - siblingCount - 1) {
      start = totalPages - maxVisiblePages + 1;
      end = totalPages - 1;
    }

    if (start > 2) {
      pages.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = start; i <= end; i++) {
      pushPage(i);
    }

    if (end < totalPages - 1) {
      pages.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    pushPage(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col mx-6 border border-gray-200 rounded-md">
      <div className="flex p-5 justify-between items-center">
        <div className="relative w-1/2">
          <Search className="text-gray-400 absolute top-1 left-1 bottom-1 w-7 h-7 py-1.5" />
          <Input
            placeholder={placeholder}
            className="w-5/6 max-w-[400px] ps-9 border-gray-200"
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
          />
        </div>

        <div className="flex gap-2">
          {/* <Button variant="outline">
						<Upload />
						Import from CSV
					</Button> */}
          <Select
            defaultValue={order}
            onValueChange={(value: React.SetStateAction<string>) =>
              setOrder(value)
            }
          >
            <SelectTrigger className="w-auto px-2 gap-1 text-black font-medium appearance-none [&>svg:last-child]:hidden">
              <ArrowDownWideNarrow className="h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">ASC</SelectItem>
              <SelectItem value="desc">DESC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-[#FFF0EB] text-sm">
          <TableRow className="hover:bg-[#FFF0EB] font-semibold border-gray-200">
            {allColumns.map((col) => (
              <TableHead
                className={`px-4 ${
                  col.key === "action" ? "text-end w-20" : ""
                }`}
                key={col.key}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={allColumns.length}>Loading...</TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={allColumns.length}>No data</TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow
                key={idx}
                className={cn(
                  `hover:bg-white even:bg-gray-50`,
                  isDeleted == row.id
                    ? "bg-red-400 even:bg-red-400 text-white opacity-30"
                    : ""
                )}
              >
                {allColumns.map((col) => (
                  <TableCell
                    className={`px-4 ${
                      col.key === "action" ? "text-center w-20" : ""
                    }`}
                    key={col.key}
                  >
                    <DataTableCells col={col} row={row} data={data} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="px-4 text-sm text-muted-foreground flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
        <div className="w-60">
          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
          {total}
        </div>

        <Pagination>
          <PaginationContent className="flex w-full justify-between items-center">
            <div className="flex-1 flex justify-center">
              {renderPageLinks()}
            </div>
            <div className="flex items-center gap-2">
              <PaginationItem className="rounded-[8px]">
                <PaginationPrevious
                  href="#"
                  className="border border-gray-300 hover:border-brand-pumpkin hover:bg-brand-pumpkin hover:text-white"
                  onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem className="rounded-[8px]">
                <PaginationNext
                  href="#"
                  className="border border-gray-300 hover:border-brand-pumpkin hover:bg-brand-pumpkin hover:text-white"
                  onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                />
              </PaginationItem>
            </div>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
