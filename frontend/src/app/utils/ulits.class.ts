import { EmailRule, RequiredRule, StringLengthRule } from "devextreme/common";

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
}