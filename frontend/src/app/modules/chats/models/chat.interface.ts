import { IAnnouncement } from "../../catalog/models/announcement.interface";

export interface IChat {
  room_id: number,
  announcement: IAnnouncement,
}