import { io } from "socket.io-client";
export const initSocket = async () => {

    // const socket = io();
    const options = {
        'force-new-connection' : true,
        reconnectionAttempt : 'infinity',
        timeout : 10000,
        transports : ['websocket']
    }
    return io(process.env.REACT_APP_BACKEND_URL,options)

 }