import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import axios from 'axios';

export async function createUser({ username, password, name, last_name, email }: { username: string, password: string, name: string, last_name: string, email: string }) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
    const user = {
        //id: uuidv4(),
        //createdAt: moment().format( 'YYYY-MM-DD HH:mm:ss'),
        user_name: username,
        password: hash,
        email: salt,
        name: name,
        last_name: last_name,
        //typeUser,
    };
    //print user
    try {
       //Use API to create user
        const response = await axios.post(`${process.env.API_HOST}/user/create`, user);
        //Cors
        response.headers['Access-Control-Allow-Origin'] = '*'; 
        response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';

    } catch ( error ) {
        console.log( error );
    }

    return user;
}

// Here you should lookup for the user in your DB
export async function findUser({ username }:{ username: string }) {
    try {
        interface User{
            username: string;
            name: string;
            lastname: string;
            hash: string;
            salt: string | null;
        }
        //Use api to find user
        const response = await axios.get(`${process.env.API_HOST}/db/user/${username}`);
        // return response.data;
        return response.data as User;
    } catch (error) {
        console.log(error);
    }
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export async function validatePassword(user: any, inputPassword: string) {
    const inputHash = crypto
        .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
        .toString('hex');
    const passwordsMatch = user.hash === inputHash;
    return passwordsMatch;
}