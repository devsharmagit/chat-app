import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

export const createRoomController= async(req : Request, res : Response)=>{
try {

    const {slug} = req.body
    if(!slug){
        res.status(400).json({
            message: "Name is required",
            success: false
        })
        return
    }

    const room = await prismaClient.room.create({
        data :{
            slug,
            adminId: Number(req.userId),
        }
    })

    res.status(201).json({
        message: "room created successfully!",
        success: true,
        room
    })
    
    return
    
} catch (error) {
    res.status(500).json({
        message: "something went wrong server side!",
        success: false
    })
    
    return 
}
}

export const getAllMessages = async(req : Request, res : Response)=>{
    try {
        const {slug} = req.params
        const room = await prismaClient.room.findFirst({
            where: {
                slug
            }
        })
        if(!room){
            res.status(400).json({
                message: "No room found with this slug",
                success: false
            })
            return
        }
        const messages = await prismaClient.message.findMany({
            where: {
                roomId: room?.id
            },
            take: 50,
            orderBy: {
                sendAt: "desc"
            }
        })
        res.status(200).json({
            message: "successfully fetched the messages!",
            messages,
            success: true
        })
        return 
        
    } catch (error) {
        res.status(500).json({
            message: "something went wrong server side!",
            success: false
        }) 
        return
    }

}