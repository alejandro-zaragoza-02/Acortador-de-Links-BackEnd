import { Router } from "express";
import { infoUser, login, register, refreshToken, logout } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";

const router = Router();

router.post('/register', [
    body('email', 'Formato de email incorrecto.')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'El tamaño de la contraseña debe ocupar entre 6 y 20 carácteres.')
        .trim()
        .isLength({ min: 6, max: 20 }),
    body('password', 'Las contraseñas no coinciden.')
        .custom((value, { req }) => {
            if(value !== req.body.repassword){
                throw new Error('Las contraseñas no coinciden');
            }
            return value;
        })
], validationResultExpress, register);

router.post('/login', [
    body('email', 'Formato de email incorrecto.')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'El tamaño de la contraseña debe ocupar entre 6 y 20 carácteres.')
        .trim()
        .isLength({ min: 6, max: 20 })
], validationResultExpress, login);

router.get('/protected', requireToken, infoUser);
router.get('/refresh', requireRefreshToken, refreshToken);
router.get('/logout', logout);

export default router;