import { socketServer } from "../socket-server.js";
import { Server } from "socket.io";
import { ALLOWED_ORIGIN } from "../config/index.js";
import { db } from "../index.js";
import { GET_MESSAGES_BY_ROOM, GET_COMPANION } from "./socker-queries.js";
import { ANNOUNCEMENT_QUERY_BY_ROOM } from "../services/chat.service.js";
import moment from 'moment';
import _ from 'lodash';
import { addImages } from "../services/announcement.service.js";

export const io = new Server(socketServer, { cors: { origin: ALLOWED_ORIGIN } })

export default function startSocketActions() {
  io.on('connection', (socket) => {
    console.log('user connected');
  
    socket.on('join-room', async({user_id, room_id}) => {

      socket.join(room_id);

      const messages = await db.query(GET_MESSAGES_BY_ROOM(room_id))
      const companion = _.first(await db.query(GET_COMPANION(room_id, user_id)))
      const announcement = _.first(await db.query(ANNOUNCEMENT_QUERY_BY_ROOM(room_id)))
      await addImages([announcement])
      io.to(socket.id).emit('join-room', {
        companion,
        announcement,
        messages
      })
    })

    socket.on('message', async({message, user_id, room_id}) => {
      const user = await db.query(`SELECT * FROM User WHERE user_id=${user_id}`)
      if (user) {
        await db.query(`INSERT INTO Message(time, body, user_id, room_id) VALUES(
          "${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}",
          "${message}",
          ${user_id},
          ${room_id}
        )`)

        const messages = await db.query(GET_MESSAGES_BY_ROOM(room_id))
    
        io.to(room_id).emit('message', messages)
      }
    })
  
    io.emit('connected', socket.id)
  })
}