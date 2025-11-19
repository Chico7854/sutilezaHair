import { Router } from "express";

import * as admController from "../controllers/adm.js"

const router = Router();

router.get("/agenda-adm", admController.getAgendaAdm);

router.post("/criar-horario", admController.postCriarHorario);

router.get("/api/horarios", admController.getAPIHorarios);

export default router;