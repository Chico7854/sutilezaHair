import Horario from "../models/horario.js"

export const getAgendaAdm = (req, res) => {
    res.render("agenda_adm.ejs");
}

export const postAPICriarHorario = async (req, res) => {
    try {
        const { data, horas, duracao, nomeCliente, nomeAtendente, descricao, pagamento } = req.body;

        const dataComHoras = `${data}T${horas}:00`;

        const horario = new Horario({
            data: dataComHoras,
            duracao: duracao,
            nomeCliente: nomeCliente,
            nomeAtendente: nomeAtendente,
            descricao: descricao,
            pagamento: pagamento
        });

        await horario.save();

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
    }
}

export const getAPIHorarios = async (req, res) => {
    try {
        const listaHorarios = await Horario.find();

        return res.json(listaHorarios);
    } catch(err) {
        console.log(err);
    }
}

export const deleteAPICancelarHorario = async (req, res) => {
    try {
        console.log("Here");
        const { id } = req.body;

        await Horario.findByIdAndDelete(id);

        return res.sendStatus(200);
    } catch(err) {
        console.log(err);
    }
}