export interface IAnnouncementType {
  [key: string]: {
    id: number,
    code: string,
  }
}
export const announcementTypes: IAnnouncementType = {
  PET_SEARCH: {
    id: 1,
    code: "pet-search"
  },
  OWNER_SEARCH: {
    id: 2,
    code: "owner-search"
  }
}