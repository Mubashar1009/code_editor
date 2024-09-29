const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const ACTIONS = require("./src/Actions");
const app = express();

const server = http.createServer(app);
const getClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userMaps[socketId],
      };
    }
  );
};
const userMaps = {};
const codeMaps = {};
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("socket connection", socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    console.log(`User Joined ${socket.id}`);
    userMaps[socket.id] = username;
    socket.join(roomId);
    const clients = getClients(roomId);
    console.log("Clients", clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        username,
        clients,
        socketId: socket.id,
      });
    });
  });
  socket.on(ACTIONS.CODE_CHANGE,({roomId, code}) => {
    console.log(`Code Change ${code} in room ${roomId}`); 
    codeMaps[roomId] = code;
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code})
  })
  socket.on(ACTIONS.SYNC_CODE,({socketId,roomId})=> {
    const code = codeMaps[roomId];
    console.log(`Sync Code ${socketId} in room ${roomId} code ${code}`);

    // console.log("sync code",code);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE,{
      roomId,
     code 
      
    })

  })
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket
        .in(roomId)
        .emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userMaps[socket.id],
        });
    });
    delete userMaps[socket.id];
    socket.leave();
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
