/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import axios, { AxiosRequestConfig, Method } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const medias = ["media", "attachment", "pdf", "file", "image", "logo", "banner"];

export async function api(
	endpoint: string,
	data: Record<string, any> | FormData = {},
	method: Method = "POST"
) {
	const token =
		JSON.parse(localStorage.getItem("admin-auth") || "{}")?.state?.token;

	const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
	let body: any = data;

	// Base headers
	const headers: Record<string, string> = {
		Accept: "application/json",
	};
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	// Axios config
	const config: AxiosRequestConfig = {
		url,
		method,
		headers,
	};

	// ✅ 1. Handle GET requests with query params
	if (method.toUpperCase() === "GET" && Object.keys(data).length > 0) {
		config.params = data;
		body = undefined;
	}

	// ✅ 2. Handle non-GET requests
	else if (method !== "GET" && method !== "HEAD") {
		// ✅ Detect if data is already a FormData
		if (data instanceof FormData) {
			body = data;
			delete config.headers?.["Content-Type"]; // let Axios handle it
		} else {
			// Otherwise build FormData manually (existing feature)
			const formData = new FormData();

			// Laravel needs POST + _method spoofing for PUT/PATCH
			if (method === "PUT" || method === "PATCH") {
				formData.append("_method", method);
				method = "POST";
				config.method = "POST";
			}

			// Append all fields
			for (const key in data) {
				if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
				const value = (data as any)[key];
				if (value === null || value === undefined) continue;

				if (medias.includes(key) || value instanceof File) {
					formData.append(key, value);
				} else if (typeof value === "object" && !(value instanceof Blob)) {
					formData.append(key, JSON.stringify(value));
				} else {
					formData.append(key, String(value));
				}
			}

			body = formData;
			delete config.headers?.["Content-Type"];
		}
	}

	config.data = body;

	try {
		const response = await axios(config);
		return response.data;
	} catch (error: any) {
		// ✅ Retain your existing 401 revalidation + redirect logic
		if (error.response?.status === 401) {
			try {
				const isAuthCheck =
					endpoint.startsWith("/admin/profile") ||
					endpoint.startsWith("/admin/login");
				if (!isAuthCheck) {
					await axios({
						url: `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: headers["Authorization"]!,
						},
					});
					throw error;
				}
			} catch {
				localStorage.removeItem("admin-auth");
				if (typeof window !== "undefined")
					window.location.href = "/admin/sign-in";
				return {
					success: false,
					message:
						error.response?.data?.message ?? "Unauthenticated",
				};
			}

			throw error;
		}

		throw error;
	}
}

export function formatDate(date: Date | string | null): string {
	if (!date) return "";

	const parsedDate = typeof date === "string" ? new Date(date) : date;

	if (isNaN(parsedDate.getTime())) return ""; // Invalid date

	const year = parsedDate.getFullYear();
	const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // months are 0-based
	const day = String(parsedDate.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
}

// utils/formatAmount.ts

export function formatAmount(amount: number | string, symbol: string = "AED", end: boolean = false): string {
	const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

	if (isNaN(numericAmount)) return end ? `0.00 ${symbol}` : `${symbol} 0.00`;

	const formatted = numericAmount.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	return end ? `${formatted} ${symbol}` : `${symbol} ${formatted}`;
}

export function deleteFile(id = 0) {
	api("/image/delete", { id: id }, "DELETE");
}

export function uuid(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export const showError = (message: string | Record<string, string[]>) => {
	if (typeof message === "string") {
		toast.error(message);
	} else if (typeof message === "object" && message !== null) {
		// Flatten all error messages into a single array
		const errors = Object.values(message).flat();
		// Show the first error (or all if you want)
		toast.error(errors[0]);
	}
};

export const notice = (message: string | Record<string, string[]>) => {
	if (typeof message === "string") {
		toast.success(message);
	} else if (typeof message === "object" && message !== null) {
		// Flatten all error messages into a single array
		const errors = Object.values(message).flat();
		// Show the first error (or all if you want)
		toast.success(errors[0]);
	}
};

export function truncate(text: string, max = 99): string {
	if (!text) return "";
	return text.length > max ? text.slice(0, max) + "..." : text;
}

/**
 * Recursively flattens nested form errors from React Hook Form.
 */
const flattenErrors = (errors: FieldErrors, parent: string = ""): { path: string; message: string }[] => {
	return Object.entries(errors).flatMap(([key, value]) => {
		const path = parent ? `${parent}.${key}` : key;

		if (value && typeof value === "object" && "message" in value) {
			return [{ path, message: value.message as string }];
		}

		if (typeof value === "object") {
			return flattenErrors(value as FieldErrors, path);
		}

		return [];
	});
};

/**
 * Show all validation errors using toast notifications.
 *
 * @param errors - The formState.errors object from React Hook Form
 */
export const showAllFormErrors = (errors: FieldErrors) => {
	const allErrors = flattenErrors(errors);

	allErrors.forEach(({ path, message }) => {
		toast.error(`${path}: ${message}`);
	});
};