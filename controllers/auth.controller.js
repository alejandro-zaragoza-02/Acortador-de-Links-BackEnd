import { User } from "../models/User.js";
import { generateRefreshToken, generateToken, tokenVerificationErrors } from "../utils/tokenManager.js";

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email, password });
        await user.save();
        return res.status(201).json({
            msg: 'Usuario guardado.',
            user: user,
            token: generateToken(user.id)
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

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({msg: 'Login recibido', token: { token, expiresIn }});
    } catch (error) {
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        return res.json({
            email: user.email,
            uid: user._id
        });
    } catch (error) {
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
}

export const refreshToken = async (req, res) => {
    try {
        console.log('refreshToken');
        const { token, expiresIn } = generateToken(req.uid);
        return res.json({ token, expiresIn });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ msg: 'Sesión cerrada' });
};