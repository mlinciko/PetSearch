export interface IFilter {
  pet_id: number | null,
  status_id: number | null,
  city_id: number | null,
  search: string | null,
}

export const initialFilterData: IFilter = {
  pet_id: null,
  status_id: null,
  city_id: null,
  search: null,
}