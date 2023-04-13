import { Router } from 'express'
import { getAllCities, getCityById } from '../services/city.service.js'
const router = Router()

router
  .get('/all', getAllCities)
  .get('/', getCityById)

export default router