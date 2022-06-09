import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";
import { convertTypeAcquisitionFromJson, createImportSpecifier, formatDiagnosticsWithColorAndContext } from "typescript";
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
        for(let idx in socketRooms){
            console.log("leaving room: ", socketRooms[idx]);
            await socket.leave(socketRooms[idx]);
        }
    }

    public async leaveAllRoomsArray(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, roomList:{}, ipAddr: string){
        for (const roomCode in roomList){
            for (const idx in roomList[roomCode]["playerList"]){
                const ip = Object.keys(roomList[roomCode]["playerList"][idx])[0];
                if (ip == ipAddr){
                    this.printRoomPlayerDetail(roomList);
                    roomList[roomCode]["playerList"].splice(idx, 1);
                    // After leave room, check if that room is empty
                    // If so, remove room
                    if (!this.isGameRoomHasPlayer(roomList, roomCode)){
                        delete roomList[roomCode];
                    }
                    else{
                        // If still has player(s) in room
                        // Automatically promote first position player to game master
                        console.log("ddd");
                        if (!this.isGameMasterInRoom(roomList, roomCode)){
                            this.printRoomPlayerDetail(roomList);
                            console.log("eee");
                            const ip = Object.keys(roomList[roomCode]["playerList"][0])[0];
                            console.log("fff");
                            console.log(ip);
                            roomList[roomCode]["playerList"][idx][ip]["role"]=1;
                            console.log("ggggg");
                        }
                            
                    }
                    
                }
                    
            }
        }
        console.log("sdsdsdsdsd");
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

        console.log("-----------------");
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