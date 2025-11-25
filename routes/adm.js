import { Router } from "express";

import * as admController from "../controllers/adm.js"

const router = Router();

router.get("/agenda-adm", admController.getAgendaAdm);

router.post("/criar-horario", admController.postAPICriarHorario);

router.post("/horarios", admController.getAPIHorarios); //esta como post para poder enviar JSON para o body

router.delete("/cancelar-horario", admController.deleteAPICancelarHorario);

router.get("/get-atualizacoes", admController.getAPIGetAtualizacoes);

router.post("/criar-atualizacao", admController.postAPICriarAtualizacao);

router.put("/editar-atualizacao", admController.putAPIEditarAtualizacao);

router.delete("/excluir-atualizacao", admController.deleteAPIExcluirAtualizacao);

router.get("/listas", admController.getListas);

router.get("/lista-clientes", admController.getAPIListaClientes);

router.get("/lista-adms", admController.getAPIListaAdms);

export default router;