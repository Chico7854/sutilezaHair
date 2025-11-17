import express from "express"

import * as mainController from "../controllers/main.js";

const router = express.Router();

router.get("/", mainController.getIndex);

router.get("/agenda-adm", mainController.getAgendaAdm);

export default router;