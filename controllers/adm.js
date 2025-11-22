import Horario from "../models/horario.js"

export const getAgendaAdm = (req, res) => {
    res.render("agenda_adm.ejs");
}

export const postCriarHorario = async (req, res) => {
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

        return res.redirect("/agenda-adm");
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