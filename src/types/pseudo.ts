export type PseudoState = {
	loader: boolean;
	otp: string | null;
	email: string;
	phone: string;
	isVerified: boolean;
	isDeleted: string | null;
	isEdited: string | null;
	edit_data: object | null;

	setLoader: (loader: boolean) => void;
	setOtp: (otp: string | null) => void;
	setEmail: (email: string) => void;
	setPhone: (phone: string) => void;
	setVerified: (status: boolean) => void;
	setDeleted: (id: string | null) => void;
	setEdited: (id: string | null) => void;
	setEdit: (data: null | object) => void;

	resetPseudo: () => void;
};

export type EditFormType = {
  mode?: "create" | "edit";
  id?: string | null;
  pageName?: string;
};