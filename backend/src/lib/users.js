import crypto from "node:crypto";
import { MongoClient } from "mongodb";

const DEFAULT_DB_NAME = "dummycode";
const DEFAULT_COLLECTION_NAME = "users";
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

let clientPromise;

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in backend/.env");
  }

  return mongoUri;
}

function getUsersCollection() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(getMongoUri());
  }

  return clientPromise.then((client) => {
    const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
    const collectionName =
      process.env.MONGODB_USERS_COLLECTION || DEFAULT_COLLECTION_NAME;

    const collection = client.db(dbName).collection(collectionName);
    collection.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    return collection;
  });
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function hashPassword(password, salt = crypto.randomBytes(SALT_LENGTH).toString("hex")) {
  const hash = crypto
    .scryptSync(password, salt, KEY_LENGTH, {
      N: SCRYPT_COST,
      r: SCRYPT_BLOCK_SIZE,
      p: SCRYPT_PARALLELIZATION
    })
    .toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const incomingHash = crypto
    .scryptSync(password, salt, KEY_LENGTH, {
      N: SCRYPT_COST,
      r: SCRYPT_BLOCK_SIZE,
      p: SCRYPT_PARALLELIZATION
    })
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(storedHash, "hex"),
    Buffer.from(incomingHash, "hex")
  );
}

export async function createUser({ email, password }) {
  const users = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await users.findOne({ email: normalizedEmail });

  if (existingUser) {
    return { created: false };
  }

  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();

  await users.insertOne({
    email: normalizedEmail,
    passwordHash,
    createdAt: now
  });

  return { created: true, email: normalizedEmail };
}

export async function authenticateUser({ email, password }) {
  const users = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const user = await users.findOne({ email: normalizedEmail });

  if (!user) {
    return { authenticated: false };
  }

  const authenticated = verifyPassword(password, user.passwordHash);

  if (!authenticated) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    email: normalizedEmail
  };
}
