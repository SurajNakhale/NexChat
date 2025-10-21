import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({port: 8080});

interface User {
    socket: WebSocket;
    room : string;
    username: string;
    avatarUrl: string;
    timeStamp: string;
}

// let userCount = 0;
let allSocket: User[] = [];

wss.on("connection", (socket) => {


    socket.on("message", (message)=>{
        const ParsedMsg = JSON.parse(message.toString());

        if(ParsedMsg.type == "join"){
            allSocket.push({
                socket,
                room: ParsedMsg.payload.roomId,
                username: ParsedMsg.payload.username,
                avatarUrl: ParsedMsg.payload.avatarUrl,
                timeStamp: ParsedMsg.payload.timeStamp
            });
        }

        if(ParsedMsg.type == "chat"){
            const currentUser = allSocket.find((x) => x.socket == socket);
            const currentUserRoom = currentUser?.room;
            const currentUsername = currentUser?.username;
            const currentUserAvatar = currentUser?.avatarUrl;


            if(currentUserRoom){
                for(let i=0; i<allSocket.length; i++){
                    const user = allSocket[i];
                    if(user?.room === currentUserRoom && user.socket !== socket){
                        user.socket.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                roomId: currentUserRoom,
                                username: currentUsername,
                                avatarUrl: currentUserAvatar,
                                message: ParsedMsg.payload.message,
                                timeStamp: new Date()
                            }
                        }))
                    }
                }
            }
        }
    })

    socket.on("close", ()=> {
        allSocket = allSocket.filter((user)=> user.socket !== socket);
        console.log(`user disconnected`)
    })
});