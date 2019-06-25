const mongoose = require('mongoose'),
    accountModel = require('./accountModel');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
});

const userModel = mongoose.model('User', userSchema);

userModel.addUser = (newUser, result) => {
    accountModel.addAccount(newUser, (err,account) => {
        if(err) {
            result('Account acould not be created',null);
            throw err;
        }
        newUser.account = account;
        userModel.create(newUser,(err,user) => {
            if(err) {
                result('User could not be created',null);
                throw err;
            }
            result(null,user);
        });
    });
}

userModel.getDetails = (user,result) => {
    userModel.findOne({_id: user._id}).populate('account').then(account => {
        console.log(account);
        result(null,account);
    });
}

//userModel.getUser - (user)

module.exports = userModel;