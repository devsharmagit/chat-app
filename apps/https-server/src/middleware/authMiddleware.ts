import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";


export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] 

        if(!token){
res.status(401).json({
    message: "Token is not provided!",
    success: false
})
return
        }
 jwt.verify(token, process.env.SCERET!, function(err, data){
if(err){
    return res.status(401).json({
        message: "Unauthorized",
        success: false,
    })
}
if(typeof data !== "string"){
    req.userId = data?.userId
}
next()
 })


    } catch (error) {
console.log(error)
        res.status(500).json({
            message: "Something went wrong server side",
            success: false
        })
    }
}