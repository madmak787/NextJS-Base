"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Save, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { api, showAllFormErrors, showError } from "@/lib/utils";
import { Title } from "@/components/title";
import useAuth from "@/stores/useAuth";
import ChangePasswordDialog from "./components/change-password-dialog";

const ProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

export default function AdminProfilePage() {
  const { user, setUser, token } = useAuth();
  const [loader, setLoader] = useState(false);

  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    (async () => {
      const res = await api("/admin/profile", {}, "GET");
      if (res.success) {
        form.reset(res.data);
      }
    })();
  }, []);

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setLoader(true);
    const res = await api("/admin/profile", values, "POST");
    setLoader(false);
    if (res.success) {
      toast.success(res.message);
      setUser({
        user: res.data,
        token: token,
        isLoggedIn: true,
      });
    } else {
      showError(res.message);
    }
  }

  return (
    <>
      <Title
        title="My Profile"
        subtitle={[{ name: "Dashboard", link: "/admin/dashboard" }]}
      />
      <div className="bg-card p-6 rounded-xl shadow-md w-full md:w-2/3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, showAllFormErrors)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Full Name</label>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Email</label>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      readOnly={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Phone</label>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 mt-6">
              <Button type="submit" disabled={loader}>
                {loader ? (
                  <Loader2Icon className="animate-spin h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Save Changes
              </Button>

              <ChangePasswordDialog>
                <Button variant="outline" type="button">
                  <KeyRound className="h-5 w-5" /> Change Password
                </Button>
              </ChangePasswordDialog>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
