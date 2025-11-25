import Horario from "../models/horario.js";
import Atualizacao from "../models/atualizacao.js";
import Cliente from "../models/client.js";

export const getAgendaAdm = (req, res) => {
    return res.render("agenda_adm.ejs");
}

export const postAPICriarHorario = async (req, res) => {
    try {
        const { data, horas, duracao, nomeCliente, nomeAtendente, descricao, pagamento, valor } = req.body;

        const dataComHoras = `${data}T${horas}:00`;

        const horario = new Horario({
            data: dataComHoras,
            duracao: duracao,
            nomeCliente: nomeCliente,
            nomeAtendente: nomeAtendente,
            descricao: descricao,
            pagamento: pagamento,
            valor: valor
        });

        await horario.save();

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
    }
}

export const getAPIHorarios = async (req, res) => {
    try {
        const data = new Date(req.body.data);
        data.setHours(0, 0, 0, 0);
        const diaSemana = data.getDay();

        const inicioSemana = new Date(data);
        inicioSemana.setDate(data.getDate() - diaSemana);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        const listaHorarios = await Horario.find({
            data: {
                $gte: inicioSemana,
                $lte: fimSemana
            }
        });

        return res.json(listaHorarios);
    } catch(err) {
        console.log(err);
    }
}

export const deleteAPICancelarHorario = async (req, res) => {
    try {
        const { id } = req.body;

        await Horario.findByIdAndDelete(id);

        return res.sendStatus(200);
    } catch(err) {
        console.log(err);
    }
}

export const getAPIGetAtualizacoes = async (req, res) => {
    try {
        const atualizacoes = await Atualizacao.find();

        return res.json(atualizacoes);
    } catch(err) {
        console.log(err);
    }
}

export const postAPICriarAtualizacao = async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        const atualizacao = new Atualizacao({
            titulo: titulo,
            descricao: descricao
        });

        atualizacao.save();

        return res.redirect("/atualizacoes");
    } catch(err) {
        console.log(err);
    }
}

export const putAPIEditarAtualizacao = async (req, res) => {
    try {
        const { id, titulo, descricao } = req.body;

        await Atualizacao.findByIdAndUpdate(
            id,
            {
                titulo: titulo,
                descricao: descricao
            }
        );

        res.sendStatus(204);
    } catch(err) {
        console.log(err);
    }
}

export const deleteAPIExcluirAtualizacao = async (req, res) => {
    try {
        const { id } = req.body;
        await Atualizacao.findByIdAndDelete(id);

        res.sendStatus(204);
    } catch(err) {
        console.log(err);
    }
}

export const getListas = (req, res) => {
    return res.render("listas.ejs");
}

export const getAPIListaClientes = async (req, res) => {
    try {
        const listaClientes = await Cliente.find();
        return res.json(listaClientes);
    } catch(err) {
        console.log(err);
    }
}

export const getAPIListaAdms = async (req, res) => {
    try {
        const listaAdms = await Cliente.find();
        return res.json(listaAdms);
    } catch(err) {
        console.log(err);
    }
}