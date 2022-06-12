import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";
import { convertTypeAcquisitionFromJson, createImportSpecifier, formatDiagnosticsWithColorAndContext } from "typescript";
export class RoomHelper {
    
    public defaultGameSettings(){
        return {
            "difficulty":"2",
            "wordLength":"5"
        }
    }

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
        for(let idx in socketRooms){
            console.log("leaving room: ", socketRooms[idx]);
            await socket.leave(socketRooms[idx]);
            //io.to(socketRooms[idx])
        }
    }

    public async leaveAllRoomsArray(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, roomList:{}, ipAddr: string){
        for (const roomCode in roomList){
            for (const idx in roomList[roomCode]["playerList"]){
                const ip = Object.keys(roomList[roomCode]["playerList"][idx])[0];
                console.log(ip + "|!!!|" + ipAddr);
                if (ip == ipAddr){
                    console.log("im in this")
                    this.printRoomPlayerDetail(roomList);
                    roomList[roomCode]["playerList"].splice(idx, 1);
                    // After leave room, check if that room is empty
                    // If so, remove room
                    if (!this.isGameRoomHasPlayer(roomList, roomCode)){
                        delete roomList[roomCode];
                    }
                    // If still has player(s) in room
                    // Automatically promote first position player to game master
                    else if(!this.isGameMasterInRoom(roomList, roomCode)){   
                        this.printRoomPlayerDetail(roomList);
                        const ip = Object.keys(roomList[roomCode]["playerList"][0])[0];
                        roomList[roomCode]["playerList"][idx][ip]["role"]=1;
                        // Once left, needs to send game room update broadcast to the room.
                        io.in(roomCode).emit("on_game_room_update", roomList[roomCode]);
                    }
                    // If game master still in room
                    // Then just broadcast on_game_room_update
                    else{
                        io.in(roomCode).emit("on_game_room_update", roomList[roomCode]);
                    }
                    
                }
                    
            }
        }
        return roomList;
    }


    // This returns roomCode not internal ID.
    public async getInRoomInternalId(@SocketIO() io: Server, @ConnectedSocket() socket: Socket){
        const socketRooms = Array.from(socket.rooms.values()).filter((r)=> r!== socket.id);
        if(socketRooms.length>0)
            return socketRooms[0];

        return -1;
    }

    public printRoomPlayerDetail(roomList:{}){
        for (const roomCode in roomList){
            console.log("room code: " + roomCode);
            for (const idx in roomList[roomCode]["playerList"]){
                // only one key which is IP
                const ip = Object.keys(roomList[roomCode]["playerList"][idx])[0];
                const playerInfo = roomList[roomCode]["playerList"][idx][ip];
                console.log("ip:" + ip + "|playerName:" + playerInfo["playerName"] + "|role:" + playerInfo["role"] + "|idx:" + idx);
            }

        }
    }

    

    private isGameRoomHasPlayer(roomList:{}, roomCode:string){
        return roomCode in roomList && roomList[roomCode]["playerList"].length > 0;
    }


    private isGameMasterInRoom(roomList:{}, roomCode:string){
        for (const idx in roomList[roomCode]["playerList"]){
            // only one key which is IP
            const ip = Object.keys(roomList[roomCode]["playerList"][idx])[0];
            const playerInfo = roomList[roomCode]["playerList"][idx][ip];
            if (playerInfo["role"]==1)
                return true;
        }

        return false;
    }
}