import Horario from "../models/horario.js";

export const getMeusAgendamentos = (req, res) => {
    return res.render("agendamentos_cliente.ejs");
}

export const getAPIAgendamentoCliente = async (req, res) => {
    try {
        const { nome } = req.session.cliente;
        const agendamentos = await Horario.find({ nomeCliente: nome}).sort({ data: 1 });
        return res.json(agendamentos);
    } catch(err) {
        console.log(err);
    }
}