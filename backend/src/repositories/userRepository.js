import { getUsersCollection } from "../config/database.js";

export async function findUserByEmail(email) {
  const usersCollection = await getUsersCollection();
  return usersCollection.findOne({ email });
}

export async function insertUser(user) {
  const usersCollection = await getUsersCollection();
  await usersCollection.insertOne(user);
  return user;
}
