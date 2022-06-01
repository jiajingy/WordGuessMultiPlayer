import { Socket } from "socket.io-client";
import { IGameRoom } from "./gameInterfaces";

class GameService {

    public async joinGameRoom(socket: Socket, roomCode: string, playerName: string, ipAddr: string): Promise<any>{
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                socket.emit("join_room", { roomCode:roomCode.toUpperCase(), playerInfo:{playerName: playerName, role:2}, idAddr: ipAddr });
                socket.on("room_joined", (res)=>resolve(res));
                socket.on("room_join_error", ({err})=> reject(err));
            }, 5*1000);
            
        });
    }


    public async CreateGameRoom(socket:Socket, playerName: string, ipAddr: string): Promise<any>{
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                socket.emit("create_game", { playerInfo:{playerName: playerName, role:1}, ipAddr: ipAddr });
                socket.on("game_created", (res)=>resolve(res));
                socket.on("game_create_error", ({err})=> reject(err));
            }, 5*1000);  
        });
    }

    public async onGameRoomUpdate(
        socket:Socket, 
        listener: (gameRoom: IGameRoom) => void
    ){
        socket.on("on_game_room_update",({gameRoom}) => listener(gameRoom))
    }
}

export default new GameService()