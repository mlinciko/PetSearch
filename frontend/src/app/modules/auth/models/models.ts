export interface ILoginPayload {
  password: string,
  email: string,
}

export interface IToken {
  accessToken: string
}

export interface IAuthResponse {
  status: boolean,
  message: string,
}

export interface IRegistryPayload {
  email: string | null,
  first_name: string  | null,
  last_name: string  | null,
  password: string | null,
  tel: string | null,
}

export type TRegistryData = IRegistryPayload & {password_confirm: string | null};

export const initRegistryFormData: TRegistryData = {
  email: null,
  first_name: null,
  last_name: null,
  password: null,
  tel: null,
  password_confirm: null
}