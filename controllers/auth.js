import Cliente from "../models/client.js";

export const getLogin = (req, res) => {
    res.render("login");
}

export const getCadastro = (req, res) => {
    res.render("cadastro");
}

export const postLogin = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const cliente = await Cliente.findOne({ email: email });
        if (!cliente) {
            return res.redirect("/login");
        }

        if (senha == cliente.senha) {
            req.session.cliente = cliente;
            req.session.isLoggedIn = true;
            if (email == "lucas-tanaka@hotmail.com") {
                req.session.isAdm = true;
            }
            await req.session.save();
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    }
    catch (err) {
        console.log(err);
    }
}

export const postCadastro = async (req, res) => {
    const { nome, telefone, email, genero, senha } = req.body;
    const comoConheceu = req.body.canal;

    const cliente = new Cliente({
        nome: nome,
        telefone: telefone,
        email: email,
        genero: genero,
        senha: senha,
        comoConheceu: comoConheceu
    });

    await cliente.save();

    req.session.isLoggedIn = true;
    await req.session.save();

    return res.redirect("/");
}

export const postLogout = async (req, res) => {
    await req.session.destroy();
    res.redirect("/");
}