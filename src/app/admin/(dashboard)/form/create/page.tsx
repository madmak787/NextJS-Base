import React from "react";
import { uuid } from "@/lib/utils";
import DataForm from "../components/form";

export default function Page() {
  return <DataForm key={uuid()} mode="create" id={null} pageName="New Data" />;
}
