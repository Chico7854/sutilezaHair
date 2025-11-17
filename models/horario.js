import mongoose from "mongoose";

const Schema = mongoose.Schema;

const horarioSchema = new Schema({
    nomeCliente: {
        type: String,
        required: true
    },
    nomeAtendente: {
        type: String,
        required: true
    },
    duracao: {
        type: Number,
        required: true,
    },
    data: {
        type: Date,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    pagamento: {
        type: String,
        required: true
    }
});

export default mongoose.model("Horario", horarioSchema);