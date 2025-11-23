//TODO: Fazer editar e deletar atualizacao no backend
//Deixar os botao de editar deletar e criar, em atualizacao apenas para o adm
//Pagina do cliente

import path from "path";

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";

import { getDirname } from "./utils/pathHelpers.js";

import mainRoutes from "./routes/main.js"
import authRoutes from "./routes/auth.js"
import admRoutes from "./routes/adm.js";
import clienteRoutes from "./routes/cliente.js";

const __dirname = getDirname(import.meta.url)
const MONGODB_URI = "mongodb+srv://lacus7854:dl2RZ1UdK4Xd%249N@cluster0.rkwh7xn.mongodb.net/SutilezaHair"

const app = express();
const port = process.env.PORT || 3000;
const mongoDBSession = connectMongoDBSession(session);
const storeSession = new mongoDBSession({
    uri: MONGODB_URI,
    collection: "sessions"
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias 
    },
    store: storeSession
}));

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.isAdm = req.session.isAdm;
    next();
});

app.use(mainRoutes);
app.use(authRoutes);
app.use("/adm", admRoutes);
app.use(clienteRoutes);

mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });