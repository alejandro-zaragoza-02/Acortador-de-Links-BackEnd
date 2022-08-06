import jwt from 'jsonwebtoken';
import { tokenVerificationErrors } from '../utils/tokenManager.js';

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        if(!token) throw new Error('No existe el token en la cabezera authorization.')

        token = token.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = payload.uid;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({ error: tokenVerificationErrors[error.message] });
    }
}