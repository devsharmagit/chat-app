import express from "express";
import cors from "cors";
import { signupController } from "./controller/authController.js";

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
res.json({
    message: "haha this is working"
})
})

app.post("/signup", signupController)
app.post("/login", signupController)

app.listen(4400, ()=>{
    console.log("express server is running")
})