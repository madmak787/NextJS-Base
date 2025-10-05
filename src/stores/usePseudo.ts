import { create } from "zustand";
import type { PseudoState } from "@/types";

const usePseudo = create<PseudoState>()((set) => ({
	loader: false,
	otp: null,
	email: "",
	phone: "",
	isVerified: false,
	isDeleted: null,
	isEdited: null,
	edit_data: null,

	setLoader: (loader) => set({ loader }),
	setOtp: (otp) => set({ otp }),
	setEmail: (email) => set({ email }),
	setPhone: (phone) => set({ phone }),
	setVerified: (status) => set({ isVerified: status }),
	setDeleted: (id) => set({ isDeleted: id }),
	setEdited: (id) => set({ isEdited: id }),
	setEdit: (data) => set({ edit_data: data }),

	resetPseudo: () => set({ otp: null, email: "", phone: "", isVerified: false, isDeleted: null, isEdited: null, edit_data: null }),
}));

export default usePseudo;