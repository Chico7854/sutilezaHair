import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: Number,
        retuired: true
    },
    email: {
        type: String,
        required: true
    },
    genero: {
        type: String
    },
    senha: {
        type: String,
        required: true
    },
    comoConheceu: {
        type: String
    }
});

export default mongoose.model("Cliente", clienteSchema);