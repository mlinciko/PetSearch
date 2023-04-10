import { IAnnouncement } from "./announcement.interface";

export interface IFavoriteChangedEvent {
  action: "add" | "delete",
  item: IAnnouncement,
}