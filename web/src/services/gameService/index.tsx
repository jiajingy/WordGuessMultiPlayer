import { Socket } from "socket.io-client";
import { IGameRoom } from "./gameInterfaces";

class GameService {

    private _timeoutLimit = 5000;


    public async CreateGameRoom(socket:Socket, playerName: string, ipAddr: string): Promise<any>{
        return await this.timeout(this._createGameRoom(socket, playerName, ipAddr), this._timeoutLimit);
    }

    public async JoinGameRoom(socket:Socket, roomCode:string, playerName: string, ipAddr: string): Promise<any>{
        return await this.timeout(this._joinGameRoom(socket,roomCode, playerName, ipAddr), this._timeoutLimit);
    }

    private async _createGameRoom(socket:Socket, playerName: string, ipAddr: string): Promise<any>{
        return new Promise((resolve, reject) => {
            
            socket.emit("create_game", { playerInfo:{playerName: playerName, role:1, lastUpdateDT:new Date()}, ipAddr: ipAddr });
            socket.on("game_created", (res)=>resolve(res));
            socket.on("game_create_error", ({err})=> reject(err));
             
        });
    }

    private async _joinGameRoom(socket: Socket, roomCode: string, playerName: string, ipAddr: string): Promise<any>{
        return new Promise((resolve, reject) => {
            socket.emit("join_room", { roomCode:roomCode.toUpperCase(), playerInfo:{playerName: playerName, role:2, lastUpdateDT:new Date()}, ipAddr: ipAddr });
            //socket.on("room_joined", (res)=>resolve(res));
            socket.on("on_game_room_update", (res)=>resolve(res));
            socket.on("room_join_error", ({err})=> reject(err));
        });
    }

    
    

    public async onGameRoomUpdate(
        socket:Socket, 
        listener: (gameRoom: IGameRoom) => void
    ){
        
        socket.on("on_game_room_update",(gameRoom) => {
            console.log("sarevice");
            listener(gameRoom);
            console.log(gameRoom);
            console.log(listener);
        });
        
    }

    public async onGameRoomUpdate2(
        socket: Socket,
    ):Promise<any>{
        return new Promise((resolve, reject)=>{
            socket.on("on_game_room_update",({res}) => resolve(res))
            console.log("sarevice");
        });
        
    }


    private timeout = (prom:any, time:number) => Promise.race([prom, new Promise((_r, rej)=> setTimeout(rej, time))]);
}

export default new GameService()