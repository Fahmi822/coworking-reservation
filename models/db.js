import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connecté à MongoDB Atlas !");
    return client.db();
  } catch (err) {
    console.error("Erreur de connexion :", err);
    process.exit(1);
  }
}

const db = await connectDB();

export const collections = {
  users: db.collection("users"),
  spaces: db.collection("spaces"),
  bookings: db.collection("bookings")
};