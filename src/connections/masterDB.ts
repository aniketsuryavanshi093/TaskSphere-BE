import mongoose from 'mongoose'
import logger from '../config/logger'
import config from '../config/config'

const db: mongoose.Connection = mongoose.createConnection(`${config.db.uri}`)

db.on('connected', () => {
  logger.info('Mongoose connection open to master DB')
})

// if the connection throws an error
db.on('error', (err) => {
  logger.debug(`mongoose connection error for master DB, ${err}`)
})

// when connection is disconnected
db.on('disconnected', () => {
  logger.debug('Mongoose connection disconnected for master DB')
})

// when connection is reconnected
db.on('reconnected', () => {
  logger.info('mongoose connection reconnected for Master DB')
})

// if node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  db.close(false) // Set to false to avoid force closing the connection immediately
    .then(() => {
      logger.debug(
        'mongoose connection disconnected for master DB through app termination'
      )
      // Perform any post-closing tasks here
      process.exit(0)
    })
    .catch((err) => {
      // Handle any potential errors during the closing process
      logger.error('Error closing the mongoose connection:', err)
      process.exit(1) // Exit with a non-zero status code to indicate an error
    })
})

export default db
