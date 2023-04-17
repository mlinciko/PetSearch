import { db } from "../index.js";
import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import fs from 'fs';

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

  const search = req.query?.search;

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
    let announcements = await db.query(`${query} ORDER BY createdAt DESC`);
    await addImages(announcements);

    if (search) {
      announcements = announcements.filter(
        (ann) => {
          return ann.title.includes(search) 
          || ann.descr.includes(search) 
          || ann.city_name.includes(search)
        }
      )
    }

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
    await addImages([announcement]);

    res
      .status(200)
      .json(announcement)

  } catch (e) {
    console.log('*getAnnouncementById service')
    next(e)
  }
}
export const createAnnouncement = async(req, res, next) => {
  const userId = req?.user?.user_id;
  const title = req.body?.title;
  const descr = req.body?.descr;
  const typeId = req.body?.type_id;
  const cityId = req.body?.city_id;
  const petId = req.body?.pet_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (!title) {
    return res.status(400).json({ message: "Title must be provided" })
  }
  if (!descr) {
    return res.status(400).json({ message: "Describtion must be provided" })
  }
  if (!typeId) {
    return res.status(400).json({ message: "Type id must be provided" })
  }
  if (!cityId) {
    return res.status(400).json({ message: "City id must be provided" })
  }
  if (!petId) {
    return res.status(400).json({ message: "Pet id must be provided" })
  }
  try {
    const user = _.first(await db.query(`SELECT * FROM User WHERE user_id=${userId}`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const type = _.first(await db.query(`SELECT * FROM Type WHERE type_id=${typeId}`));
    if (!type) {
      return res.status(404).json({ message: 'Type not found' })
    }
    const city = _.first(await db.query(`SELECT * FROM City WHERE city_id=${cityId}`));
    if (!city) {
      return res.status(404).json({ message: 'City not found' })
    }
    const pet = _.first(await db.query(`SELECT * FROM PetType WHERE pet_id=${petId}`));
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' })
    }

    const query = ANNOUNCEMENT_QUERY_WITH_FAVORITES(userId);
    const response = await db.query(`INSERT INTO Announcement(title, descr, createdAt, closedAt, status_id, user_id, type_id, city_id, pet_id) 
    VALUES("${title}", "${descr}", "${moment(new Date()).format("YYYY-MM-DD")}", NULL, 1, ${userId}, ${typeId}, ${cityId}, ${petId})`);
    const newAnnouncement = _.first(await db.query(`${query} WHERE Announcement.announcement_id=${response.insertId}`));
    await addImages([newAnnouncement]);

    res
      .status(200)
      .json(newAnnouncement)

  } catch (e) {
    console.log('*createAnnouncement service')
    next(e)
  }
}
export const updateAnnouncement = async(req, res, next) => {
  const userId = req?.user?.user_id;
  const announcementId = req.body?.announcement_id;
  const title = req.body?.title;
  const descr = req.body?.descr;
  const typeId = req.body?.type_id;
  const cityId = req.body?.city_id;
  const petId = req.body?.pet_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (!announcementId) {
    return res.status(400).json({ message: "Announcement id must be provided" })
  }
  try {
    const user = _.first(await db.query(`SELECT * FROM User WHERE user_id=${userId}`));
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (typeId) {
      const type = _.first(await db.query(`SELECT * FROM Type WHERE type_id=${typeId}`));
      if (!type) {
        return res.status(404).json({ message: 'Type not found' })
      }
    }
    
    if (cityId) {
      const city = _.first(await db.query(`SELECT * FROM City WHERE city_id=${cityId}`));
      if (!city) {
        return res.status(404).json({ message: 'City not found' })
      }
    }
    
    if (petId) {
      const pet = _.first(await db.query(`SELECT * FROM PetType WHERE pet_id=${petId}`));
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' })
      }
    }

    const announcement = _.first(await db.query(`SELECT * FROM Announcement WHERE announcement_id=${announcementId}`));
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }
    if (announcement.status_id === 2) {
      return res.status(400).json({ message: "You can't update the announcement when it is closed" })
    }


    await db.query(`UPDATE Announcement SET 
      title="${title ? title : announcement.title}",
      descr="${descr ? descr : announcement.descr}",
      type_id=${typeId ? typeId: announcement.type_id},
      city_id=${cityId ? cityId: announcement.city_id},
      pet_id=${petId ? petId: announcement.pet_id}
      WHERE announcement_id=${announcementId}
    `)


    const query = ANNOUNCEMENT_QUERY_WITH_FAVORITES(userId);
    const updatedAnn =  _.first(await db.query(`${query} WHERE Announcement.announcement_id=${announcement.announcement_id}`));
    await addImages([updatedAnn]);

    res
      .status(200)
      .json(updatedAnn)

  } catch (e) {
    console.log('*updateAnnouncement service')
    next(e)
  }
}

