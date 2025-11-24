import { Router } from "express";

import * as clienteController from "../controllers/cliente.js";

const router = Router();

router.get("/meus-agendamentos", clienteController.getMeusAgendamentos);

router.get("/agendamentos-cliente", clienteController.getAPIAgendamentoCliente);

export default router;