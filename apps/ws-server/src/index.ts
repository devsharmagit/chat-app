import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

interface Users {
  ws: WebSocket;
  rooms: String[];
  userId: String;
}

const users: Users[] = [];

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  
  const token = req.url?.split("?token=")[1];
  
  if (!token) {
    ws.close();
    return;
  }

  const decoded = jwt.verify(token, process.env.HTTP_SECRET!);
  if (typeof decoded === "string") {
    ws.close();
    return;
  }

  if (!decoded.userId || !decoded) {
    ws.close();
    return;
  }

  users.push({
    ws: ws,
    userId: decoded.userId,
    rooms: [],
  });

  ws.on("message", async (data) => {

    const stringData = data.toString("utf-8").trim();
    

    const jsonData = JSON.parse(stringData);
    

    if (jsonData.type === "join__room") {
      
      const user = users.find((user) => user.ws === ws);
      user?.rooms.push(jsonData.roomId);
    }

    if (jsonData.type === "exit__room") {
      const user = users.find((user) => user.ws === ws);
      if (user) {
        user.rooms = user?.rooms.filter((roomId) => roomId === jsonData.roomId);
      }
    }

    if (jsonData.type === "send__message") {
    
      const user = users.find((user) => user.ws === ws);
      if (!user) return;
      await prismaClient.message.create({
        data: {
          content: jsonData.message,
          roomId: Number(jsonData.roomId),
          sendBy: Number(user.userId),
        },
      });
      users.forEach((user) => {
        if (user.rooms.includes(jsonData.roomId)) {
            console.log("yes yes yes yes yes yes yes yes yes")
          if(user.ws !== ws) user.ws.send(
            JSON.stringify({
              message: jsonData.message,
            })
          );
        }
      });
    }
    console.log(users.length);
  });
});
/*

message = {
type: "join" or "leave",
content: "oadf",

}

*/
