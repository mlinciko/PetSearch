export const GET_MESSAGES_BY_ROOM = (roomId) => {
  return `
          SELECT User.user_id, first_name, last_name, time, body FROM Message
          INNER JOIN User ON User.user_id=Message.user_id
            WHERE room_id=${roomId}
            ORDER BY time ASC;`
}

export const GET_COMPANION = (roomId, userId) => {
  return  `
  SELECT first_name, last_name, image FROM RoomParticipants
	INNER JOIN User ON User.user_id=RoomParticipants.user_id
    WHERE room_id=${roomId} AND RoomParticipants.user_id <> ${userId};
  `
}

