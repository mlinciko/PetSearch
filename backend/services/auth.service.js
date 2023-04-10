import argon2 from 'argon2'
import { COOKIE_NAME } from '../config/index.js'
import { db } from "../index.js";
import _ from 'lodash';

export const updateAccessToken = async (req, res, next) => {
  try {
    next('route')
  } catch (e) {
    console.log('*getUser service')
    next(e)
  }
}

export const registerUser = async (req, res, next) => {
  const first_name = req.body?.first_name
  const last_name = req.body?.last_name
  const email = req.body?.email
  const password = req.body?.password
  const tel = req.body?.tel

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password must be provided' })
  }

  if (!first_name || !last_name) {
    return res
      .status(400)
      .json({ message: 'First name and Last name must be provided' })
  }

  try {
    const existingUser = _.first(await db.query(`SELECT * FROM User WHERE email="${email}"`));
    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Email already in use' })
    }

    const hashedPassword = await argon2.hash(password)

    const response = await db.query(`INSERT INTO User(user_id, first_name, last_name, email, tel, password) 
    VALUES(default, "${first_name}", "${last_name}", "${email}", ${tel ? `"${tel}"` : 'NULL'}, "${hashedPassword}")`);
    const newUser = _.first(await db.query(`SELECT user_id, first_name, last_name, email, tel FROM
    User WHERE user_id=${response.insertId}`));

    req.user = { ...newUser }

    next('route')
  } catch (e) {
    console.log('*registerUser service')
    next(e)
  }
}

export const loginUser = async (req, res, next) => {
  const email = req.body?.email
  const password = req.body?.password

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password must be provided' })
  }

  try {
    const user = _.first(await db.query(`SELECT * FROM User WHERE email="${email}"`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordCorrect = await argon2.verify(user.password, password)

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: 'Wrong credentials' })
    }
    delete user.password;
    req.user = { ...user }

    next('route')
  } catch (e) {
    console.log('*loginUser service')
    next(e)
  }
}

export const logoutUser = (req, res, next) => {
  res.clearCookie(COOKIE_NAME)
  res.status(200).json({ message: 'User has been logout' })
}
