import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import { loginController, signupController } from "./controller/authController.js";
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
res.json({
    message: "haha this is working"
})
})

app.post("/signup", signupController)
app.post("/login", loginController)

app.post("/room", authMiddleware, createRoomController)

app.listen(4400, ()=>{
    console.log("express server is running")
})