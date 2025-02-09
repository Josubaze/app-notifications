import app from "./app";
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { connectDB } from './db'
import socket  from "./socket";
import { PORT } from './config';
import { monitorProducts } from './monitorProducts';

connectDB();
const server = http.createServer(app);
const httpServer = server.listen(PORT);
console.log('Listening on port', PORT);

const io = new WebSocketServer(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});


monitorProducts(io);
socket(io);