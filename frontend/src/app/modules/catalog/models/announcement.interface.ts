export interface IAnnouncement {
  announcement_id: number,
  title: string,
  descr: string,
  createdAt: string,
  closedAt: string | null,
  type_id: number,
  type_name: string,
  status_id: number,
  status_name: string,
  user_id: number,
  user_first_name: string,
  user_last_name: string,
  user_image?: string,
  city_id: number,
  city_name: string,
  pet_id: number,
  pet_type_name: string,
  is_favorite?: boolean,
}