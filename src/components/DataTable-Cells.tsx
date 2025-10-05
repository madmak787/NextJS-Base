/* eslint-disable */
import React from "react";
import { formatAmount, formatDate, truncate } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface DataTableCol {
  key: string;
  render?: (row: any) => React.ReactNode;
  [key: string]: any;
}

interface DataTableCellsProps {
  col: DataTableCol;
  row: { [key: string]: any };
  data?: any[];
}

export const DataTableCells: React.FC<DataTableCellsProps> = ({
  col,
  row,
  data = [],
}) => {
  const value = row[col.key];

  let content;

  switch (true) {
    case col.key === "company" && value !== null:
      content = value?.name;
      break;

    case "render" in col && typeof col.render === "function":
      content = col.render(row);
      break;

    case typeof value === "string" && value.includes("<"):
      content = <span dangerouslySetInnerHTML={{ __html: value }} />;
      break;

    case col.key === "phone" && value !== null:
      content = value?.code + " " + value?.number;
      break;

    case col.key === "due_date" && value !== null:
      content = (
        <span className="flex gap-2 items-center">
          <Calendar className="w-4 h-4" /> {formatDate(value)}
        </span>
      );
      break;

    case col.key === "status" && value !== null:
      content =
        value == 1 ? (
          <Badge variant="secondary">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        );
      break;

    case col.key === "total" && value !== null:
      content = formatAmount(value);
      break;

    case col.key === "name" && value !== null:
      content = (
        <>
          <span className="font-bold">{value}</span>
          {row["first_name"] && (
            <span className="block">
              {row["first_name"]} {row["last_name"]}
            </span>
          )}
          <span className="block">
            {row["description"] && (
              <Tooltip>
                <TooltipTrigger>{truncate(row["description"])}</TooltipTrigger>
                <TooltipContent>{row["description"]}</TooltipContent>
              </Tooltip>
            )}
          </span>
        </>
      );
      break;

    case col.key === "price" && value !== null:
      content = (
        <>
          {row["sale_price"] > 0 ? (
            <span className="text-brand-pumpkin font-semibold">
              <span className="line-through text-gray-400 mr-2">{value}</span>
              {formatAmount(row["sale_price"])}
            </span>
          ) : (
            <span className="text-brand-pumpkin font-semibold">
              {formatAmount(value)}
            </span>
          )}
        </>
      );
      break;

    case typeof value === "object" && value !== null:
      content = JSON.stringify(value); // or custom render
      break;

    default:
      content = value;
  }

  return <>{content}</>;
};