export const closeAnnouncement = async(req, res, next) => {
  const userId = req?.user?.user_id;
  const announcementId = req?.query?.announcement_id;

  if (!userId) {
    return res.status(400).json({ message: "User id must be provided" })
  }
  if (!announcementId) {
    return res.status(400).json({ message: "Announcement id must be provided" })
  }
  try {
    const announcement = _.first(await db.query(`SELECT * FROM Announcement WHERE announcement_id=${announcementId}`));
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }
    if (announcement.status_id === 2) {
      return res.status(400).json({ message: "You can't close the announcement when it is closed" })
    }
    
    let closedAt = moment(new Date()).format("YYYY-MM-DD");
    await db.query(`UPDATE Announcement SET 
      status_id=2,
      closedAt="${closedAt}"
      WHERE announcement_id=${announcementId}`)

    res
      .status(200)
      .json("Announcement has been successfully closed!")

  } catch (e) {
    console.log('*closeAnnouncement service')
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
    await addImages(announcements);

    res
      .status(200)
      .json(announcements)

  } catch (e) {
    console.log('*getAnnouncementsByUser service')
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
    await addImages(announcements);

    res
      .status(200)
      .json(announcements)

  } catch (e) {
    console.log('*getFavoriteAnnouncements service')
    next(e)
  }
}

export const uploadImage = async(req, res, next) => {
  const announcementId = req.body?.announcement_id;
  const files = req.files;

  if (!files) {
    return res.status(400).json({ message: "File must be provided" })
  }
  try {
    const announcement = _.first(await db.query(`SELECT * FROM Announcement WHERE announcement_id=${announcementId}`));
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    const __dirname = path.resolve();

    const images = await db.query(`SELECT path FROM AnnouncementImages WHERE announcement_id=${announcementId}`)
    const imageNames = images.map((item) => item.path)
    if (imageNames.length) {
      imageNames.forEach(
        (name) => {
          const filepath = `${__dirname}/media/announcements/${name}`
          fs.unlinkSync(filepath);
        }
      )
    }
    await db.query(`DELETE FROM AnnouncementImages WHERE announcement_id=${announcementId}`)

    Object.keys(files).forEach(async key => {
      const filepath = path.join(__dirname, 'media/announcements', `${new Date().getTime()}_${files[key].name}`)
      files[key].mv(filepath, (err) => {
        if (err) {
          return res
                  .status(500)
                  .json("Internal server error")
        }
      })

      await db.query(`INSERT INTO AnnouncementImages(announcement_id, path) VALUES(${announcementId}, "${_.last(filepath.split("/"))}")`);
    })
    res
      .status(200)
      .json("Images have been uploaded successfully!")

  } catch (e) {
    console.log('*uploadeImage service')
    next(e)
  }
}

async function addImages(announcements) {
  for (const announcement of announcements) {
    const images = await db.query(`SELECT path FROM AnnouncementImages 
      WHERE announcement_id=${announcement.announcement_id}`);
    announcement.images = images.map((image) => image.path);
  }
}