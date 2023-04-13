import { Router } from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import announcementRoutes from './announcement.routes.js'
import cityRoutes from './city.routes.js'
import typeRoutes from './type.routes.js'
import petRoutes from './pet.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/announcement', announcementRoutes)
router.use('/city', cityRoutes)
router.use('/type', typeRoutes)
router.use('/pet', petRoutes)

export default router
