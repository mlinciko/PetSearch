import { Router } from 'express'
import { getAllPets, getPetById } from '../services/pet.service.js'
const router = Router()

router
  .get('/all', getAllPets)
  .get('/', getPetById)

export default router