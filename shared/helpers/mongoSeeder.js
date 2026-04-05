import { MongoClient } from 'mongodb';
import { config } from '../config/env';

let client;

// Call this in beforeAll — connects once and returns the db handle
export const connectDb = async () => {
  client = new MongoClient(config.mongo.uri);
  await client.connect();
  return client.db(config.mongo.dbName);
};

// Call this in afterAll — closes the connection cleanly
// Without this, Jest hangs after tests finish because the connection is still open
export const disconnectDb = async () => {
  if (client) await client.close();
};

// Seed a collection with documents, returns inserted ids
export const seedCollection = async (db, collectionName, documents) => {
  const collection = db.collection(collectionName);
  const result = await collection.insertMany(documents);
  return result.insertedIds;
};

// Remove only the documents you inserted — safer than dropping the whole collection
export const cleanCollection = async (db, collectionName, filter) => {
  await db.collection(collectionName).deleteMany(filter);
};
