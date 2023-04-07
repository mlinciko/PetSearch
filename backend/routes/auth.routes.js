import { Router } from 'express'
import {
  verifyAccess,
  verifyResfresh
} from '../middlewares/index.js'
import {
  loginUser,
  logoutUser,
  registerUser,
  updateAccessToken
} from '../services/auth.service.js'
import { setCookie } from '../middlewares/setCookie.js'

const router = Router()

router
  .post('/register', registerUser)
  .post('/login', loginUser)
  .get('/logout', verifyAccess, logoutUser)
  .get('/', verifyResfresh, updateAccessToken)
  .use(setCookie)

export default router
