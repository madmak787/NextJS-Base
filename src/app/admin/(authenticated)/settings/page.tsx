"use client";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/stores/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Row = { key: string; value: string | File | null; isFile?: boolean };

export default function AdminSettingsPage() {
  const { settings, loaded, fetchSettings, saveSettings } = useSettings();
  const [rows, setRows] = useState<Row[]>([]);
  const [referenceId, setReferenceId] = useState<string>(""); // optional scoping

  // Load once
  useEffect(() => {
    fetchSettings();
  }, []);

  // Map settings to editable rows
  useEffect(() => {
    if (!loaded) return;
    const next: Row[] = Object.entries(settings || {}).map(([k, v]) => ({
      key: k,
      value: v ?? "",
      isFile: typeof v === "string" && v.startsWith("settings/"), // heuristic
    }));
    setRows(next);
  }, [loaded, settings]);

  const addRow = () => {
    setRows((prev) => [...prev, { key: "", value: "", isFile: false }]);
  };

  const removeRow = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const onChange = (idx: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const submit = async () => {
    const fd = new FormData();
    if (referenceId) fd.append("reference_id", referenceId);

    rows.forEach((r) => {
      if (!r.key) return;
      if (r.isFile) {
        const file = r.value as File | null;
        if (file) fd.append(r.key, file);
      } else {
        fd.append(r.key, (r.value ?? "").toString());
      }
    });

    await saveSettings(fd);
    alert("Settings saved");
  };

  const canSubmit = useMemo(
    () => rows.every((r) => r.key.trim().length > 0),
    [rows]
  );

  if (!loaded) return <div className="p-6">Loading settings…</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Settings (Key–Value)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="reference_id">Reference ID (optional)</Label>
              <Input
                id="reference_id"
                placeholder="e.g. vendorId"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="button" onClick={addRow}>
                Add Row
              </Button>
              <Button type="button" onClick={submit} disabled={!canSubmit}>
                Save
              </Button>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
              >
                <div className="md:col-span-4">
                  <Label>Key</Label>
                  <Input
                    placeholder="website_name, primary_color, logo, etc."
                    value={row.key}
                    onChange={(e) => onChange(idx, { key: e.target.value })}
                  />
                </div>

                <div className="md:col-span-3">
                  <Label>Value Type</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!row.isFile}
                        onChange={() =>
                          onChange(idx, {
                            isFile: false,
                            value: (row.value as string) ?? "",
                          })
                        }
                      />
                      <span>Text</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!!row.isFile}
                        onChange={() =>
                          onChange(idx, { isFile: true, value: null })
                        }
                      />
                      <span>File</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <Label>Value</Label>
                  {!row.isFile ? (
                    <Input
                      placeholder="value…"
                      value={(row.value as string) ?? ""}
                      onChange={(e) => onChange(idx, { value: e.target.value })}
                    />
                  ) : (
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(idx, { value: file });
                      }}
                    />
                  )}
                </div>

                <div className="md:col-span-1">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeRow(idx)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
