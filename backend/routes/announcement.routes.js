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
  getFavoriteAnnouncements,
  closeAnnouncement,
  uploadImage
} from '../services/announcement.service.js';
import {
  verifyAccess,
  decodeAccessToken,
  fileUploader,
  fileExtLimiter
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
  .get('/close', verifyAccess, closeAnnouncement)
  .post(
    '/upload-image', 
    verifyAccess, 
    fileUploader, 
    fileExtLimiter(['.png', '.jpg', '.jpeg']), 
    uploadImage
   )

export default router