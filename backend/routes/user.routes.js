import { Router } from 'express'
import { getCurrentUser } from "../services/user.service.js"
import {
  verifyAccess
} from '../middlewares/index.js'

const router = Router()

router
  .get('/current', verifyAccess, getCurrentUser)

export default router