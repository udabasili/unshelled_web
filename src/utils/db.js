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

export async function dbConnect (nextFn) {
  try {
    connection = await mongoClient.connect()
    db = mongoClient.db(dbName)
    if (!db) {
      nextFn('No database')
      return
    }
    console.log('MongoDB Running')

    return {
      db,
      connection
    }
  } catch (error) {
    nextFn(error)
  }
}

export function getDb () {
  return db
}
