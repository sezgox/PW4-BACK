import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jswt from 'jsonwebtoken';
import { User } from "../models/user";
import { decodeToken } from "./validate-token";


export const getProfileInfo = async (req: Request, res: Response) => {
    const decodedToken = decodeToken(req);
    const user = decodedToken.username;
    const username = req.params.username;
    const where:any={};
    where.username = user==username ? user : username;
    try {
        const userInfo = await User.findOne({where: where,attributes: ['username', 'description','createdAt']});
        if(userInfo){
            res.status(200).json(userInfo)
        }else{
            console.log('not found')
            res.status(400).json({msg:'User not found'})
        }
    } catch (error) {
        res.status(400).json({msg:'Error al obtener el usuario'})
    }
}

/* const getMyProfile = async (username: string) => {
    const userInfo = await User.findOne({where:{ username: username},attributes: ['username', 'description','createdAt']});
    const profileInfo: any = {
        userInfo: {},
        notesUser: {},
        ownProfile: undefined
    };
    const notesUser = await Note.findAll({where: {user: username}});
    profileInfo.userInfo = userInfo;
    profileInfo.notesUser = notesUser;
    profileInfo.ownProfile = true;
    return (profileInfo);
}

const getProfile =  async (username:string) => {
    const userInfo = await User.findOne({where:{ username: username},attributes: ['username', 'description','createdAt']});
    const profileInfo: any = {
        userInfo: {},
        notesUser: {},
        ownProfile: undefined
    };
    const notesUser = await Note.findAll({where: {user: username, showAll: true}});
    profileInfo.userInfo = userInfo;
    profileInfo.notesUser = notesUser;
    profileInfo.ownProfile = false
    return(profileInfo);
}

export const getInfoProfile = async (req: Request, res: Response) => {
    const username = req.params.username;
    const userInfo = await User.findOne({where:{ username: username}});
    
    let profileInfo: any = {
        userInfo: {},
        notesUser: {},
        ownProfile: undefined
    };

    const decodedToken = decodeToken(req);
    const user = decodedToken.username;

    if(userInfo){
        if(user == username){
            profileInfo = await getMyProfile(username);
        }else{
            profileInfo = await getProfile(username);
        }
        res.json(profileInfo);
    }else{
        res.status(400).json({msg:'User not found'})
    }
} */

export const myEditProfile = async (req: Request, res: Response) => {
    const username = req.params.username;
    const userInfo = await User.findOne({where:{ username: username},attributes: ['username', 'description']},);
    let profileInfo: any = {
        userInfo: {}
    };

    const decodedToken = decodeToken(req);
    const user = decodedToken.username;

    if(userInfo){
        if(user == username){
            res.json(userInfo);
        }else{
            res.status(401).json({msg:'Unauthorized: user trying to change the profile of a different user'})
        }
    }else{
        res.status(400).json({msg:'User not found'})
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    let currentUsername = req.params.username;
    const decodedToken = decodeToken(req);
    let currentUser = decodedToken.username;
    const {newUsername, newPassword, newDescription} = req.body;

    if(currentUser==currentUsername){
        if(newDescription){
            try {
                await User.update({description: newDescription}, {where: {username: currentUsername}});
            } catch (error) {
                res.json(error)
            }
        }
        if(newPassword){
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            try {
                await User.update({password: hashedPassword}, {where: {username: currentUsername}});
            } catch (error) {
                res.json(error)
            }
        }
        if(newUsername){
            try {
                await User.update({username: newUsername}, {where: {username: currentUsername}});
                currentUsername = newUsername;
            } catch (error) {
                res.json(error)
            }
        }
        const user: any = await User.findOne({where: {username: currentUsername}});
        const token = jswt.sign({
            username: currentUsername,
            id: user.id
        }, process.env.SECRET_KEY_TOKEN || 'KEY_PARA_TOKEN');
        res.json(token);
    }else{
        res.status(400).json({msg:'Este no eres tu guarron'});
    }
}


//NOMBRE DE USUARIO DISPONIBLE EN TIEMPO REAL
export const checkUsername = async (req: Request, res: Response) => {
    const username = req.query.username;
    try {
        const usernameInUse = await User.findOne({where: {username: username}});
        usernameInUse ? res.json(true) : res.json(false);
    } catch (error) {
        res.json(error);
    }
    
}