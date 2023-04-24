import http from 'http';
import express from 'express'

const socketApp = express()
export const socketServer = http.Server(socketApp);