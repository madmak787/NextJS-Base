import React from "react";
import { Card } from "@/components/ui/card";
import { Title } from "@/components/title";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Table from "./components/table";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Title title="All Data" />
      <div className="flex justify-between items-center">
        <span className="text-[#4A5567]">View and manage data</span>
        <Link href="/admin/form/create">
          <Button>
            <Plus /> Add New
          </Button>
        </Link>
      </div>

      <Card className="@container/card border-[#E6EBF0] bg-white shadow-xl shadow-gray-200 gap-1">
        <Table />
      </Card>
    </>
  );
}
