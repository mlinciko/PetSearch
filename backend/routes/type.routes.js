import { Router } from 'express'
import { getAllTypes, getTypeById } from '../services/type.service.js'
const router = Router()

router
  .get('/all', getAllTypes)
  .get('/', getTypeById)

export default router