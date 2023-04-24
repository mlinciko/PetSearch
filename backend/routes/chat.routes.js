import { Router } from 'express'
import { getUserChats, createChat } from '../services/chat.service.js'
import { verifyAccess } from '../middlewares/verifyAccess.js'
const router = Router()

router
  .get('/', verifyAccess, getUserChats)
  .post('/', verifyAccess, createChat)

export default router