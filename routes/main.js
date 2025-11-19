import express from "express"

import * as mainController from "../controllers/main.js";

const router = express.Router();

router.get("/", mainController.getIndex);

export default router;