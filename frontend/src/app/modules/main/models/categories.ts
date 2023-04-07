import { faPaw, faHandHoldingHeart, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

export const CATEGORIES = [
  {
    id: 1,
    icon: faCheckDouble,
    title: "All",
    route: "/all"
  },
  {
    id: 2,
    icon: faPaw,
    title: "Pet search",
    route: "/pet-search"
  },
  {
    id: 3,
    icon: faHandHoldingHeart,
    title: "Owner search",
    route: "/owner-search"
  },
]