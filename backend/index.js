import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import {
  ALLOWED_ORIGIN,
  SENTRY_DSN,
  SERVER_PORT
} from './config/index.js'
import { setSecurityHeaders } from './middlewares/index.js'
import router from './routes/app.routes.js'
import createConncention from './utils/dbconnection.js';

const app = express()

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app })
    ],
    tracesSampleRate: 1.0
  })

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true
  })
)

app.use(setSecurityHeaders)

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())

export const db = createConncention({
  host: "localhost",
  user: "root",
  password: "mlinciko",
  database: "petSearch"
})

app.use('/api', router)

if (process.env.NODE_ENV === 'production') {
  app.use(Sentry.Handlers.errorHandler())
} else {
  app.use((err, req, res) => {
    console.log(`${err.message || JSON.stringify(err, null, 2)}`)
    res.status(500).json({ message: 'Something went wrong. Try again later' })
  })
}

app.listen(SERVER_PORT || 3000, () => {
  console.log(`🚀 Server ready on http://localhost:${SERVER_PORT || 3000}`)
})
