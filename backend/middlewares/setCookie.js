import { readFileSync } from 'fs'
import { ACCESS_TOKEN_SECRET, COOKIE_NAME } from '../config/index.js'
import { signToken } from '../utils/token.js'

const PRIVATE_KEY = readFileSync('./config/private_key.pem', 'utf8')

export const setCookie = async (req, res, next) => {
  const user = req.user
  console.log(user);

  if (!user) {
    return res.status(400).json({ message: 'User must be provided' })
  }

  try {
    const accessToken = await signToken(
      { user_id: user.user_id },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1h'
      }
    )

    let refreshToken
    if (!req.cookies[COOKIE_NAME]) {
      refreshToken = await signToken({ user_id: user.user_id }, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '7d'
      })

      res.cookie(COOKIE_NAME, refreshToken, {
        secure: true,
        sameSite: 'none'
      })
    }

    res.status(200).json({ accessToken })
  } catch (e) {
    console.log('*setCookie middleware')
    next(e)
  }
}
