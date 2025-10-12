export type User = {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	phone?: string;
	status?: number;
	role_id?: number;
};

export type BusinessInfo = {
	id: number;
	user_id: number;
	name: string;
	trade_name: string;
	business_type: string;
	category: string;
	license_number: string;
	license_authority: string;
	tax_number: string;
	incorporation_date: string;
	business_summary: string;
	employees: number;
	confirm: boolean;
	authorize: boolean;
	created_at: string;
	updated_at: string;
};

export type RegisteredAddress = {
	id: number;
	user_id: number;
	country: string;
	city: string;
	postal_code: string;
	address: string;
	phone_number: string;
	phone_code: string;
	country_code: string;
	email: string;
	created_at: string;
	updated_at: string;
};
export type DocumentsNode = {
	id: number | null;
	name: string | null;
	url: string | null;
};

export type Documents = {
	id: number;
	user_id: number | null;
	commercial_license: DocumentsNode | null;
	emirates_id_passport: DocumentsNode | null;
	tax_registration: DocumentsNode | null;
	articles_of_association: DocumentsNode | null;
	proof_of_address: DocumentsNode | null;
};

export type BankDetails = {
	id: number;
	user_id: number | null;
	cancelled_check: DocumentsNode | null;
	name: string | null;
	account_number: string | null;
	iban: string | null;
	swift_code: string | null;
};

export type SocialMediaType = {
	id: number;
	user_id: number | null;
	name: string | null;
	account_number: number | null;
	iban: string | null;
	swift_code: string | null;
	confirm?: boolean | null;
	authorize?: boolean | null;
};

export type UserInfoType = {
	id: number;
	user_id: number | null;
	fullname: string | null;
	phone_number: string | null;
	phone_code: string | null;
	nationality: string | null;
	designation: string | null;
	document: DocumentsNode | null;
	confirm?: boolean | null;
	authorize?: boolean | null;
};

export type AuthState = {
	token: string;
	user: User | null;
	isLoggedIn: boolean;

	setUser: (userObj: {
		token: string;
		user: User;
		isLoggedIn: boolean;
	}) => void;

	logout: () => void;
};
