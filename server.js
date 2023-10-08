const express = require('express');
const app = express(); 
const PORT = 3000;
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const { expressjwt: exjwt } = require("express-jwt");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'Content-type, Authorization');
    next();
});

const secretKey = 'My super secret key'; 
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'sai',
        password: '123'
    },
    {
        id: 2,
        username: 'charan',
        password: '123'
    },  
];

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/api/login', (req, res) =>{
    const {username, password} = req.body;
    let found = null;
    for(let user of users) {
        if(username == user.username && password == user.password) {
            found = user;
            //console.log(found);
            break;
        }
        //console.log(found);
    }
   if(found != null){
    let token = jwt.sign({id: found.id, username: found.username}, secretKey, {expiresIn: 180});
    res.json({
        success: true,
        err: null,
        token
    });
   }
   else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect'
        })
    }
});

app.get('/settings', jwtMW, (req, res) => {
    //console.log(req);
    res.json({
        success: true,
        settingsContent: 'Settings page.'
    });
})

app.get('/dashboard', jwtMW, (req, res) => {
    //console.log(req);
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });
})



app.use(function (err, req, res, next){
    // console.log(err.name === 'UnauthorizedError');
    // console.log(err);
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialErr: err,
            err: 'Username or password is incorrect 2.'
        });
    }
    else {
        next(err);
    }
})


app.listen(PORT, () =>{
    console.log(`Serving on the port ${PORT}`);
})