import { Router } from "express";

import * as admController from "../controllers/adm.js"

const router = Router();

router.get("/agenda-adm", admController.getAgendaAdm);

router.post("/criar-horario", admController.postAPICriarHorario);

router.get("/horarios", admController.getAPIHorarios);

router.delete("/cancelar-horario", admController.deleteAPICancelarHorario);

router.get("/get-atualizacoes", admController.getAPIGetAtualizacoes);

router.post("/criar-atualizacao", admController.postAPICriarAtualizacao);

router.put("/editar-atualizacao", admController.putAPIEditarAtualizacao);

router.delete("/excluir-atualizacao", admController.deleteAPIExcluirAtualizacao);

export default router;