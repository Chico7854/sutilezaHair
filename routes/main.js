import express from "express"

import * as mainController from "../controllers/main.js";

const router = express.Router();

router.get("/", mainController.getIndex);

router.get("/atualizacoes", mainController.getAtualizacoes);

export default router;