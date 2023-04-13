import { EmailRule, RequiredRule, StringLengthRule } from "devextreme/common";
import { dictionaryParams } from "../models/models";

export class Utils {
  public static requiredRule(): RequiredRule {
    return {
      type: "required",
      message: "Field is required",
    };
  }

  public static emailRule(): EmailRule {
    return {
      type: "email",
      message: "Invalid email",
    };
  }

  public static passwordLengthRule(): StringLengthRule {
    return {
      type: "stringLength",
      min: 8,
      max: 1024,
      message: "Invalid password range",
    };
  }

  public static getParamNameByUrl(url: string): string | null {
    const dictionary = url.split("/")[0]
    const paramName = dictionaryParams[dictionary];
    return paramName ? paramName : null;
  }
}