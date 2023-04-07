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
    console.log(user);
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