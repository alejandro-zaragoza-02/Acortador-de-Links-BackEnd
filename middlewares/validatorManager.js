import axios from "axios";
import { validationResult, body } from "express-validator";

export const validatorManager = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const bodyLinkValidator = [
    body('longLink', 'Formato link incorrecto')
        .trim()
        .notEmpty()
        .custom( async value => {
            try {
                if(!value.startsWith('https://')){
                    value = 'https://' + value;
                }
                await axios.get(value);
                return value;
            } catch (error) {
                console.error(error);
                throw new Error('not found longLink 404');
            }
        }),
    validatorManager
];

export const bodyRegisterValidator = [
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
        }),
        validatorManager
];

export const bodyLoginValidator = [
    body('email', 'Formato de email incorrecto.')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'El tamaño de la contraseña debe ocupar entre 6 y 20 carácteres.')
        .trim()
        .isLength({ min: 6, max: 20 }),
        validatorManager
];