// lib/mongodb.ts
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Extend global type
interface MongooseGlobal {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

declare global {
  // Merge the interface with NodeJS.Global
  namespace NodeJS {
    interface Global extends MongooseGlobal {}
  }

  var mongoose: MongooseGlobal["mongoose"] // add this line to prevent type error
}

const cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}
