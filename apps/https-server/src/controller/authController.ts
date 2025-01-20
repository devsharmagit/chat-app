import { LoginSchema, SignupSchema } from "@repo/common/auth";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SCERET } from "../config/index.js";

export const signupController = async (req: Request, res: Response) => {
  try {
    const { success, data } = SignupSchema.safeParse(req.body);
    if (!success) {
      res.status(422).json({
        success: false,
        message: "Invalid Inputs!",
      });
      return;
    }
    const { email: userEmail, password: userPassword, name } = data;
    const user = await prismaClient.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (user) {
      res.status(409).json({
        success: false,
        message: "Email already in use. Please use different email or log in.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(userPassword, 8);
    const newUser = await prismaClient.user.create({
      data: {
        email: userEmail,
        password: hashedPassword,
        name,
      },
    });
    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User created successfully!",
      });
      return;
    } else {
      res.status(500).json();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong on server side",
    });
    console.log(error);
    return;
  }
};
export const loginController = async (req: Request, res: Response) => {
  try {
    const { success, data } = LoginSchema.safeParse(req.body);
    if (!success) {
      res.status(422).json({
        success: false,
        message: "Invalid Inputs!",
      });
      return;
    }
    const { email: userEmail, password: userPassword } = data;

    const user = await prismaClient.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (!user) {
      res.status(409).json({
        success: false,
        message: "No User found with this email",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(userPassword, user.password);

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: "The email or password you entered is incorrect.",
      });
      return;
    }
    console.log(process.env.SCERET);

    const token = jwt.sign({userId: user.id,}, process.env.SCERET!, { expiresIn: "24h" });
    res.status(200).json({
      success: true,
      message: "Successfully Logged in!",
      token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "something went wrong on server side",
    });
    console.log(error);
    return;
  }
};
