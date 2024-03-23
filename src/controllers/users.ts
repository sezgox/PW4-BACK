import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jswt from 'jsonwebtoken';
import { User } from "../models/user";

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({where: {username: req.body.username}});
    if (user){
        return res.status(400).json({
            msg: "Username already in use"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    try {
        await User.create({
            username: username,
            password: hashedPassword
        });
        res.json({
            msg: "User created :)"
        });
    } catch (error) {
        res.status(400).json({
            msg: "User not created :("
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        console.log(username, password)
        const user: any = await User.findOne({where: {username: req.body.username}})
        if (!user){
            return res.status(401).json({
                msg: "User doesn't exists"
            });
        }
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if(!passwordIsValid){
            return res.status(401).json({msg: "Password incorrect"});
        }
        const token = jswt.sign({
            username: username,
            id: user.id
        }, process.env.SECRET_KEY_TOKEN || 'KEY_PARA_TOKEN');
        res.json(token);
    } catch (error) {
        res.json({msg: "Algo raro ha pasao"})
    }
}
