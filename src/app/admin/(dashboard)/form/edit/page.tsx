"use client";
import React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DataForm from "../components/form";
import { uuid } from "@/lib/utils";

function EditDataInner() {
  const sp = useSearchParams();
  const id = sp.get("hid") ?? undefined; // pass undefined if missing

  return <DataForm key={uuid()} mode="edit" id={id} pageName="Edit Data" />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">Loading data…</div>
      }
    >
      <EditDataInner />
    </Suspense>
  );
}
