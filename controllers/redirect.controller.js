import { Link } from "../models/Link.js";

export const redirectLink = async (req, res) => {
    try {
        const { nanoLink } = req.params;
        const link = await Link.findOne({nanoLink: nanoLink});

        if(!link) return res.status(404).json({ error: 'No existe el link' });

        return res.redirect(link.longLink);
    } catch (error) {
        console.error(error);
        if(error.kind === 'ObjectId') return res.status(403).json({ error: 'El formato del link no es correcto' });
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
}