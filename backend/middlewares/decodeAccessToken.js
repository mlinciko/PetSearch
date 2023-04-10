import { ACCESS_TOKEN_SECRET } from '../config/index.js'
import { verifyToken } from '../utils/token.js'

export const decodeAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  try {
    if (accessToken) {
      const decoded = await verifyToken(accessToken, ACCESS_TOKEN_SECRET)

      req.user = decoded
    }
    next()
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token has been expired' })
    }

    console.log('*decodeAccessToken middleware')
    next(e)
  }
}