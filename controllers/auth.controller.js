import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email, password });
        await user.save();
        return res.status(201).json({
            msg: 'Usuario guardado.',
            user: user
        });

    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({
                error: 'Email ya en uso.'
            })
        }
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if(!user) return res.status(403).json({error: 'Este email no pertenece a ninguna cuenta registrada.'}); 

        const responsePass = await user.comparePassword(password);
        if(!responsePass) return res.status(403).json({error: 'Contraseña incorrecta'});

        const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET);

        res.json({msg: 'Login recibido', token});
    } catch (error) {
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
}