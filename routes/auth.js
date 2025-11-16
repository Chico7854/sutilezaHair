import express from "express";
import path from "path";

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/cadastro", (req, res) => {
    res.render("cadastro");
});

export default router;