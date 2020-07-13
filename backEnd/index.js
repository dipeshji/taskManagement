const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const app = express();

//database connection
const { db } = require('./config');
mongoose.connect(db,
    { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false }
);

mongoose.connection.on('connected', (err) => {
    if (err) throw err
    console.log(`Connected to database => "${db}"`);

});

//session store
const { timeToLive, autoRemoveInterval } = require('./config');
const store = new mongoStore(
    {
        mongooseConnection: mongoose.connection,
        autoRemove: 'interval',
        autoRemoveInterval: autoRemoveInterval, //expired session will be removed
        ttl: timeToLive //time for which session will live
    }
);


// Session config
const { sessionSecret, maxAge } = require('./config');

const sess = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        httpOnly: true,
        maxAge: Number(maxAge),
        SameSite: true,
        secure: false, //set to true when using https server see docs
    }
}


app.use(session(sess));

// body parser settings
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cross origin request settings
app.use(cors());

//server connection
const http = require('http');
const { port } = require('./config');

const httpServer = http.createServer(app);

httpServer.listen(port, err => {
    if (err) throw err
    console.log(`server running on http://localhost:${port}`);

});

allSession = () => {
    store.all((err, sessions) => {
        console.log(sessions);
        
    })
}
app.use(allSession);
// route settings
const supervisor = require('./routes/supervisor');
const { promises } = require('fs');
app.use('/supervisor', supervisor);

