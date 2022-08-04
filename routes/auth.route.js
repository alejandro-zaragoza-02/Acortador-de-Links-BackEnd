import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";

const router = express.Router();

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

export default router;