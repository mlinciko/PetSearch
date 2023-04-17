import { db } from "../index.js";
import _ from 'lodash';

export const getAllStatuses = async(req, res, next) => {
  try {
    const pets = await db.query(`SELECT * FROM Status ORDER BY name ASC`);
    res
      .status(200)
      .json(pets)

  } catch (e) {
    console.log('*getAllStatuses service')
    next(e)
  }
}

export const getStatusById = async(req, res, next) => {
  const statusId = req.query?.status_id;

  if (!statusId) {
    return res.status(400).json({ message: "Status id must be provided" })
  }
  try {
    const status = _.first(await db.query(`SELECT * FROM Status WHERE status_id=${statusId}`));
    if (!status) {
      return res.status(404).json({ message: 'Status not found' })
    }

    res
      .status(200)
      .json(status)

  } catch (e) {
    console.log('*getStatusById service')
    next(e)
  }
}