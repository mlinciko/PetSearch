import { Router } from 'express'
import { getCurrentUser, updateUser, getUserById, deleteUser, changeUserPassword, uploadImage } from "../services/user.service.js"
import {
  verifyAccess,
  fileUploader,
  fileExtLimiter
} from '../middlewares/index.js'

const router = Router()

router
  .get('/current', verifyAccess, getCurrentUser)
  .get('/', verifyAccess, getUserById)
  .patch('/', verifyAccess, updateUser)
  .delete('/', verifyAccess, deleteUser)
  .patch('/password-change', verifyAccess, changeUserPassword)
  .post(
    '/upload-image', 
    verifyAccess, 
    fileUploader, 
    fileExtLimiter(['.png', '.jpg', '.jpeg']), 
    uploadImage
   )

export default router