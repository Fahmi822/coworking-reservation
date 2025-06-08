import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers/resolvers.js';
import dotenv from 'dotenv';

dotenv.config();

const typeDefs = readFileSync('./src/schema/schema.graphql', { encoding: 'utf-8' });

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: parseInt(process.env.PORT) || 4000 }  // Utilise le port 3001
});

console.log(`🚀 Serveur prêt à ${url}`);