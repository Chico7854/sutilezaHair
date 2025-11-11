import express from "express";
import path from "path";

const router = express.Router();

router.get("/login", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "login.html"));
});

router.get("/cadastro", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "cadastro.html"));
});

export default router;