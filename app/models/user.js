const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let userSchema = mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }
})

//este middleware será executado antes que os dados sejam chamados
//1st arg - é a ação que irá acionar o middleware
//2nd irá acionar o próximo (como todo middleware no express)

userSchema.pre('save', function(next) {
    //esta função será executada apenas quando o usuário for novo ou alterar a senha - ela transformará a senha em um hash
    if (this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, 10,
            (err, hashedPassword) => {
                if (err) {
                    next(err);
                } else {
                    this.password = hashedPassword
                    next();
                }
            })
    }
})
//--autenticação do usuário - cria um método para verificar a senha
userSchema.methods.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    })
}
module.exports = mongoose.model("User", userSchema)