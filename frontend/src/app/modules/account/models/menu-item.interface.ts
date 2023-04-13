import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface IMenuItem {
  title: string;
  path?: string;
  template?: string;
  icon: IconDefinition | any,
}