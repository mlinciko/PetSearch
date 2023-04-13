export interface ICreateAnnouncement {
  title: string,
  descr: string,
  type_id: number | null,
  city_id: number | null,
  pet_id: number | null,
}

export const initialCreateAnnouncement: ICreateAnnouncement = {
  title: "",
  descr: "",
  type_id: null,
  city_id: null,
  pet_id: null,
}