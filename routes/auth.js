import express from "express";

import * as authController from "../controllers/auth.js";

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/cadastro", authController.getCadastro);

router.post("/cadastro", authController.postCadastro);

router.post("/logout", authController.postLogout);

export default router;