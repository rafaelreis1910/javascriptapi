const mongoose = require('mongoose');

let noteSchema = mongoose.Schema({
    title: String,
    body: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    //especifica a relação com o usuário
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }
})
//Cria índice de pesquisa
noteSchema.index({ 'title': 'text', 'body': 'text' });

module.exports = mongoose.model("Note", noteSchema)