import { Router } from 'express'
import { getImageByName } from '../services/image.service.js'
const router = Router()

router
  .get('/', getImageByName)

export default router