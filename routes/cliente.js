import { Router } from "express";

import * as clienteController from "../controllers/cliente.js";

const router = Router();

router.get("/meus-agendamentos", clienteController.getMeusAgendamentos);

export default router;