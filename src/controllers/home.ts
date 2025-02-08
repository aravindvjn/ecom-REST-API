import { Request, Response } from "express";

export const getWelcome = (req:Request, res:Response) => {
  res.send("Welcome");
};
