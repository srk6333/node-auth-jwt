const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'enter valid email']
    },
    password: {
        type: String,
        required: [true, 'Password cant empty'],
        minlength: [5, 'Password is too small']
    },
    userName: {
        type: String,
        required: [true, 'username cant be empty']
    }
});

//hooks

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// userSchema.post('save', function(doc, next){
//     console.log('new user was crested', doc);
//     next();
// });

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect mail')
}

const User = mongoose.model('user', userSchema);

module.exports = User;