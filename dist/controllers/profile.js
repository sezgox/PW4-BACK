"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsername = exports.updateProfile = exports.myEditProfile = exports.getProfileInfo = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const validate_token_1 = require("./validate-token");
const getProfileInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, validate_token_1.decodeToken)(req);
    const user = decodedToken.username;
    const username = req.params.username;
    const where = {};
    where.username = user == username ? user : username;
    try {
        const userInfo = yield user_1.User.findOne({ where: where, attributes: ['username', 'description', 'createdAt'] });
        if (userInfo) {
            res.status(200).json(userInfo);
        }
        else {
            console.log('not found');
            res.status(400).json({ msg: 'User not found' });
        }
    }
    catch (error) {
        res.status(400).json({ msg: 'Error al obtener el usuario' });
    }
});
exports.getProfileInfo = getProfileInfo;
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
const myEditProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const userInfo = yield user_1.User.findOne({ where: { username: username }, attributes: ['username', 'description'] });
    let profileInfo = {
        userInfo: {}
    };
    const decodedToken = (0, validate_token_1.decodeToken)(req);
    const user = decodedToken.username;
    if (userInfo) {
        if (user == username) {
            res.json(userInfo);
        }
        else {
            res.status(401).json({ msg: 'Unauthorized: user trying to change the profile of a different user' });
        }
    }
    else {
        res.status(400).json({ msg: 'User not found' });
    }
});
exports.myEditProfile = myEditProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let currentUsername = req.params.username;
    const decodedToken = (0, validate_token_1.decodeToken)(req);
    let currentUser = decodedToken.username;
    const { newUsername, newPassword, newDescription } = req.body;
    if (currentUser == currentUsername) {
        if (newDescription) {
            try {
                yield user_1.User.update({ description: newDescription }, { where: { username: currentUsername } });
            }
            catch (error) {
                res.json(error);
            }
        }
        if (newPassword) {
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            try {
                yield user_1.User.update({ password: hashedPassword }, { where: { username: currentUsername } });
            }
            catch (error) {
                res.json(error);
            }
        }
        if (newUsername) {
            try {
                yield user_1.User.update({ username: newUsername }, { where: { username: currentUsername } });
                currentUsername = newUsername;
            }
            catch (error) {
                res.json(error);
            }
        }
        const user = yield user_1.User.findOne({ where: { username: currentUsername } });
        const token = jsonwebtoken_1.default.sign({
            username: currentUsername,
            id: user.id
        }, process.env.SECRET_KEY_TOKEN || 'KEY_PARA_TOKEN');
        res.json(token);
    }
    else {
        res.status(400).json({ msg: 'Este no eres tu guarron' });
    }
});
exports.updateProfile = updateProfile;
//NOMBRE DE USUARIO DISPONIBLE EN TIEMPO REAL
const checkUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    try {
        const usernameInUse = yield user_1.User.findOne({ where: { username: username } });
        usernameInUse ? res.json(true) : res.json(false);
    }
    catch (error) {
        res.json(error);
    }
});
exports.checkUsername = checkUsername;
