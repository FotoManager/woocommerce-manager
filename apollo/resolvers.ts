import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { createUser, findUser, validatePassword } from '../lib/user';
import { setLoginSession, getLoginSession } from '../lib/auth';
import { removeTokenCookie } from '../lib/auth-cookies';

export const resolvers = {
    Query: {

        async viewer(_parent:any , _args:any, context:any, _info:any) {
            try {
                const session = await getLoginSession(context.req);
                if (session) {
                    return findUser({ username: session.username });
                }
            } catch (error) {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in',
                );
            }
        },
        
    },
    Mutation: {
        async signUp(_parent:any, args:any, _context:any, _info:any) {
            const user = await createUser(args.input);
            return { user };
        },
        async signIn(_parent:any, args:any, context:any, _info:any) {
            const user = await findUser({ username: args.input.username });
            
            if (user && (await validatePassword(user, args.input.password))) {
                const session = {
                    //id: user.id,
                    username: user.username,
                    //typeUser: user.typeUser,
                    name: user.name,
                    lastname: user.lastname,
                };
                await setLoginSession(context.res, session);
                return { user };
            }

            throw new UserInputError('Incorrect username or password. Please try again.');
        },
        async signOut(_parent:any, args:any, context:any, _info:any) {
            removeTokenCookie(context.res);
            return true;
        },
    },
};