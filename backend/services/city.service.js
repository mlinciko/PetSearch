import { db } from "../index.js";
import _ from 'lodash';

export const getAllCities = async(req, res, next) => {
  try {
    const cities = await db.query(`SELECT * FROM City ORDER BY name ASC`);
    res
      .status(200)
      .json(cities)

  } catch (e) {
    console.log('*getAllCities service')
    next(e)
  }
}

export const getCityById = async(req, res, next) => {
  const cityId = req.query?.city_id;

  if (!cityId) {
    return res.status(400).json({ message: "City id must be provided" })
  }
  try {
    const city = _.first(await db.query(`SELECT * FROM City WHERE city_id=${cityId}`));
    if (!city) {
      return res.status(404).json({ message: 'City not found' })
    }

    res
      .status(200)
      .json(city)

  } catch (e) {
    console.log('*getCityById service')
    next(e)
  }
}