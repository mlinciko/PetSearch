import { IMenuItem } from "./menu-item.interface"

export const ANNOUNCEMENTS_MENU_ITEMS: IMenuItem[] = [
  {
    title: "My announcements",
    path: "user-announcements",
  },
  {
    title: "Favorites",
    path: "favorites"
  }
]

export const CHATS_MENU_ITEMS: IMenuItem[] = [
  {
    title: "Chats",
    path: "/g",
  },
]

export const PROFILE_MENU_ITEMS: IMenuItem[] = [
  {
    title: "Profile management",
    path: "profile-management",
  },
  {
    title: "Change password",
    path: "change-password",
  },
]