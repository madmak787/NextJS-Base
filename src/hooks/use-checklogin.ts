"use client";

import { useEffect, useState } from "react";
import useAuth from "@/stores/useAuth";
import { useRouter } from "next/navigation";

export function useCheckLogin() {
	const isLoggedIn = useAuth((state) => state.isLoggedIn);
	const user = useAuth((state) => state.user);
	const router = useRouter();
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	useEffect(() => {
		if (!hasHydrated) return;

		if (isLoggedIn) {
			if(user?.role_id === 1) {
				router.push("/admin/dashboard");
				return;
			}
			router.push("admin/dashboard");
		} else {
			router.push("admin/sign-in");
		}
	}, [hasHydrated, isLoggedIn]); // Trigger this effect when hydrated or login state changes
}

export function useAfterLogin() {
	const { isLoggedIn } = useAuth();
	// const user = useAuth((state) => state.user);
	const router = useRouter();
	// const pathname = usePathname();
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	useEffect(() => {
		if (!hasHydrated) return;
		if (isLoggedIn) {
			// if (user?.status != 1 && !pathname.includes('business-profile')) {
			// 	router.push("/business-profile");
			// }
		} else {
			router.push("admin/sign-in");
		}
	}, [hasHydrated, isLoggedIn]); // Trigger this effect when hydrated or login state changes
}
