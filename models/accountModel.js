const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

const accountModel = mongoose.model('Account',accountSchema);

accountModel.addAccount = (newAccount,result) => {
    accountModel.create(newAccount,(err,account) => result(err,account));
}

module.exports = accountModel;