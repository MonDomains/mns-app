import dotenv from 'dotenv'; 
dotenv.config({ path: "../.env" });

import { Server } from './core/server'

const server = new Server({ port: parseInt(process.env.PORT || "1231") });

server.start();

