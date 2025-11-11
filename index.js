import path from "path";

import express from "express";

import { getDirname } from "./utils/pathHelpers.js";

import mainRoutes from "./routes/main.js"
import authRoutes from "./routes/auth.js"

const __dirname = getDirname(import.meta.url)

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(mainRoutes);
app.use(authRoutes);

app.listen(3000);