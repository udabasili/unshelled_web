import { MongoClient } from 'mongodb'
import config from 'config'

let mongoURI

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  mongoURI = config.get('dbConfig.url')
} else {
  mongoURI = process.env.MONGODB_URI
}

const mongoClient = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let connection, db

export const dbName = 'unshelled_assignment'

export async function dbConnect (callback) {
  try {
    connection = await mongoClient.connect()
    db = mongoClient.db(dbName)
    if (!db) {
      callback('No database')
      return
    }
    console.log('MongoDB Running')

    return {
      db,
      connection
    }
  } catch (error) {
    callback(error)
  }
}

export function getDb () {
  return db
}
