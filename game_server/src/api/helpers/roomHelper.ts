import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";
export class RoomHelper {
    

    public generateRoomCode(codeLength: number){
        let base = "ABCEDFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let result = "";
        for(let i=0;i<codeLength;i++)
            result += base[Math.floor(Math.random() * (base.length))];
        
        return result;
    }

    public async leaveAllRooms(@SocketIO() io: Server, @ConnectedSocket() socket: Socket){
    
        const socketRooms = Array.from(socket.rooms.values()).filter((r)=> r!== socket.id);

        console.log("current rooms=>");
        console.log(socketRooms);

        // Before join a new game room, make sure user leaves previous joined room if any
        for(let room in socketRooms){
            console.log("levavubg room: ", room);
            //await socket.leave(room);
        }

    }

    public async leaveAllRoomsArray(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, roomList:{}, ipAddr: string){
        for (const roomCode in roomList){
            if (ipAddr in roomList[roomCode]["playerList"])
                delete roomList[roomCode]["playerList"][ipAddr];
        }

        return roomList;
    }

    public async getInRoomInternalId(@SocketIO() io: Server, @ConnectedSocket() socket: Socket){
        const socketRooms = Array.from(socket.rooms.values()).filter((r)=> r!== socket.id);

        if(socketRooms.length>0)
            return socketRooms[0];

        return -1;
    }
}