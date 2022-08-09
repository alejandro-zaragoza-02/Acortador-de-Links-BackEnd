import { nanoid } from "nanoid";
import { Link } from "../models/Link.js";

export const getLinks = async (req, res) => {
    try {
        const links = await Link.find({ uid: req.uid });
        return res.json({ links });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
};

export const getLink = async (req, res) => {
    try {
        const { nanoLink } = req.params;
        const link = await Link.findOne({nanoLink: nanoLink});

        if(!link) return res.status(404).json({ error: 'No existe el link' });

        return res.json({ longLink: link.longLink });
    } catch (error) {
        console.error(error);
        if(error.kind === 'ObjectId') return res.status(403).json({ error: 'El formato del link no es correcto' });
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
}

export const createLink = async (req, res) => {
    try {
        let { longLink } = req.body;
        if(!longLink.startsWith('https://')){
            longLink = 'https://' + longLink;
        }
        console.log(longLink);

        const link = new Link({
            longLink,
            nanoLink: nanoid(6),
            uid: req.uid
        });
        const newLink = await link.save();

        return res.status(201).json({ newLink });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
}

export const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        let { longLink } = req.body;
        const link = await Link.findById(id);

        if(!longLink.startsWith('https://')){
            longLink = 'https://' + longLink;
        }
        if(!link) return res.status(404).json({ error: 'No existe el link' });
        if(link.uid.valueOf() !== req.uid) return res.status(401).json({ error: 'Este link no pertenece a este usuario' });

        link.longLink = longLink;
        await link.save({ longLink });
        return res.json({ msg: 'El siguiente link ha sido modificado', link });
    } catch (error) {
        console.error(error);
        if(error.kind === 'ObjectId') return res.status(403).json({ error: 'El formato del link no es correcto' });
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
};

export const removeLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await Link.findById(id);

        if(!link) return res.status(404).json({ error: 'No existe el link' });
        if(link.uid.valueOf() !== req.uid) return res.status(401).json({ error: 'Este link no pertenece a este usuario' });

        await link.remove();
        return res.json({ msg: 'El siguiente link ha sido eliminado', link });
    } catch (error) {
        console.error(error);
        if(error.kind === 'ObjectId') return res.status(403).json({ error: 'El formato del link no es correcto' });
        return res.status(500).json({ error: 'Se perdio la conexión con la base de datos.' });
    }
}