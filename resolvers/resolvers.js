import { collections } from "../models/db.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const resolvers = {
  Query: {
    getAvailableSpaces: async (_, { start, end }) => {
      const conflictingBookings = await collections.bookings.find({
        status: "confirmed",
        $or: [
          { start: { $lte: end }, end: { $gte: start } },
          { start: { $lte: start }, end: { $gte: end } }
        ]
      }).toArray();

      return collections.spaces.find({
        _id: { $nin: conflictingBookings.map(b => b.spaceId) }
      }).toArray();
    },

    login: async (_, { email, password }) => {
      const user = await collections.users.findOne({ email });
      if (!user || user.password !== password) {
        throw new Error("Identifiants invalides");
      }
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
      return { token, user };
    }
  },

  Mutation: {
    createBooking: async (_, { spaceId, start, end }, { user }) => {
      if (!user) throw new Error("Non autorisé");

      const booking = {
        userId: user._id,
        spaceId,
        start,
        end,
        status: "confirmed",
        createdAt: new Date()
      };
      const result = await collections.bookings.insertOne(booking);
      return { ...booking, _id: result.insertedId };
    },

    registerUser: async (_, { name, email, password }) => {
      const existingUser = await collections.users.findOne({ email });
      if (existingUser) throw new Error("Email déjà utilisé");

      const user = { name, email, password, role: "user" };
      const result = await collections.users.insertOne(user);
      const token = jwt.sign({ userId: result.insertedId, role: "user" }, JWT_SECRET);

      return { token, user: { ...user, _id: result.insertedId } };
    }
  },

  Booking: {
    user: async (parent) => await collections.users.findOne({ _id: parent.userId }),
    space: async (parent) => await collections.spaces.findOne({ _id: parent.spaceId })
  }
};