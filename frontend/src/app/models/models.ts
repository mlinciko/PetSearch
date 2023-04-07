import DevExpress from "devextreme";

export type IDxFormItems = Array<
  | DevExpress.ui.dxFormSimpleItem
  | DevExpress.ui.dxFormGroupItem
  | DevExpress.ui.dxFormTabbedItem
  | DevExpress.ui.dxFormEmptyItem
  | DevExpress.ui.dxFormButtonItem
>;

export interface IUser {
  user_id: number,
  last_name: string,
  first_name: string,
  email: string,
  tel: string,
  image: string,
  password?: string,
}

export interface IGuardPathes {
  regExp: RegExp | string;
  roles: string[];
  message: string;
  additionalRule?: "tokenDosentExsists" | "tokenDosentExpired",
}