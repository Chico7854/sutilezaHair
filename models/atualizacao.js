import mongoose from "mongoose";

const Schema = mongoose.Schema;

const atualizacaoSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    }
});

export default mongoose.model("atualizacoes", atualizacaoSchema);