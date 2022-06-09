import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";
import { RoomHelper } from "../helpers/roomHelper";

@SocketController()
export class RoomController {
    roomCodeLength = 4;
    roomList = {};
    
    roomHelper = new RoomHelper();

    @OnMessage("create_game")
    public async CreateGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any){
        try{
            
            // Leave all rooms before creating a new one
            await this.roomHelper.leaveAllRooms(io, socket);
            console.log("left socket room");
            this.roomList = await this.roomHelper.leaveAllRoomsArray(io, socket, this.roomList, message.ipAddr);
            console.log("creating room...");

            // Generate an unique room code
            let newRoomCode = this.roomHelper.generateRoomCode(this.roomCodeLength);
            while (newRoomCode in this.roomList)
                newRoomCode = this.roomHelper.generateRoomCode(this.roomCodeLength);
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
            let internalRoomNo = this.roomHelper.getInRoomInternalId(io, socket);

            this.roomList[newRoomCode] = {
                "internalRoomNo": newRoomCode,
                "playerList": playerList
            }

            // Send back to client
            socket.emit("game_created", {roomCode:newRoomCode, internalRoomNo:newRoomCode,  playerList:playerList});

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


            console.log(connectedSockets);
            console.log(connectedSockets.size);
            console.log(this.roomList[message.roomCode]);

            if (connectedSockets && connectedSockets.size === 20){
                socket.emit("join_room_error", {
                    error: "Room is full please choose another room to play!"
                });
            }else{
                // Join room (socket)
                await socket.join(message.roomCode);

                // Update roomList with new playerList
                this.roomList[message.roomCode]["playerList"].push({
                    [message.ipAddr]:message.playerInfo
                });
    
                // Send info back
                socket.emit("room_joined", {
                    roomCode: message.roomCode,
                    internalRoomNo: message.roomCode,
                    playerList: this.roomList[message.roomCode]["playerList"]
                });
                
            }

            console.log(this.roomHelper.printRoomPlayerDetail(this.roomList));
        }catch(e){
            socket.emit("join_room_error", {
                error: e.message   
            });
        }

        
    }
}