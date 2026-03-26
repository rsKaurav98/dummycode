export const env = {
  port: Number(process.env.PORT || 3001),
  mongoUri: process.env.MONGODB_URI,
  databaseName: process.env.MONGODB_DB_NAME || "dummycode",
  usersCollectionName: process.env.MONGODB_USERS_COLLECTION || "users"
};
