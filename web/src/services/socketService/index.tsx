import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

class SocketService {

    public socket: Socket | null = null;

    public connect(url: string): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
        return new Promise((resolve, reject)=> {
            this.socket = io(url);

            if(!this.socket)
                return reject();

            this.socket.on("connect", ()=>{
                resolve(this.socket as Socket);
            });

            this.socket.on("connect_error", (err)=>{
                console.log("Connection error: ", err);
                reject(err);
            });
        });
    }

    public createGame(): Promise<Socket<DefaultEventsMap, DefaultEventsMap>>{
        return new Promise((resolve, reject) => {
            this.socket?.on("create_game",()=>{
                resolve(this.socket as Socket);
            })
        });
    }

    public joinRoom(roomCode: string): Promise<Socket<DefaultEventsMap, DefaultEventsMap>>{
        return new Promise((resolve, reject) => {
            this.socket?.on("join_room",()=>{
                resolve(this.socket as Socket)
            })
        });
    }
}

export default new SocketService();