import { db } from "../index.js";
import _ from 'lodash';
import { addImages } from "./announcement.service.js";

export const ANNOUNCEMENT_QUERY_BY_ROOM = (roomId) => {
  return `
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
    PetType.name as pet_type_name  
  FROM Announcement 
    INNER JOIN User ON User.user_id=Announcement.user_id
      INNER JOIN Type ON Type.type_id=Announcement.type_id
      INNER JOIN Status ON Status.status_id=Announcement.status_id
      INNER JOIN City ON City.city_id=Announcement.city_id
      INNER JOIN PetType ON PetType.pet_id=Announcement.pet_id
      INNER JOIN Room On Room.announcement_id=Announcement.announcement_id
      WHERE Room.room_id=${roomId}
      ORDER BY createdAt`
}

export const getUserChats = async(req, res, next) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'User id must be provided' })
  }

  try {
    const chats = []
    const roomIds = [...await db.query(`SELECT room_id FROM RoomParticipants WHERE user_id=${userId}`)]

    for (const roomId of roomIds){
      const announcement = _.first(await db.query(ANNOUNCEMENT_QUERY_BY_ROOM(roomId.room_id)))
      await addImages([announcement])
      chats.push(
        {
          room_id: roomId.room_id,
          announcement: announcement,
        },
      )
    }
    res
      .status(200)
      .json(chats)

  } catch (e) {
    console.log('*getUserChats service')
    next(e)
  }
}

export const createChat = async(req, res, next) => {
  const currUserId = req.user.user_id;
  const companionId = req.body.companion_id;
  const announcementId = req.body.announcement_id;

  if (!currUserId) {
    return res.status(400).json({ message: 'User id must be provided' })
  }
  if (!companionId) {
    return res.status(400).json({ message: 'Companion id must be provided' })
  }
  if (!announcementId) {
    return res.status(400).json({ message: 'Announcement id must be provided' })
  }
  try {
    const currUser = _.first(await db.query(`SELECT * FROM User WHERE user_id=${currUserId}`));
    if (!currUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    const companion = _.first(await db.query(`SELECT * FROM User WHERE user_id=${companionId}`));
    if (!companion) {
      return res.status(404).json({ message: 'Companion not found' })
    }
    const announcement = _.first(await db.query(`SELECT * FROM Announcement WHERE announcement_id=${announcementId}`));
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    const responseRoom = await db.query(`INSERT INTO Room(announcement_id) VALUES(${announcementId})`)
    await db.query(`INSERT INTO RoomParticipants(user_id, room_id) 
    VALUES (${currUserId}, ${responseRoom.insertId}), (${companionId}, ${responseRoom.insertId})`)

    res
      .status(200)
      .json({room_id: responseRoom.insertId})

  } catch (e) {
    console.log('*getUserChats service')
    next(e)
  }
}