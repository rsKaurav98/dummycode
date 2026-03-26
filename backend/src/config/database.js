import { MongoClient } from "mongodb";
import { env } from "./env.js";

let clientPromise;
let indexPromise;

async function getClient() {
  if (!env.mongoUri) {
    throw new Error("Missing MONGODB_URI in backend/.env");
  }

  if (!clientPromise) {
    clientPromise = MongoClient.connect(env.mongoUri);
  }

  return clientPromise;
}

export async function getUsersCollection() {
  const client = await getClient();
  const collection = client
    .db(env.databaseName)
    .collection(env.usersCollectionName);

  if (!indexPromise) {
    indexPromise = collection.createIndex({ email: 1 }, { unique: true });
  }

  await indexPromise;
  return collection;
}
