import { Router } from 'express'
import { getAllStatuses, getStatusById } from '../services/status.service.js'
const router = Router()

router
  .get('/all', getAllStatuses)
  .get('/', getStatusById)

export default router