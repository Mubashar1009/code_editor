import React, { useState } from "react";
import { Bond } from "../assets/svg";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginSchema = z.object({
  username: z
    .string()
    .min(4, { message: "user name should be at lease minimum 4 characters  " }),
  roomID: z.string(),
});
export const Login = () => {
  const [roomID, setRoomID] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const handleRoomID = () => {
    setRoomID();
    const roomId = uuidv4();
    setRoomID(roomId);
  };

  const handleSubmit = (event, roomID, username) => {
    console.log("Error: " + event, roomID, username);
    event.preventDefault();
    try {
      LoginSchema.parse({ roomID, username });
      navigate(`/${roomID}`, {
        state: {
          username,
        },
      });
      toast.success("Create a New Room ID");
    } catch (error) {
      console.log("Error parsing", error);
      if (error instanceof z.ZodError) {
        console.log("Form error", error.issues[0].message);
        setErrors(error.issues[0].message);
      }
    }
  };
  const handleKeys = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e, roomID, username);
    }
  };
  return (
    <div className="h-screen w-screen bg-[#1c1e29] flex flex-col justify-center items-center">
      <div className="flex flex-col gap-2 p-4 bg-[#282a36] w-5/12">
        <div className="p-4 flex  gap-4 justify-start items-center">
          <Bond />
          <div className="flex flex-col gap-2 border-l border-white p-2 ">
            <h1 className="text-3xl text-white  ">Code sync</h1>
            <p className="text-[#4aed88]">Realtime collaboration</p>
          </div>
        </div>
        <form
          onSubmit={(e) => handleSubmit(e, roomID, username)}
          className="flex flex-col gap-2"
        >
          <input
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            name="roomID"
            type="string"
            placeholder="Room ID"
            className="p-2 w-full border-2 border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
            onKeyUp={handleKeys}
          />

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            type="string"
            placeholder="User Name"
            onKeyUp={handleKeys}
            className="p-2 w-full border-2 border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors && <h5>{errors}</h5>}
          <button className=" ml-auto p-2 text-white bg-[#4aed88] rounded-md hover:bg-[#2b824c]">
            Login
          </button>
        </form>

        <p className="  text-white">
          if you do not any invite then create new room ID{" "}
          <span
            className="text-[#4aed88] hover:text-[#2b824c] hover:cursor-pointer hover:underline"
            onClick={handleRoomID}
          >
            Room ID
          </span>{" "}
        </p>
      </div>
    </div>
  );
};
