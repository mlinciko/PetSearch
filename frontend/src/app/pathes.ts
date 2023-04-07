import { IGuardPathes } from "./models/models";

export const guardPathes: IGuardPathes[] = [
  {
    regExp: /^\/sign/,
    message: "You are already logged in",
    additionalRule: "tokenDosentExists"
  },
  {
    regExp: /^\/sign\/in/,
    message: "You are already logged in",
    additionalRule: "tokenDosentExists"
  },
  {
    regExp: /^\/sign\/up/,
    message: "You are already logged in",
    additionalRule: "tokenDosentExists"
  },
  {
    regExp: /^\/account/,
    message: "You are not authorized",
    additionalRule: "tokenExists"
  }
]