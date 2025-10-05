/* eslint-disable */
import { Download, Eye, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api, cn } from "@/lib/utils";
import usePseudo from "@/stores/usePseudo";

type Action = "view" | "edit" | "delete" | "download";

export const actionColumn = (
  endpoint: string,
  allowedActions?: Action[],
  route: string = ""
) => ({
  label: "Action",
  key: "action",
  render: (row: any) => {
    const router = useRouter();
    const { isDeleted, setDeleted, setEdited, setEdit } = usePseudo();

    const allActions = [
      {
        name: "download" as Action,
        icon: Download,
        label: "Download",
        onClick: async () => {
          window.open(row?.pdf?.url, "_blank");
        },
      },
      {
        name: "view" as Action,
        icon: Eye,
        label: "View",
        // onClick: () => router.push(`${endpoint}/${row.id}`),
        onClick: () => router.push(`${endpoint}/view?hid=${row.hid}`),
      },
      {
        name: "edit" as Action,
        icon: SquarePen,
        label: "Edit",
        onClick: () => {
          // setEdited(row.id);
          setEdit(row);
          // router.push(`${endpoint}/edit?id=${row.id}`);
          router.push(`${route ?? endpoint}/edit?hid=${row.hid}`);
        },
      },
      {
        name: "delete" as Action,
        icon: Trash2,
        label: "Delete",
        onClick: async () => {
          if (confirm(`Are you sure you want to delete?`)) {
            setDeleted(row.id);
            const result = await api(`${endpoint}/${row.id}`, [], "DELETE");
            setDeleted(null);
          }
        },
      },
    ];

    const actionsToShow =
      !allowedActions || allowedActions.length === 0
        ? allActions
        : allActions.filter((action) => allowedActions.includes(action.name));

    return (
      <div className="flex gap-2">
        {actionsToShow.map(({ icon: Icon, label, onClick }, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClick();
                }}
                className={cn(
                  "text-gray-600 hover:bg-brand-pumpkin hover:text-white shadow shadow-gray-400 flex rounded",
                  isDeleted && label === "Delete"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                )}
              >
                <Icon className="text-inherit w-6 h-6 p-1" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  },
});

export const actionGrid = (
  endpoint: string,
  allowedActions?: Action[],
  route: string = ""
) => ({
  label: "Action",
  key: "action",
  render: (row: any) => {
    const router = useRouter();
    const { isDeleted, setDeleted, setEdit } = usePseudo();

    const allActions = [
      {
        name: "download" as Action,
        icon: Download,
        label: "Download",
        className:
          "text-gray-500 border border-gray-300 hover:bg-red-500 hover:text-white",
        onClick: async () => {
          window.open(row?.pdf?.url, "_blank");
        },
      },
      {
        name: "view" as Action,
        icon: Eye,
        label: "View",
        className:
          "border border-orange-300 shadow-orange-300 hover:bg-brand-blue hover:text-white",
        onClick: () => router.push(`${endpoint}/${row.id}`),
      },
      {
        name: "edit" as Action,
        icon: SquarePen,
        label: "Edit",
        className:
          "text-white bg-brand-pumpkin shadow-brand-pumpkin hover:bg-orange-600 hover:text-white",
        // onClick: () => {
        //   setEdited(row.id);
        //   router.push(`${endpoint}/${row.id}/edit`);
        // },
        onClick: () => {
          // setEdited(row.id);
          setEdit(row);
          // router.push(`${endpoint}/edit?id=${row.id}`);
          router.push(`${route ?? endpoint}/edit?id=${row.hid}`);
        },
      },
      {
        name: "delete" as Action,
        icon: Trash2,
        label: "Delete",
        className:
          "text-gray-500 border border-gray-300 hover:bg-red-500 hover:text-white",
        onClick: async () => {
          if (confirm(`Are you sure you want to delete?`)) {
            setDeleted(row.id);
            const result = await api(`${endpoint}/${row.id}`, [], "DELETE");
            setDeleted(null);
          }
        },
      },
    ];

    const actionsToShow =
      !allowedActions || allowedActions.length === 0
        ? allActions
        : allActions.filter((action) => allowedActions.includes(action.name));

    return (
      <div className="flex gap-2">
        {actionsToShow.map(({ icon: Icon, label, className, onClick }, idx) => (
          <Link
            key={idx}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClick();
            }}
            className={cn(
              "text-gray-600 hover:text-white shadow shadow-gray-400 flex items-center gap-1 px-2 py-1 rounded text-sm",
              className,
              isDeleted && label === "Delete"
                ? "opacity-50 cursor-not-allowed"
                : ""
            )}
          >
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}
      </div>
    );
  },
});
