import { Router } from 'express'
import { 
  getAllAnnouncements, 
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByUser,
  addAnnouncementToFavorites,
  deleteAnnouncementFromFavorites,
  getFavoriteAnnouncements
} from '../services/announcement.service.js';
import {
  verifyAccess,
  decodeAccessToken
} from '../middlewares/index.js'

const router = Router()

router
  .get('/all', decodeAccessToken, getAllAnnouncements)
  .get('/', decodeAccessToken, getAnnouncementById)
  .post('/', verifyAccess, createAnnouncement)
  .patch('/', verifyAccess, updateAnnouncement)
  .delete('/', verifyAccess, deleteAnnouncement)
  .get('/by-user', verifyAccess, getAnnouncementsByUser)
  .get('/favorites', verifyAccess, getFavoriteAnnouncements)
  .post('/add-to-favorites', verifyAccess, addAnnouncementToFavorites)
  .delete('/delete-from-favorites', verifyAccess, deleteAnnouncementFromFavorites)

export default router