import { db } from "../index.js";
import _ from 'lodash';

export const getAllPets = async(req, res, next) => {
  try {
    const pets = await db.query(`SELECT * FROM PetType ORDER BY name ASC`);
    res
      .status(200)
      .json(pets)

  } catch (e) {
    console.log('*getAllPets service')
    next(e)
  }
}

export const getPetById = async(req, res, next) => {
  const petId = req.query?.pet_id;

  if (!petId) {
    return res.status(400).json({ message: "Pet id must be provided" })
  }
  try {
    const pet = _.first(await db.query(`SELECT * FROM PetType WHERE pet_id=${petId}`));
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' })
    }

    res
      .status(200)
      .json(pet)

  } catch (e) {
    console.log('*getPetById service')
    next(e)
  }
}