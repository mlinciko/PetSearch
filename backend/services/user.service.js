import { db } from "../index.js";
import _ from 'lodash';

export const getCurrentUser = async (req, res, next) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'User must be provided' })
  }
  try {
    const user = _.first(await db.query(`SELECT user_id, first_name, last_name, email, tel
     FROM User WHERE user_id=${userId}`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res
      .status(200)
      .json(user)

  } catch (e) {
    console.log('*getCurrentUser service')
    next(e)
  }
}

export const getUserById = async (req, res, next) => {
  const tokenUserId = req.user.user_id;
  const userId = req.query?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (tokenUserId != userId) {
    return res.status(400).json({ message: "You don't have permissions to do this" })
  }
  try {
    const user = _.first(await db.query(`SELECT user_id, first_name, last_name, email, tel
     FROM User WHERE user_id=${userId}`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res
      .status(200)
      .json(user)

  } catch (e) {
    console.log('*getUserById service')
    next(e)
  }
}

export const updateUser = async (req, res, next) => {
  const tokenUserId = req.user.user_id;
  const bodyUserId = req.body.user_id;
  const email = req.body?.email;
  const tel = req.body?.tel;
  const first_name = req.body?.first_name;
  const last_name = req.body?.last_name;

  if (!bodyUserId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (tokenUserId != bodyUserId) {
    return res.status(400).json({ message: "You don't have permissions to do this" })
  }
  try {
    const user = _.first(await db.query(`SELECT user_id, first_name, last_name, email, tel
     FROM User WHERE user_id=${bodyUserId}`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await db.query(`UPDATE User SET 
      email="${email ? email : user.email}",
      tel=${tel ? `"${tel}"` : user.tel},
      first_name="${first_name ? first_name : user.first_name}",
      last_name="${last_name ? last_name : user.last_name}"
      WHERE user_id=${bodyUserId}
    `)
    const updatedUser = _.first(await db.query(`SELECT user_id, first_name, last_name, email, tel
     FROM User WHERE user_id=${bodyUserId}`));

    res
      .status(200)
      .json(updatedUser)

  } catch (e) {
    console.log('*updateUser service')
    next(e)
  }
}

export const deleteUser = async(req, res, next) => {
  const tokenUserId = req.user.user_id;
  const userId = req.query?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (tokenUserId != userId) {
    return res.status(400).json({ message: "You don't have permissions to do this" })
  }
  try {
    await db.query(`DELETE FROM User WHERE user_id=${userId}`);
    res
      .status(200)
      .json("User has been deleted successfully!")

  } catch (e) {
    console.log('*deleteUser service')
    next(e)
  }
}