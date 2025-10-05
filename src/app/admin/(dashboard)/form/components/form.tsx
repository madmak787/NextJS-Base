/* eslint-disable */
"use client";
import React from "react";
import { Title } from "@/components/title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Textarea } from "@/components/ui/textarea";

export default function DataForm({
  mode,
  id,
  pageName = "New Data",
}: EditFormType) {
  const router = useRouter();
  const { loader, setLoader, setEdit, edit_data, resetPseudo } = usePseudo();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        setLoader(true);
        const response = await api(`/customers/${id}`, {}, "GET");
        setLoader(false);
        if (response?.success) {
          const customer = response.data;
          setEdit(customer);
          form.reset({
            ...customer,
            ...(customer && "shipping" in customer
              ? (customer.shipping as object)
              : {}),
            ...(customer && "billing" in customer
              ? (customer.billing as object)
              : {}),
          });
        } else {
          showError(response?.message ?? "Failed to load customer.");
        }
      })();
    } else {
      resetPseudo();
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const FormSchema = z.object({
    name: z
      .string({
        message: "Customer Name is required",
      })
      .min(3, { message: "Customer Name must be at least 3 characters long" }),
    first_name: z
      .string({
        error: "First Name is required",
      })
      .min(3, { message: "First Name must be at least 3 characters long" }),
    last_name: z
      .string({
        error: "Last Name is required",
      })
      .min(3, { message: "Last Name must be at least 3 characters long" }),
    email: z.string({ error: "Email is required" }),
    phone: z.object({
      code: z.string({ error: "Country code is required" }),
      number: z
        .string({ error: "Phone number is required" })
        .min(5, { message: "Phone number is too short" }),
    }),
    account_number: z
      .string({ error: "Account number is required" })
      .min(3, { message: "Account number must be at least 3 characters long" }),
    website: z.string().nullable().optional(),
    phone_code: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  });

  type ShippingAddressType = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: {
        code: "",
        number: "",
      },
      account_number: "",
      website: "",
      phone_code: "",
      phone_number: "",
      notes: "",
      ...(mode === "edit" ? edit_data : {}),
    },
  });

  async function onSubmit(data: ShippingAddressType) {
    setLoader(true);
    const payload = {
      ...data,
      phone_code: data.phone.code,
      phone_number: data.phone.number,
    };
    let result;
    if (edit_data && "id" in edit_data) {
      result = await api(`/customers/${(edit_data as any).id}`, payload, "PUT");
    } else {
      result = await api("/customers", payload);
    }
    setLoader(false);
    if (result.success) {
      setDisabled(true);
      toast.info(result.message);
      router.push("/customers");
    } else {
      showError(result.message);
    }
  }

  return (
    <>
      <Title
        title={pageName}
        subtitle={[{ name: "All Customers", link: "/customers" }]}
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
                    <RequiredLabel>Customer Name</RequiredLabel>
                    <FormControl>
                      <Input
                        className="shadow-gray-300 border-gray-300"
                        placeholder="Enter the Business Name"
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
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2 px-2">
                      <RequiredLabel>First Name</RequiredLabel>
                      <FormControl>
                        <Input
                          className="shadow-gray-300 border-gray-300"
                          placeholder="Enter the Business Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2 px-2">
                      <RequiredLabel>Last Name</RequiredLabel>
                      <FormControl>
                        <Input
                          className="shadow-gray-300 border-gray-300"
                          placeholder="Enter the Business Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>
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
              </div>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2 px-2">
                      <RequiredLabel>Account Number</RequiredLabel>
                      <FormControl>
                        <Input
                          className="shadow-gray-300 border-gray-300"
                          placeholder="Enter Account Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2 px-2">
                      <FormLabel
                        htmlFor="website"
                        className="flex flex-col items-start gap-0 font-semibold text-base"
                      >
                        Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="shadow-gray-300 border-gray-300"
                          placeholder="Enter Website"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2 px-2">
                      <FormLabel
                        htmlFor="website"
                        className="flex flex-col items-start gap-0 font-semibold text-base"
                      >
                        Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="shadow-gray-300 border-gray-300"
                          placeholder="Write notes if any ..."
                          {...field}
                          value={field.value ?? ""}
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
                  onClick={() => router.push("/customers")}
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
