import { IGuardPathes } from "./models/models";

export const guardPathes: IGuardPathes[] = [
  {
    regExp: /^\/sign/,
    roles: [],
    message: "You are already logged in",
    additionalRule: "tokenDosentExsists"
  },
  {
    regExp: /^\/sign\/in/,
    roles: [],
    message: "You are already logged in",
    additionalRule: "tokenDosentExsists"
  },
  {
    regExp: /^\/sign\/up/,
    roles: [],
    message: "You are already logged in",
    additionalRule: "tokenDosentExsists"
  },
]