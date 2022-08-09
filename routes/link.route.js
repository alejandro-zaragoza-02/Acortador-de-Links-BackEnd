import { Router } from "express";
import { createLink, getLink, getLinks, removeLink, updateLink } from "../controllers/link.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyLinkValidator } from "../middlewares/validatorManager.js";

const router = Router();

// GET all routes
router.get('/', requireToken, getLinks);

// GET single link
router.get('/:nanoLink', getLink);

// POST create link
router.post('/', requireToken, bodyLinkValidator, createLink);

// PATCH modify link
router.patch('/:id', requireToken, bodyLinkValidator, updateLink);

// DELETE remove link
router.delete('/:id', requireToken, removeLink);

export default router;