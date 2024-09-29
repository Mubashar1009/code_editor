import React, { useRef, useEffect, useState } from "react";
import { Bond } from "../assets/svg";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import Avatar from "react-avatar";
import { CodeEditor } from "./CodeEditor";
import { initSocket } from "../socket";
import { useLocation } from "react-router-dom";
import ACTIONS from "../Actions";

export const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const syncCodRef = useRef(null);

  const users = [
    {
      id: 1,
      name: "Mubasher Shakeel",
      roomId: "423423",
    },
    {
      id: 2,
      name: "Mahmmoud Ali",
      roomId: "567856",
    },
  ];

  const { roomId } = useParams();
  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      console.log("init");
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (error) => {
        handleError(error);
      });
      socketRef.current.on("connect_faild", (error) => {
        handleError(error);
      });
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      socketRef.current.on(ACTIONS.JOINED, ({ clients, socketId, username }) => {
        if (username !== location.state.username) {
          toast.success(`${username} joined in this room `);
        }
        setClients(clients);
        console.log("syncCodReceived",syncCodRef.current);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code : syncCodRef.current,
          socketId ,
          roomId
         
        });
      });
      
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} is leaving this room`);
        const remaingclients = setClients((prev) =>
          {return prev.filter((client) => client.socketId !== socketId) }
        );
        return remaingclients;
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();

      socketRef.current.off(ACTIONS.JOIN);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  const handleError = (error) => {
    console.error("Socket Error", error);
    toast.error("Failed to connect to the server, please try again later");
    navigator("/");
  };
  const handleRoomId = async () => {
    const textArea = document.createElement("textarea");
    textArea.value = roomId;
        
    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
        
    document.body.prepend(textArea);
    textArea.select();
    toast.success("Room Id copied successfully")

    try {
        document.execCommand('copy');
    } catch (error) {
        console.error(error);
    } finally {
        textArea.remove();
    }
  
   
  };
  const handleLeave = () => {
    //Leave the room
    // Redirect to home page
    navigator("/");
  };
  if (!location.state) {
    <Navigate />;
  }
  return (
    <div className="w-screen h-screen bg-black flex">
      <div className="p-4  h-full bg-gray-700 flex flex-col   ">
        <div className="p-4 flex  gap-4 justify-start items-center border-b-2 border-[#424242] ">
          <Bond width={"40px"} />
          <div className="flex flex-col gap-1 border-l border-gray-800 p-2 ">
            <h1 className="text-xl text-white  ">Code sync</h1>
            <p className="text-black">Realtime collaboration</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1 mt-1   ">
          <h2 className="text-xl text-white ">Connected</h2>
          <div className="flex gap-4 flex-wrap">
            {clients.map((user) => (
              <Avatar name={user.username} size={50} round="14px" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-self-end mt-2 ">
          <button className="bg-slate-400 p-3 rounded font-semibold " onClick = {handleRoomId}>
            Copy Room ID
          </button>
          <button
            className="bg-black p-3 rounded font-semibold text-white "
            onClick={handleLeave}
          >
            Leave
          </button>
        </div>
      </div>
      <CodeEditor socketRef = {socketRef} roomId = {roomId} handleChangeCode = {(code)=> {syncCodRef.current = code}} />
    </div>
  );
};
