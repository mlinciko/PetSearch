import { db } from "../index.js";
import _ from 'lodash';

const ANNOUNCEMENT_QUERY = () => {
  return `
  SELECT 
    announcement_id, 
    title, 
    descr, 
    createdAt, 
    closedAt, 
    Announcement.type_id, Type.name as type_name, 
    Announcement.status_id, Status.name as status_name, 
    Announcement.user_id, User.first_name as user_first_name, 
    User.last_name as user_last_name, Announcement.city_id, 
    City.name as city_name, Announcement.pet_id, 
    PetType.name as pet_type_name  
  FROM Announcement 
    INNER JOIN User ON User.user_id=Announcement.user_id
      INNER JOIN Type ON Type.type_id=Announcement.type_id
      INNER JOIN Status ON Status.status_id=Announcement.status_id
      INNER JOIN City ON City.city_id=Announcement.city_id
      INNER JOIN PetType ON PetType.pet_id=Announcement.pet_id`;
}
const ANNOUNCEMENT_QUERY_WITH_FAVORITES = (userId, joinType = "LEFT") => {
  return `
  WITH favorites_filtred as (
    SELECT announcement_id
      FROM favorites
      WHERE user_id = ${userId})
  SELECT 
    Announcement.announcement_id, 
    title, 
    descr, 
    createdAt, 
    closedAt, 
    Announcement.type_id, Type.name as type_name, 
    Announcement.status_id, Status.name as status_name, 
    Announcement.user_id, User.first_name as user_first_name, 
    User.last_name as user_last_name, Announcement.city_id, 
    City.name as city_name, Announcement.pet_id, 
    PetType.name as pet_type_name,
    if(favorites_filtred.announcement_id is Null, False, True) as is_favorite
  FROM Announcement 
    INNER JOIN User ON User.user_id=Announcement.user_id
      INNER JOIN Type ON Type.type_id=Announcement.type_id
      INNER JOIN Status ON Status.status_id=Announcement.status_id
      INNER JOIN City ON City.city_id=Announcement.city_id
      INNER JOIN PetType ON PetType.pet_id=Announcement.pet_id
      ${joinType} JOIN favorites_filtred ON favorites_filtred.announcement_id=Announcement.announcement_id
  `
}

export const getAllAnnouncements = async(req, res, next) => {
  const tokenUserId = req?.user?.user_id;
 
  const typeId = req.query?.type_id;
  const statusId = req.query?.status_id;
  const cityId = req.query?.city_id;
  const petId = req.query?.pet_id;

  try {
    let query = "";
    if (tokenUserId) {
      query = ANNOUNCEMENT_QUERY_WITH_FAVORITES(tokenUserId);
    } else {
      query = ANNOUNCEMENT_QUERY();
    }
    
    if (typeId || statusId || cityId || petId) {
      query = `${query} WHERE`
    }
    if (typeId) {
      query = `${query} Announcement.type_id=${typeId} AND`
    }
    if (statusId) {
      query = `${query} Announcement.status_id=${statusId} AND`
    }
    if (cityId) {
      query = `${query} Announcement.city_id=${cityId} AND`
    }
    if (petId) {
      query = `${query} Announcement.pet_id=${petId} AND`
    }

    if (query.substr(query.length - 3) === "AND") {
      query = `${query.slice(0, -3)}`;
    }
    const announcements = await db.query(`${query} ORDER BY createdAt DESC`);


    res
      .status(200)
      .json(announcements)

  } catch (e) {
    console.log('*getAllAnnouncements service')
    next(e)
  }
}
export const getAnnouncementById = async(req, res, next) => {
  const tokenUserId = req?.user?.user_id;
  const announcementId = req.query?.announcement_id;

  if (!announcementId) {
    return res.status(400).json({ message: "Announcement id must be provided" })
  }

  try {
    let query = "";
    if (tokenUserId) {
      query = ANNOUNCEMENT_QUERY_WITH_FAVORITES(tokenUserId);
    } else {
      query = ANNOUNCEMENT_QUERY();
    }

    const announcement = _.first(await db.query(`${query} WHERE Announcement.announcement_id=${announcementId}`));
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res
      .status(200)
      .json(announcement)

  } catch (e) {
    console.log('*getAnnouncementById service')
    next(e)
  }
}
export const createAnnouncement = async(req, res, next) => {
  try {


    res
      .status(200)
      .json()

  } catch (e) {
    console.log('*createAnnouncement service')
    next(e)
  }
}
export const updateAnnouncement = async(req, res, next) => {
  try {


    res
      .status(200)
      .json()

  } catch (e) {
    console.log('*updateAnnouncement service')
    next(e)
  }
}
export const deleteAnnouncement = async(req, res, next) => {
  try {

    res
      .status(200)
      .json()

  } catch (e) {
    console.log('*deleteAnnouncement service')
    next(e)
  }
}

export const getAnnouncementsByUser = async(req, res, next) => {
  const userId = req.query?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  try {
    const query = `${ANNOUNCEMENT_QUERY_WITH_FAVORITES(userId)} WHERE Announcement.user_id=${userId} ORDER BY createdAt DESC`;
    const announcements = await db.query(query);

    res
      .status(200)
      .json(announcements)

  } catch (e) {
    console.log('*deleteAnnouncement service')
    next(e)
  }
}

export const addAnnouncementToFavorites = async(req, res, next) => {
  const tokenUserId = req.user.user_id;
  const userId = req.body?.user_id;
  const announcementId = req.body?.announcement_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (tokenUserId != userId) {
    return res.status(400).json({ message: "You don't have permissions to do this" })
  }
  try {
    const user = _.first(await db.query(`SELECT * FROM User WHERE user_id=${userId}`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const announcement = _.first(await db.query(`SELECT * FROM Announcement WHERE announcement_id=${announcementId}`));
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }
    const favorite = _.first(await db.query(`SELECT * FROM Favorites WHERE user_id=${userId} AND announcement_id=${announcementId}`));
    if (favorite) {
      return res.status(400).json({ message: 'Announcement is already in favorites' })
    }


    await db.query(`INSERT INTO Favorites(user_id, announcement_id) VALUES(${userId}, ${announcementId})`);
    res
      .status(200)
      .json("Announcements has been added to favorites successfully!")

  } catch (e) {
    console.log('*addAnnouncementToFavorites service')
    next(e)
  }
}

export const deleteAnnouncementFromFavorites = async(req, res, next) => {
  const tokenUserId = req.user.user_id;
  const userId = req.body?.user_id;
  const announcementId = req.body?.announcement_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (tokenUserId != userId) {
    return res.status(400).json({ message: "You don't have permissions to do this" })
  }
  try {
    const user = _.first(await db.query(`SELECT * FROM User WHERE user_id=${userId}`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const announcement = _.first(await db.query(`SELECT * FROM Announcement WHERE announcement_id=${announcementId}`));
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    await db.query(`DELETE FROM Favorites WHERE user_id=${userId} AND announcement_id=${announcementId}`);
    res
      .status(200)
      .json("Announcements has been deleted to favorites successfully!")

  } catch (e) {
    console.log('*deleteAnnouncementFromFavorites service')
    next(e)
  }
}

export const getFavoriteAnnouncements = async(req, res, next) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }

  try {
    const query = `${ANNOUNCEMENT_QUERY_WITH_FAVORITES(userId, "INNER")} ORDER BY createdAt DESC`;
    const announcements = await db.query(query);

    res
      .status(200)
      .json(announcements)
    res
      .status(200)
      .json()

  } catch (e) {
    console.log('*deleteAnnouncement service')
    next(e)
  }
}