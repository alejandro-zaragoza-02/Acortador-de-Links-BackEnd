import jwt from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager.js";

export const requireRefreshToken = (req, res, next) => {
    try {
        let cookies = req.headers.cookie.split(' ');
        let refreshTokenCookie;
        cookies.forEach(cookie => {
            if(cookie.indexOf('refreshToken') !== -1){
                refreshTokenCookie = cookie.replace(';','').split('=')[1];
            }
        });
        if(!refreshTokenCookie) throw new Error('No existe el token');

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        req.uid = uid;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: tokenVerificationErrors[error.message] });
    }
};