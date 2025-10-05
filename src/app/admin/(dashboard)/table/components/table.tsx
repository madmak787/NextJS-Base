/* eslint-disable */
"use client";
import { DataTable } from "@/components/DataTable";
import { actionColumn } from "@/components/column-action";

export default function Table() {
  const endpoint = "/customers";
  return (
    <DataTable
      endpoint={endpoint}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        // { key: "cards", label: "Saved cards" },
        { key: "balance", label: "Balance/Overdue" },
        actionColumn(endpoint, ["edit", "delete"]),
      ]}
    />
  );
}
