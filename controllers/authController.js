const User = require('../models/userDb');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '', userName: '' };

    if (err.message === 'incorrect mail'){
        errors.email = 'email not register';
    }

    
    if (err.message === 'incorrect password'){
        errors.password = 'password is incorrect';
    }

    if (err.code === 11000){
        errors.email = 'alraedy exists';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 24*60*60;

const createToken = (id) => {
    return jwt.sign({ id }, 'secretkeyforhashing', {
        expiresIn: maxAge
    })
}

module.exports.signup = async (req, res) => {
    const { email, password, userName} = req.body;

    try{
        const user = await User.create({ email, password, userName});
        const token = createToken(user._id);
        res.cookie("jwtToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id, details: user });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    };
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwtToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({"user": user})
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }
};


module.exports.logout = (req, res) => {
    res.cookie('jwtToken', '', { maxAge: 1 });
    res.redirect('/home');
};