import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO, SocketRequest } from "socket-controllers";
import { Server, Socket } from "socket.io";
import { RoomHelper } from "../helpers/roomHelper";

const gameConfig = require("../../gameConfig.json");

@SocketController()
export class RoomController {
    
    roomList = {};
    
    roomHelper = new RoomHelper();

    @OnMessage("create_game")
    public async CreateGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any){
        try{
            // Leave all rooms before creating a new one
            await this.roomHelper.leaveAllRooms(io, socket);
            console.log("left socket room");
            this.roomList = await this.roomHelper.leaveAllRoomsArray(io, socket, this.roomList, message.ipAddr);
            console.log("left room list");
            
            console.log("creating room...");

            // Generate an unique room code
            let newRoomCode = this.roomHelper.generateRoomCode(gameConfig.GAME_CODE_LENGTH);
            while (newRoomCode in this.roomList)
                newRoomCode = this.roomHelper.generateRoomCode(gameConfig.GAME_CODE_LENGTH);
            console.log("got new room code: ", newRoomCode);

            console.log("joining new room...");

            // Actual join room
            socket.join(newRoomCode);
            console.log("joined room... sent back info");

            // Update roomList with new room code and playerList
            let playerList = [];
            playerList.push({
                [message.ipAddr]: message.playerInfo,
            });
            //let internalRoomNo = this.roomHelper.getInRoomInternalId(io, socket);

            this.roomList[newRoomCode] = {
                "roomCode": newRoomCode,
                "internalRoomNo": newRoomCode,
                "gameSettings": this.roomHelper.defaultGameSettings(),
                "playerList": playerList,
                "gameData": this.roomHelper.defaultGameData()
            }

            // Send back to client
            socket.emit("game_created", this.roomList[newRoomCode]);

            // broadcast to all clients in room as well
            io.in(newRoomCode).emit("on_game_room_update", this.roomList[newRoomCode]);
            
            console.log("# of rooms: ", Object.keys(this.roomList).length);
            console.log(this.roomHelper.printRoomPlayerDetail(this.roomList));
        }catch(e){
            socket.emit("game_create_error", e.message);
        }
        
    }

    @OnMessage("join_room")
    public async joinGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try{
            // Leave all rooms before creating a new one
            await this.roomHelper.leaveAllRooms(io, socket)
            this.roomList = await this.roomHelper.leaveAllRoomsArray(io, socket, this.roomList, message.ipAddr);

            const connectedSockets = io.sockets.adapter.rooms.get(message.roomCode);

            console.log(connectedSockets.size);
            console.log(this.roomList[message.roomCode]);

            if (connectedSockets && connectedSockets.size === gameConfig.GAME_MAX_PLAYER){
                socket.emit("room_join_error", {
                    error: "Room is full please choose another room to play!"
                });
            }else{
                // Join room (socket)
                await socket.join(message.roomCode);

                // Update roomList with new playerList
                this.roomList[message.roomCode]["playerList"].push({
                    [message.ipAddr]:message.playerInfo
                });


                console.log("joined room!!!!");
                // Send info back to all room connected sockets
                /*
                io.in(message.roomCode).emit("on_game_room_update", {
                    roomCode: message.roomCode,
                    internalRoomNo: message.roomCode,
                    gameSettings: this.roomList[message.roomCode]["gameSettings"],
                    playerList: this.roomList[message.roomCode]["playerList"]
                });
                */
                io.in(message.roomCode).emit("on_game_room_update", this.roomList[message.roomCode]);
                
            }

            console.log(this.roomHelper.printRoomPlayerDetail(this.roomList));
        }catch(e){
            socket.emit("join_room_error", {
                error: e.message   
            });
        }
    }

    @OnMessage("leave_room")
    public async leaveGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try{
            await this.roomHelper.leaveAllRooms(io, socket);
            console.log("left socket room");
            this.roomList = await this.roomHelper.leaveAllRoomsArray(io, socket, this.roomList, message.ipAddr);
            console.log("left room list");

        }catch(e){
            console.log("errored?");
            socket.emit("leave_room_error", {error:e.message});
        }
    }

    @OnMessage("update_room")
    public async UpdateGameRoomSettings(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any){
        try{
            this.roomList[message.roomCode]["gameSettings"] = message.gameSettings;
            console.log(message.roomCode + " game room updated. diff:" + this.roomList[message.roomCode].gameSettings.difficulty + ", wordLength:" + this.roomList[message.roomCode].gameSettings.wordLength);
            io.in(message.roomCode).emit("on_game_room_update", this.roomList[message.roomCode]);
        }catch(e){
            console.log("errored?");
            socket.emit("update_room_error", {error:e.message});
        }

        
    }
}