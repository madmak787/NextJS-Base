"use client";
import React from "react";
import { Title } from "@/components/title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import usePseudo from "@/stores/usePseudo";
import { toast } from "sonner";
import { api, showAllFormErrors, showError } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditFormType } from "@/types";
import { Input } from "@/components/ui/input";
import { RequiredLabel } from "@/components/required-label";

export default function DataForm({
  mode,
  id,
  pageName = "New Data",
}: EditFormType) {
  const router = useRouter();
  const { loader, setLoader, setEdit, edit_data, resetPseudo } = usePseudo();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    console.log(mode, id);
    if (mode === "edit" && id) {
      (async () => {
        setLoader(true);
        const response = await api(`/admin/data/${id}`, {}, "GET");
        setLoader(false);
        if (response?.success) {
          const data = response.data;
          setEdit(data);
          form.reset({
            ...data,
          });
        } else {
          showError(response?.message ?? "Failed to load data.");
        }
      })();
    } else {
      resetPseudo();
      form.reset();
    }
  }, [mode, id]);

  const FormSchema = z.object({
    name: z
      .string({
        message: "Name is required",
      })
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string({ error: "Email is required" }),
    phone: z.string({ error: "Phone number is required" }),
  });

  type ShippingAddressType = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      ...(mode === "edit" ? edit_data : {}),
    },
  });

  async function onSubmit(data: ShippingAddressType) {
    setLoader(true);
    const payload = {
      ...data,
    };
    let result;
    if (edit_data && "id" in edit_data) {
      result = await api(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `/admin/data/${(edit_data as any).id}`,
        payload,
        "PUT"
      );
    } else {
      result = await api("/admin/data", payload);
    }
    setLoader(false);
    if (result.success) {
      setDisabled(true);
      toast.info(result.message);
      router.push("/admin/table");
    } else {
      showError(result.message);
    }
  }

  return (
    <>
      <Title
        title={pageName}
        subtitle={[{ name: "All Data", link: "/admin/table" }]}
      />
      <div className="grid grid-cols-1 gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, showAllFormErrors)}
            className="space-y-8"
          >
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-1/2 px-2">
                    <RequiredLabel>Name</RequiredLabel>
                    <FormControl>
                      <Input
                        className="shadow-gray-300 border-gray-300"
                        placeholder="Enter the Name"
                        disabled={disabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <div className="flex">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2 px-2">
                      <RequiredLabel>Email</RequiredLabel>
                      <FormControl>
                        <Input
                          className="shadow-gray-300 border-gray-300"
                          placeholder="Enter Email Address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2 px-2">
                      <RequiredLabel>Phone</RequiredLabel>
                      <FormControl>
                        <Input
                          className="shadow-gray-300 border-gray-300"
                          placeholder="Enter Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {!disabled && (
              <div className="flex gap-4 w-1/2 pe-5">
                <Button disabled={loader} type="submit">
                  {loader ? (
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {edit_data ? "Update" : "Save"}
                </Button>
                <Button
                  disabled={loader}
                  onClick={() => router.push("/admin/table")}
                  variant="outline"
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
