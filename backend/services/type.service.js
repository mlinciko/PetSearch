import { db } from "../index.js";
import _ from 'lodash';

export const getAllTypes = async(req, res, next) => {
  try {
    const types = await db.query(`SELECT * FROM Type ORDER BY name ASC`);
    res
      .status(200)
      .json(types)

  } catch (e) {
    console.log('*getAllTypes service')
    next(e)
  }
}

export const getTypeById = async(req, res, next) => {
  const typeId = req.query?.type_id;

  if (!typeId) {
    return res.status(400).json({ message: "Type id must be provided" })
  }
  try {
    const type = _.first(await db.query(`SELECT * FROM Type WHERE type_id=${typeId}`));
    if (!type) {
      return res.status(404).json({ message: 'Type not found' })
    }

    res
      .status(200)
      .json(type)

  } catch (e) {
    console.log('*getTypeById service')
    next(e)
  }
}