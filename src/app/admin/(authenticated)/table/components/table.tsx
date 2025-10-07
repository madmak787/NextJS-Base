/* eslint-disable */
"use client";
import { DataTable } from "@/components/DataTable";
import { actionColumn } from "@/components/column-action";

export default function Table() {
  const endpoint = "/admin/data";
  return (
    <DataTable
      endpoint={endpoint}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        actionColumn(endpoint, ["edit", "delete"]),
      ]}
    />
  );
}
