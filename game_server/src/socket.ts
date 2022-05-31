import { Server } from "socket.io"
import { useSocketServer, createSocketServer } from "socket-controllers";
import { MainController } from "./api/controllers/mainController";
import { RoomController } from "./api/controllers/roomController";

export default (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*"
        },
    });

    useSocketServer(io, { controllers: [
        MainController,
        RoomController,
    ] });
    
    return io;
};