import { Socket } from "socket.io-client";
import { IGameRoom } from "./gameInterfaces";

class GameService {

    public async joinGameRoom(socket: Socket, roomCode: string, playerName: string): Promise<boolean>{
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                socket.emit("join_room", { roomCode:roomCode, playerInfo:{playerName: playerName, role:2} });
                socket.on("room_joined", ()=>resolve(true));
                socket.on("room_join_error", ({err})=> reject(err));
            }, 5*1000);
            
        });
    }


    public async CreateGameRoom(socket:Socket, playerName: string): Promise<any>{
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                socket.emit("create_game", { playerInfo:{playerName: playerName, role:1} });
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