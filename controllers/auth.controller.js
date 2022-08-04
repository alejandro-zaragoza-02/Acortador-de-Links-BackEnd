export const register = (req, res) => {

    console.log(req.body);
    res.json({
        msg: 'Registro recibido'
    });
}

export const login = (req, res) => {
    res.json({
        msg: 'Login recibido'
    });
}