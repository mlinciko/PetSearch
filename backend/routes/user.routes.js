import { Router } from 'express'
import { getCurrentUser, updateUser, getUserById, deleteUser } from "../services/user.service.js"
import {
  verifyAccess
} from '../middlewares/index.js'

const router = Router()

router
  .get('/current', verifyAccess, getCurrentUser)
  .get('/', verifyAccess, getUserById)
  .patch('/', verifyAccess, updateUser)
  .delete('/', verifyAccess, deleteUser)

export default router