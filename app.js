const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/userDb');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/authMidddleware');

const app = express();

app.use(express.urlencoded( { extended: true} ));
app.use(express.json());
app.use(cookieParser());

//const dbURI = 'mongodb+srv://user1:test1234@cluster0.xsk26.mongodb.net/nodetutorial?retryWrites=true&w=majority'
PORT = process.env.PORT | 3001
const dbURI = 'mongodb+srv://admin:admin1234@cluster0.xsk26.mongodb.net/node-auth'


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then((result)=> app.listen(PORT, ()=> {
        console.log("server running and database connected");
    }))
    .catch((err)=> console.log(err));


app.use(authRoutes);

app.get('/alluser', requireAuth, (req,res) => {
    User.find()
        .then((results) => {
            res.json(results)
        })
        .catch((err) => {
            console.log(err)
        });
});
app.get('/', (req, res)=> {
    res.redirect('/alluser');
});


app.get('/profile', requireAuth, (req, res) => {
    res.send('profile');
})

app.get("/home", (req, res) => {
    res.send('home');
})






// app.get('/set-cookie', (req, res) => {
//     res.cookie('newuser', false, { maxAge: 1000*60*60*24, secure: true });
//     res.cookie('islogged', true, { maxAge: 1000*60*60*24 });
//     res.cookie('isregisterd', true, { maxAge: 1000*60*60*24 , httpOnly: true});
//     res.send('cookies addes');
// });


// app.get('/read-cookie', (req, res) => {
//     const cookies = req.cookies;

//     res.send(cookies);
// });

// app.get('/', (req, res)=> {
//     res.redirect('/alluser')
//     // const user = new User({
//     //     userName: "srk",
//     //     email: "r",
//     //     firstName: "fffff",
//     //     lastName: "dqw"
//     // });
//     // user.save()
//     //     .then((results) => {
//     //         res.send(results)
//     //     })
//     //     .catch((err) => console.log(err));
// });

// app.post('/newuser', (req, res) => {
//     console.log(req.body)
//     const user = new User(req.body);

//     user.save()
//         .then((results) => {
//             res.json(results)
//         })
//         .catch((err) => {
//             console.log(err)
//         });
// })

// app.get('/alluser', (req,res) => {
//     User.find()
//         .then((results) => {
//             res.json(results)
//         })
//         .catch((err) => {
//             console.log(err)
//         });
// });
// //
// app.get('*', (req, res) =>{
//     res.send("hjdvj")
// })
